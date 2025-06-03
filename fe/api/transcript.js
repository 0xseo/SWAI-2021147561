// File: api/transcript.js
import TranscriptAPI from "youtube-transcript-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.body;
  // 동일하게 video ID 추출
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
    return res
      .status(400)
      .json({ error: "Invalid YouTube URL", transcript: [] });
  }

  try {
    const transcript = await TranscriptAPI.getTranscript(id);
    return res.status(200).json({ transcript });
  } catch (e) {
    console.error("Transcript error:", e.message);
    // 캡션이 없거나 쿼터 초과 시 빈 배열 반환
    return res.status(200).json({ transcript: [] });
  }
}
