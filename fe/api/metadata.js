// File: api/metadata.js
import axios from "axios";

export default async function handler(req, res) {
  // POST 요청 본문에 { url: '...' }이 담겨있다고 가정
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.body;
  // URL에서 video ID 추출 (watch, youtu.be, shorts 등)
  const extractVideoId = (u) => {
    try {
      const parsed = new URL(u);
      if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
      const match = parsed.pathname.match(/\/shorts\/(.+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const id = extractVideoId(url);
  if (!id) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const parts = ["snippet", "contentDetails", "statistics"].join(",");
  const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=${parts}&id=${id}&key=${apiKey}`;

  try {
    const response = await axios.get(ytUrl);
    const item = response.data.items[0];
    if (!item) {
      return res.status(404).json({ error: "Video not found" });
    }
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
    return res.status(200).json({ metadata });
  } catch (e) {
    console.error("Metadata error:", e.message);
    return res.status(500).json({ error: "메타데이터 추출 실패" });
  }
}
