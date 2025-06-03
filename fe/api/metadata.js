// File: fe/api/metadata.js

const axios = require("axios");

exports.handler = async function (event, context) {
  // POST 요청이 아니면 405 반환
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // request body(JSON) 파싱
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { url } = body;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
    };
  }

  // URL에서 YouTube video ID 추출
  const extractVideoId = (u) => {
    try {
      const parsed = new URL(u);
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }
      const match = parsed.pathname.match(/\/shorts\/(.+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const videoId = extractVideoId(url);
  if (!videoId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid YouTube URL" }),
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "YOUTUBE_API_KEY is not set" }),
    };
  }

  const parts = ["snippet", "contentDetails", "statistics"].join(",");
  const ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=${parts}&id=${videoId}&key=${apiKey}`;

  try {
    const response = await axios.get(ytUrl);
    const item = response.data.items[0];

    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Video not found" }),
      };
    }

    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
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

    return {
      statusCode: 200,
      body: JSON.stringify({ metadata }),
    };
  } catch (e) {
    console.error("Metadata error:", e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "메타데이터 추출 실패" }),
    };
  }
};
