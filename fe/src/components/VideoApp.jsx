// File: fe/src/components/VideoApp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VideoApp() {
  const [urlInput, setUrlInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState([
    "제목",
    "작성자",
    "스크립트",
  ]);
  const [error, setError] = useState("");

  // 미리 로드할 더미 URL
  const dummyUrls = ["https://www.youtube.com/shorts/3igCTmZ9nrY"];

  useEffect(() => {
    (async () => {
      for (const url of dummyUrls) {
        if (videos.some((v) => v.url === url)) continue;
        try {
          const [metaRes, transRes] = await Promise.all([
            axios.post("/.netlify/functions/metadata", { url }),
            axios.post("/.netlify/functions/transcript", { url }),
          ]);
          const { metadata } = metaRes.data;
          const { transcript } = transRes.data;
          const newVideo = {
            url,
            metadata,
            transcript: transcript || [],
            showScript: false,
          };
          setVideos((prev) => [newVideo]);
          if (selectedIndex === null) setSelectedIndex(0);
        } catch {
          // 무시
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function parseISODuration(isoString) {
    const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    return { hours, minutes, seconds };
  }

  const formatDuration = ({ hours, minutes, seconds }) => {
    const twoDigits = (n) => String(n).padStart(2, "0");
    if (hours > 0) {
      return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
    }
    return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
  };

  const addVideo = async () => {
    setError("");
    if (!urlInput) return setError("URL을 입력해주세요.");
    if (videos.some((v) => v.url === urlInput))
      return setError("이미 등록된 영상입니다.");
    try {
      const [metaRes, transRes] = await Promise.all([
        axios.post("/.netlify/functions/metadata", { url: urlInput }),
        axios.post("/.netlify/functions/transcript", { url: urlInput }),
      ]);
      const { metadata } = metaRes.data;
      const { transcript } = transRes.data;
      const newVideo = {
        url: urlInput,
        metadata,
        transcript: transcript || [],
        showScript: false,
      };
      setVideos([newVideo, ...videos]);
      setSelectedIndex(0);
      setUrlInput("");
    } catch {
      setError("비디오 로드 실패. URL을 확인해주세요.");
    }
  };

  const toggleScript = (idx) => {
    setVideos(
      videos.map((v, i) =>
        i === idx ? { ...v, showScript: !v.showScript } : v
      )
    );
  };

  const handleSourceToggle = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const filteredResults = videos.reduce((acc, v, i) => {
    const term = searchTerm.toLowerCase();
    const sources = [];
    if (searchTerm && v.metadata.title.toLowerCase().includes(term))
      sources.push("제목");
    if (searchTerm && v.metadata.author_name.toLowerCase().includes(term))
      sources.push("작성자");
    if (searchTerm) {
      const combined = v.transcript
        .map((t) => t.text)
        .join(" ")
        .toLowerCase();
      if (combined.includes(term)) sources.push("스크립트");
    }
    if (!searchTerm || sources.some((s) => selectedSources.includes(s))) {
      const matched = searchTerm
        ? sources.filter((s) => selectedSources.includes(s))
        : [];
      acc.push({ video: v, index: i, sources: matched });
    }
    return acc;
  }, []);

  const selected = selectedIndex !== null ? videos[selectedIndex] : null;

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "sans-serif" }}>
      {/* Left */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontWeight: "bold" }}>체험해 보세요!</h2>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="YouTube URL 입력"
            style={{ width: "100%", padding: "0.5rem" }}
          />
          <button
            onClick={addVideo}
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.5rem" }}
          >
            영상 추가
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색어 입력"
            style={{ width: "100%", padding: "0.5rem" }}
          />
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {["제목", "작성자", "스크립트"].map((src) => (
              <label key={src} style={{ fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={selectedSources.includes(src)}
                  onChange={() => handleSourceToggle(src)}
                  style={{ marginRight: "0.25rem" }}
                />
                {src}
              </label>
            ))}
          </div>
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredResults.map(({ video: v, index, sources }) => (
            <li
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                cursor: "pointer",
                backgroundColor:
                  index === selectedIndex ? "#d5a6ff" : "transparent",
                borderRadius: "4px",
              }}
            >
              <img
                src={v.metadata.thumbnail_url}
                alt="thumb"
                style={{ width: "60px", marginRight: "0.5rem" }}
              />
              <div style={{ flex: 1 }}>
                <div>{v.metadata.title}</div>
                {sources.length > 0 && (
                  <div style={{ fontSize: "0.75rem", color: "#555" }}>
                    매치: {sources.join(", ")}
                  </div>
                )}
              </div>
            </li>
          ))}
          {filteredResults.length === 0 && <p>검색 결과가 없습니다.</p>}
        </ul>
      </div>

      {/* Right */}
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
        {selected ? (
          <>
            <h2>{selected.metadata.title}</h2>

            <img
              src={selected.metadata.thumbnail_url}
              alt="썸네일"
              style={{ maxWidth: "100%", margin: "1rem 0" }}
            />
            <p>
              <a
                href={selected.metadata.video_url}
                target="_blank"
                rel="noreferrer"
              >
                원본 영상 보기
              </a>
            </p>
            <p>
              <strong>작성자:</strong> {selected.metadata.author_name}
            </p>
            <p>
              <strong>게시일:</strong>{" "}
              {new Date(selected.metadata.published_at).toLocaleString()}
            </p>
            <p>
              <strong>조회수:</strong> {selected.metadata.view_count}
            </p>
            <p>
              <strong>좋아요:</strong> {selected.metadata.like_count}
            </p>
            <p>
              <strong>댓글:</strong> {selected.metadata.comment_count}
            </p>
            <p>
              <strong>길이:</strong>{" "}
              {formatDuration(parseISODuration(selected.metadata.duration))}
            </p>
            <button
              onClick={() => toggleScript(selectedIndex)}
              style={{ padding: "0.5rem", marginTop: "1rem" }}
            >
              {selected.showScript ? "스크립트 숨기기" : "스크립트 보기"}
            </button>
            {selected.showScript && (
              <ul style={{ marginTop: "1rem" }}>
                {selected.transcript.map((t, idx) => (
                  <li key={idx}>{t.text}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>목록에서 영상을 선택하세요.</p>
        )}
      </div>
    </div>
  );
}
