/*
File: be/index.js
Express server with improved video ID extraction and normalized video URL
*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const TranscriptAPI = require("youtube-transcript-api");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Utility: extract YouTube video ID and construct watch URL
function extractVideoId(url) {
  try {
    const u = new URL(url);
    let id;
    if (u.searchParams.get("v")) {
      id = u.searchParams.get("v");
    } else if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else {
      const shortsMatch = u.pathname.match(/\/shorts\/(.+)/);
      if (shortsMatch) {
        id = shortsMatch[1];
      }
    }
    return id || null;
  } catch {
    return null;
  }
}

// Transcript endpoint
app.post("/api/transcript", async (req, res) => {
  const url = req.body.url;
  const id = extractVideoId(url);
  if (!id) {
    return res
      .status(400)
      .json({ error: "Invalid YouTube URL", transcript: [] });
  }
  try {
    const transcript = await TranscriptAPI.getTranscript(id);
    res.json({ transcript });
  } catch (e) {
    console.error("Transcript error:", e.message);
    res.json({ transcript: [] });
  }
});

// Metadata endpoint using YouTube Data API
app.post("/api/metadata", async (req, res) => {
  try {
    const url = req.body.url;
    const id = extractVideoId(url);
    if (!id) throw new Error("Invalid YouTube URL");

    const apiKey = process.env.YOUTUBE_API_KEY;
    const parts = ["snippet", "contentDetails", "statistics"].join(",");
    const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=${parts}&id=${id}&key=${apiKey}`;
    const response = await axios.get(ytUrl);
    const item = response.data.items[0];
    const watchUrl = `https://www.youtube.com/watch?v=${id}`;
    const metadata = {
      video_url: watchUrl,
      title: item.snippet.title,
      author_name: item.snippet.channelTitle,
      thumbnail_url: item.snippet.thumbnails.high.url,
      published_at: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      view_count: item.statistics.viewCount,
      like_count: item.statistics.likeCount,
      comment_count: item.statistics.commentCount,
    };
    res.json({ metadata });
  } catch (e) {
    console.error("Metadata error:", e.message);
    res.status(500).json({ error: "메타데이터 추출 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
