// File: fe/src/components/VideoApp.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { getUVfromCookie } from "../utils/cookie";
import { getTimeStamp } from "../utils/time";
import { parceQuery } from "../utils/query";
import { getConnectionData } from "../utils/connection";
import { FaSearch } from "react-icons/fa";

export default function SearchApp() {
  const [urlInput, setUrlInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState([
    "제목",
    "작성자",
    "스크립트",
  ]);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  // 기기별 저장용 로컬스토리지 키
  const deviceId = getUVfromCookie();
  const STORAGE_KEY = `videoList`;
  const stored = localStorage.getItem(STORAGE_KEY);
  const query_store = parceQuery("store");

  // ----- 2. ISO 8601 duration 파싱/포맷 함수 -----
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

  const loadFromLocalStorage = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    try {
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        setVideos(parsed);
      } else {
        setVideos([]);
      }
    } catch {
      setVideos([]);
    }
  }, [STORAGE_KEY]);
  // ----- 3. 컴포넌트 마운트 시: 로컬스토리지에 저장된 영상 불러오기 -----
  useEffect(() => {
    // if (stored) {
    //   try {
    //     const parsed = JSON.parse(stored);
    //     if (Array.isArray(parsed)) {
    //       setVideos(parsed);
    //     }
    //   } catch {
    //     // parsing 에러 시 무시
    //   }
    // }
    loadFromLocalStorage();

    const handler = () => {
      // 로컬스토리지 변경 감지
      loadFromLocalStorage();
    };
    window.addEventListener("videoListUpdated", handler);
    // 3-1) "더미 URL"을 미리 로드 (원래 있던 동작)
    const dummyUrls = ["https://www.youtube.com/shorts/3igCTmZ9nrY"];
    (async () => {
      for (const url of dummyUrls) {
        if (videos.some((v) => v.url === url)) continue;
        try {
          const [metaRes, transRes] = await Promise.all([
            axios.post("/.netlify/functions/metadata", { url }),
            axios.post("/.netlify/functions/transcript", { url }),
          ]);
          const { metadata } = metaRes.data;
          console.log("메타데이터:", metadata);
          const { transcript } = transRes.data;
          const newVideo = {
            url,
            metadata,
            transcript: transcript || [],
            showScript: false,
          };
          setVideos((prev) => {
            // 현재 prev에 같은 URL이 없으면 추가
            if (prev.some((v) => v.url === url)) return prev;
            const merged = [newVideo, ...prev];
            if (merged.length > 20) merged.pop();
            if (stored || query_store == "y") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            }
            return merged;
          });
        } catch {
          // 무시
        }
      }
    })();
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("videoListUpdated", handler);
    };

    // 3-2) localStorage에 저장된 배열이 있으면 가져와서 상태 세팅
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFromLocalStorage]);

  const deleteVideo = (idx) => {
    setVideos((prev) => {
      // idx 번째를 제외한 새 배열 생성
      const updated = prev.filter((_, i) => i !== idx);
      // localStorage에도 저장
      if (stored || query_store == "y") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      try {
        if (
          window &&
          window.ReactNativeWebView &&
          typeof window.ReactNativeWebView.postMessage === "function"
        ) {
          // React Native WebView 환경에서 postMessage 사용
          window.ReactNativeWebView.postMessage(JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Error saving to Mobile localStorage:", e);
      }
      setSelectedIndex(-1); // 선택된 인덱스 초기화
      return updated;
    });
    addLog("delete");
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

  // ----- 5. 검색 필터 적용 -----
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

  const selected = selectedIndex !== -1 ? videos[selectedIndex] : null;

  let selectedSeconds = 0;
  if (selected) {
    const { hours, minutes, seconds } = parseISODuration(
      selected.metadata.duration
    );
    selectedSeconds = hours * 3600 + minutes * 60 + seconds;
  }
  // 5분(300초) 초과 여부
  const isTooLong = selectedSeconds > 5 * 60;

  const addLog = async (action) => {
    const addrScript =
      "https://script.google.com/macros/s/AKfycbzk38ar_wB1F_nGCc3Oegmi25qsLngxfxa5Y3egwzAmDjq1Od3a8dVIl-e-Clz6AYX4/exec";

    // "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
    let { ip, device } = await getConnectionData();
    var data = JSON.stringify({
      id: getUVfromCookie(),
      action: action,
      utm: parceQuery("utm"),
      store: stored ? "y" : parceQuery("store"),
      time_stamp: getTimeStamp(),
      cnt: "",
    });
    try {
      const response = await axios.get(
        addrScript + "?action=insert&table=use_service&data=" + data
      );
      console.log(JSON.stringify(response));
    } catch (e) {
      console.log("Error", e.data);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "sans-serif",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#6038aa",
      }}
    >
      {/* UP */}
      <div
        style={{
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => {
                if (searchTerm.trim()) {
                  addLog("search");
                }
              }}
              placeholder="검색어 입력"
              style={{
                flex: 1,
                padding: "0.5rem",
                height: "2.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ marginLeft: "1rem" }} />

            <div>
              <FaSearch color="white" />
            </div>
          </div>

          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {["제목", "작성자", "스크립트"].map((src) => (
              <label key={src} style={{ fontSize: "0.9rem", color: "#fff" }}>
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
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            backgroundColor:
              filteredResults.length === 0 ? "transparent" : "#fff",
            borderRadius: "4px",
          }}
        >
          {filteredResults.map(({ video: v, index, sources }) => (
            <li
              key={index}
              onClick={() => {
                if (selectedIndex === index) {
                  setSelectedIndex(-1); // 이미 선택된 항목 클릭 시 선택 해제
                } else {
                  setSelectedIndex(index);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                margin: "0.5rem 0",
                cursor: "pointer",
                backgroundColor:
                  index === selectedIndex ? "#d5a6ff" : "transparent",
                // borderRadius: "4px",
              }}
            >
              {selectedIndex != index ? (
                <>
                  <img
                    src={v.metadata.thumbnail_url}
                    alt="thumb"
                    style={{
                      width: "60px",
                      marginRight: "0.5rem",
                      borderRadius: "4px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div>{v.metadata.title}</div>
                    <div style={{ fontSize: 12, color: "#777" }}>
                      {getTimeStamp(v.metadata.published_at).split(" ")[0]}
                    </div>
                    {sources.length > 0 && (
                      <div style={{ fontSize: "0.75rem", color: "#555" }}>
                        매치: {sources.join(", ")}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ flexDirection: "column", flex: 1 }}>
                  <h2>{selected.metadata.title}</h2>

                  <img
                    src={selected.metadata.thumbnail_url}
                    alt="썸네일"
                    style={{ maxWidth: "100%", margin: "1rem 0" }}
                  />
                  <p>
                    <a
                      onClick={(e) => e.stopPropagation()}
                      href={selected.metadata.video_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      원본 영상 보기
                    </a>
                    <button
                      style={{
                        border: "none",
                        borderRadius: 100,
                        marginLeft: 3,
                      }}
                      onClick={(e) => {
                        navigator.clipboard.writeText(
                          selected.metadata.video_url
                        );
                        e.stopPropagation();
                      }}
                    >
                      <LuClipboardList />
                    </button>
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
                    {formatDuration(
                      parseISODuration(selected.metadata.duration)
                    )}
                  </p>
                  <button
                    onClick={(e) => {
                      toggleScript(selectedIndex);
                      e.stopPropagation();
                    }}
                    disabled={isTooLong} // 5분 초과 시 클릭 불가
                    style={{
                      padding: "0.5rem 1rem",
                      background: isTooLong ? "#aaa" : "#7f5af0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isTooLong ? "not-allowed" : "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {isTooLong
                      ? "스크립트 없음"
                      : selected.showScript
                      ? "스크립트 숨기기"
                      : "스크립트 보기"}
                  </button>
                  <button
                    onClick={(e) => {
                      deleteVideo(selectedIndex);
                      e.stopPropagation();
                    }}
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.5rem 0.8rem",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    <MdDeleteForever />
                  </button>

                  {selected.showScript && (
                    <ul style={{ marginTop: "1rem" }}>
                      {selected.transcript.map((t, idx) => (
                        <li key={idx}>{t.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
          {filteredResults.length === 0 && (
            <p style={{ color: "#fff" }}>검색 결과가 없습니다.</p>
          )}
        </ul>
      </div>

      {/* 스크립트 불가 모달 */}
      {showTranscriptModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowTranscriptModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "90%",
              width: "600px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              스크립트를 받아올 수 없습니다
            </h3>
            <p style={{ marginBottom: "1rem" }}>
              이 영상은 5분을 초과하여, 스크립트를 제공할 수 없습니다.
            </p>
            <button
              onClick={() => setShowTranscriptModal(false)}
              style={{
                padding: "0.5rem 1rem",
                background: "#7f5af0",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
