// File: fe/api/transcript.js

const TranscriptAPI = require("youtube-transcript-api");

// Netlify Functions 핸들러는 (event, context) 인자를 받으며,
// 반드시 { statusCode, body } 객체를 반환해야 합니다.
exports.handler = async function (event, context) {
  // POST가 아니면 405(Method Not Allowed) 반환
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
      body: JSON.stringify({ error: "Invalid JSON", transcript: [] }),
    };
  }

  const { url } = body;
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required", transcript: [] }),
    };
  }

  // URL에서 YouTube 비디오 ID를 추출하는 함수
  const extractVideoId = (u) => {
    try {
      const parsed = new URL(u);
      // query string ?v=xxxx
      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v");
      }
      // youtu.be/xxxx
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }
      // /shorts/xxxx
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
      body: JSON.stringify({ error: "Invalid YouTube URL", transcript: [] }),
    };
  }

  try {
    // youtube-transcript-api의 getTranscript 메서드를 호출
    const transcript = await TranscriptAPI.getTranscript(videoId);
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript }),
    };
  } catch (e) {
    console.error("Transcript error:", e.message);
    // 캡션이 없거나 쿼터 초과 등의 이유로 실패 시 빈 배열 반환
    return {
      statusCode: 200,
      body: JSON.stringify({ transcript: [] }),
    };
  }
};
