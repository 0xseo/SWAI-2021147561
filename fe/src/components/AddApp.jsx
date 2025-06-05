// File: fe/src/components/VideoApp.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { getUVfromCookie } from "../utils/cookie";
import { getTimeStamp } from "../utils/time";
import { parceQuery } from "../utils/query";
import { getConnectionData } from "../utils/connection";
import { HiPlus } from "react-icons/hi";

export default function SearchApp() {
  const [urlInput, setUrlInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
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
  const STORAGE_KEY = `videos_${deviceId}`;
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

  // ----- 3. 컴포넌트 마운트 시: 로컬스토리지에 저장된 영상 불러오기 -----
  useEffect(() => {
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setVideos(parsed);
          if (parsed.length > 0) setSelectedIndex(0);
        }
      } catch {
        // parsing 에러 시 무시
      }
    }
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

            if (selectedIndex === null) setSelectedIndex(0);
            return merged;
          });
          if (selectedIndex === null) setSelectedIndex(0);
        } catch {
          // 무시
        }
      }
    })();

    // 3-2) localStorage에 저장된 배열이 있으면 가져와서 상태 세팅
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteVideo = (idx) => {
    setVideos((prev) => {
      // idx 번째를 제외한 새 배열 생성
      const updated = prev.filter((_, i) => i !== idx);
      // localStorage에도 저장
      if (stored || query_store == "y") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      // 선택된 인덱스 재조정
      if (selectedIndex === idx) {
        // 현재 보고 있던 영상이 삭제된 경우
        setSelectedIndex(updated.length > 0 ? 0 : null);
      } else if (selectedIndex > idx) {
        // 선택된 인덱스가 삭제된 인덱스보다 뒤에 있으면 -1 보정
        setSelectedIndex((prevIdx) => prevIdx - 1);
      }
      return updated;
    });
    addLog("delete");
  };

  // ----- 4. 영상 추가 함수 (버튼 클릭 시) -----
  const addVideo = async () => {
    setError("");
    if (!urlInput) return setError("URL을 입력해주세요.");
    if (videos.some((v) => v.url === urlInput))
      return setError("이미 등록된 영상입니다.");

    setIsAdding(true);
    try {
      // 2) 메타데이터 먼저 가져오기
      const metaRes = await axios.post("/.netlify/functions/metadata", {
        url: urlInput,
      });
      const { metadata } = metaRes.data;

      // 3) duration 파싱해서 5분 초과 여부 판단
      const { hours, minutes, seconds } = parseISODuration(metadata.duration);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const FIVE_MINUTES = 5 * 60;

      let transcript = [];

      if (totalSeconds > FIVE_MINUTES) {
        // 5분 초과: 스크립트 요청을 건너뛰고 모달 표시
        setShowTranscriptModal(true);
      } else {
        // 5분 이하: 실제로 transcript API 호출
        const transRes = await axios.post("/.netlify/functions/transcript", {
          url: urlInput,
        });
        transcript = transRes.data.transcript || [];
      }
      addLog("append");

      // 4) 새로운 영상 객체 생성
      const newVideo = {
        url: urlInput,
        metadata,
        transcript,
        showScript: false,
      };

      // 5) 상태 업데이트: setVideos(prev ⇒ …) 형태로
      setVideos((prev) => {
        // 중복은 이미 걸렀지만, 안전하게 다시 검사
        if (prev.some((v) => v.url === urlInput)) return prev;
        const updated = [newVideo, ...prev];
        // 20개 초과 시 맨 끝 삭제
        if (updated.length > 20) updated.pop();
        // 로컬스토리지에 저장
        if (stored || query_store == "y") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        return updated;
      });
      setVideo(newVideo);

      setSelectedIndex(0);
      setUrlInput("");
    } catch {
      setError("비디오 로드 실패. URL을 확인해주세요.");
    } finally {
      setIsAdding(false);
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

  const selected = selectedIndex !== null ? videos[selectedIndex] : null;

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
      "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
    let { ip, device } = await getConnectionData();
    var data = JSON.stringify({
      id: getUVfromCookie(),
      action: action,
      cnt: "",
      store: stored ? "y" : parceQuery("store"),
      time_stamp: getTimeStamp(),
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
        flex: 1,
        height: "100%",
        fontFamily: "sans-serif",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          borderRight: "1px solid #ddd",
          padding: "1rem",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
            flexDirection: "row",
            display: "flex",
            flex: 1,
          }}
        >
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="YouTube URL 입력"
            style={{
              flex: 1,
              padding: "0.5rem",
              height: "2.5rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            disabled={isAdding}
          />
          <div style={{ marginLeft: "0.5rem" }} />
          <button
            onClick={addVideo}
            style={{
              height: "2.5rem",
              width: "2.5rem",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isAdding ? "#ccc" : "#7f5af0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isAdding ? "default" : "pointer",
              position: "relative",
            }}
            disabled={isAdding}
          >
            {isAdding && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <span
                  className="button-spinner"
                  style={{
                    margin: 0,
                  }}
                ></span>
              </div>
            )}
            {!isAdding && <HiPlus />}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          flexDirection: "column",
        }}
      >
        {video && (
          <>
            <h2>{video.metadata.title}</h2>

            <img
              src={video.metadata.thumbnail_url}
              alt="썸네일"
              style={{ maxWidth: "100%", margin: "1rem 0" }}
            />
            <p>
              <a
                href={video.metadata.video_url}
                target="_blank"
                rel="noreferrer"
              >
                원본 영상 보기
              </a>
              <button
                style={{ border: "none", borderRadius: 100, marginLeft: 3 }}
              >
                <LuClipboardList />
              </button>
            </p>
            <p>
              <strong>작성자:</strong> {video.metadata.author_name}
            </p>
            <p>
              <strong>게시일:</strong>{" "}
              {new Date(video.metadata.published_at).toLocaleString()}
            </p>
            <p>
              <strong>조회수:</strong> {video.metadata.view_count}
            </p>
            <p>
              <strong>좋아요:</strong> {video.metadata.like_count}
            </p>
            <p>
              <strong>댓글:</strong> {video.metadata.comment_count}
            </p>
            <p>
              <strong>길이:</strong>{" "}
              {formatDuration(parseISODuration(video.metadata.duration))}
            </p>
            <div>
              <button
                onClick={() => toggleScript(selectedIndex)}
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
                  : video.showScript
                  ? "스크립트 숨기기"
                  : "스크립트 보기"}
              </button>
              <button
                onClick={() => deleteVideo(selectedIndex)}
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
            </div>

            {video.showScript && (
              <ul style={{ marginTop: "1rem" }}>
                {video.transcript.map((t, idx) => (
                  <li key={idx}>{t.text}</li>
                ))}
              </ul>
            )}
          </>
        )}
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
