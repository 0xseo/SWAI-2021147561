// File: fe/src/components/FAQ.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Slider.css"; // 모달/스피너 스타일을 위한 별도 CSS
import { getUVfromCookie } from "../utils/cookie";

export default function FAQ() {
  const addrScript =
    "https://script.google.com/macros/s/AKfycbzk38ar_wB1F_nGCc3Oegmi25qsLngxfxa5Y3egwzAmDjq1Od3a8dVIl-e-Clz6AYX4/exec";

  // 폼 상태 관리
  const [email, setEmail] = useState("");
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
        `${addrScript}?action=insert&table=advice&data=${encodeURIComponent(
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
  return (
    <section className="contact_section layout_padding">
      <div style={{ height: "8rem" }}></div>
      <div className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          유튜브, Shorts 보며 플로팅 버튼으로 간편하게 URL을 추가해 보세요.
        </div>
        <div>
          <img
            src="/images/mockup.png"
            alt="Video Brain 로고"
            style={{ width: "100%", marginBottom: "5rem" }}
          />
        </div>
        <div className="heading_container">
          <h2 className="text-left mb-4" style={{ fontWeight: "bold" }}>
            FAQ
          </h2>
        </div>
        <div className="row">
          {/* 왼쪽 문단 */}
          <div className="col-md-6">
            <div className="faq-item mb-5">
              <h5 className="faq-question">
                Q. 이 서비스는 어떤 기능을 하나요?
              </h5>
              <p className="faq-answer">
                A. 여러 영상 플랫폼에서 저장한 영상을 기록하고, 텍스트 기반으로
                쉽게 다시 찾을 수 있게 도와주는 서비스입니다.
              </p>
            </div>
            <div className="faq-item mb-5">
              <h5 className="faq-question">Q. 영상은 어떻게 등록하나요?</h5>
              <p className="faq-answer">
                A. 보고 있는 영상의 링크를 복사해 서비스 내에 붙여넣기만 하면
                됩니다.
              </p>
            </div>
          </div>
          {/* 오른쪽 문단 */}
          <div className="col-md-6">
            <div className="faq-item mb-5">
              <h5 className="faq-question">Q. 어떤 플랫폼들을 지원하나요?</h5>
              <p className="faq-answer">
                A. 현재는 YouTube, Shorts를 지원하며, 향후 Instagram Reels,
                TikTok도 추가 예정입니다.
              </p>
            </div>
            <div className="faq-item mb-5">
              <h5 className="faq-question">
                Q. 저장된 영상은 어떤 방식으로 검색되나요?
              </h5>
              <p className="faq-answer">
                A. 영상의 스크립트, 썸네일, 제목, 사용자 메모, 그리고 AI가
                생성한 맥락 데이터를 바탕으로 검색할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div>
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
              <p style={{ color: "red", marginBottom: "0.5rem" }}>{errorMsg}</p>
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

            {isLoading && (
              <div className="spinner-overlay">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 스타일은 공통 CSS 파일(후술)이나 전역 CSS에 추가 */}
      <style jsx>{`
        .faq-question {
          color: #5a3ec8;
          margin-bottom: 0.7rem;
          font-weight: bold;
        }
        .faq-answer {
          color: #555;
          line-height: 1.6;
        }
        .faq-item {
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
      `}</style>
      <div style={{ height: "8rem" }}></div>
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
