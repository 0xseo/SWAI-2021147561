// File: fe/src/components/Slider.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Slider.css"; // 모달/스피너 스타일을 위한 별도 CSS

export default function Slider() {
  // 폼 상태 관리
  const [email, setEmail] = useState("");
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Google Apps Script 엔드포인트 (원본 코드에서 쓰던 주소를 그대로 사용)
  const addrScript =
    "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";

  // 이메일 형식 검증 함수
  const validateEmail = (email) => {
    const re =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    setErrorMsg("");

    if (!email || !validateEmail(email)) {
      setErrorMsg("이메일이 유효하지 않아 알림을 드릴 수가 없습니다.");
      return;
    }

    const payload = {
      id: getUVfromCookie(),
      email: email,
      advice: advice,
    };

    setIsLoading(true);

    try {
      // GET 요청으로 데이터 전송
      await axios.get(
        `${addrScript}?action=insert&table=tab_final&data=${encodeURIComponent(
          JSON.stringify(payload)
        )}`
      );

      // 전송 성공 시 모달 표시 및 입력값 초기화
      setShowModal(true);
      setEmail("");
      setAdvice("");
    } catch (err) {
      console.error(err);
      setErrorMsg("전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setShowModal(false);
  };

  // (원본에서 쓰던) 쿠키 기반 사용자 ID 생성 함수
  function getCookieValue(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }
  function setCookieValue(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  function getUVfromCookie() {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingHash = getCookieValue("user");
    if (!existingHash) {
      setCookieValue("user", hash, 180);
      return hash;
    } else {
      return existingHash;
    }
  }
  return (
    <section className="slider_section">
      <div id="customCarousel1" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row">
                {/* 왼쪽 비디오 박스 */}
                <div className="col-md-3">
                  <div className="img-box" style={{ position: "relative" }}>
                    {/* 실제 비디오 */}
                    <video
                      autoPlay
                      muted
                      loop
                      id="video"
                      src="/images/heroVideo.mp4"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        zIndex: 1,
                      }}
                    ></video>
                  </div>
                </div>
                {/* 중앙 텍스트 박스 */}
                <div className="col-md-5" style={{ paddingLeft: 80 }}>
                  <div className="detail-box" style={{ color: "#fff" }}>
                    <img
                      src="/images/hero-logo.png"
                      alt="Video Brain 로고"
                      style={{ width: 200, height: 200 }}
                    />
                    <h1 style={{ fontWeight: "bold", fontSize: "3rem" }}>
                      Video Brain
                    </h1>
                    <p>
                      제품명이 뭐였더라? 어떻게 쓰는 거였지?
                      <br />
                      왜 검색해도 안 나오는 걸까?
                      <br />
                      <br />
                      수십 개의 링크와 영상 속에서 헤매는 당신을 위해,
                      <br />
                      Video Brain이 대신 기억해 드릴게요.
                    </p>
                  </div>
                </div>
                {/* 오른쪽 이메일/조언 폼 */}
                <div className="col-md-4">
                  <div
                    style={{
                      padding: "1rem",
                      background: "#f9f7ff",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
                      📩 이메일을 남겨주시면
                      <br />
                      서비스 런칭 시 가장 먼저 알려드릴게요!
                    </p>
                    <input
                      type="email"
                      placeholder="이메일 주소 입력"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginBottom: "1rem",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                      }}
                    />
                    <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>
                      💡 이런 기능 있었으면 좋겠다?
                    </p>
                    <textarea
                      rows={4}
                      placeholder="서비스에 대한 조언을 남겨주세요 :)"
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        marginBottom: "1.5rem",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        resize: "vertical",
                      }}
                    ></textarea>
                    {errorMsg && (
                      <p style={{ color: "red", marginBottom: "0.5rem" }}>
                        {errorMsg}
                      </p>
                    )}
                    <button
                      onClick={handleSubmit}
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        fontSize: "1rem",
                        fontWeight: 600,
                        background: "#7f5af0",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        transition: "0.3s",
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "전송 중..." : "🚀 지금 등록하기"}
                    </button>

                    {/* 로딩 스피너 */}
                    {isLoading && (
                      <div className="spinner-overlay">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* (추가 슬라이드가 필요없다면 이곳에 다른 .carousel-item 주석 처리) */}
        </div>
        {/* 인디케이터·컨트롤이 필요하다면 여기에 추가 */}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>함께해 주셔서 고맙습니다! 🙌</h1>
            <p>
              Video Brain의 여정에 함께해 주셔서 감사합니다.
              <br />
              앞으로 좋은 소식, 가장 먼저 전해드릴게요 💌
            </p>
            <button className="modal-close-btn" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
