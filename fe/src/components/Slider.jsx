// File: fe/src/components/Slider.jsx
import React, { useState } from "react";
import "./Slider.css"; // 모달/스피너 스타일을 위한 별도 CSS
import { parceQuery } from "../utils/query";
import { MdDownload } from "react-icons/md";
export default function Slider() {
  const submitCTA = () => {
    // 1. 랜덤으로 쿠키 있거나 없게 정하기 + 링크에 store= 쿼리 추가
    // 2. utm 받아서 cta_utm 이런식으로 바꾸기
    // 3. 링크 이동 (서비스로)

    const hasStore = Math.random() < 0.5; // 50% 확률
    const storeValue = hasStore ? "y" : "n";

    // 2. parseQuery("utm")로 utm을 받아와서 "cta_원래값"으로 변경
    const originalUtm = parceQuery("utm") || "";
    const modifiedUtm = originalUtm ? `cta_${originalUtm}` : "cta";

    // 3. /service로 쿼리 그대로 이동
    const params = new URLSearchParams();
    params.set("store", storeValue);
    if (modifiedUtm) {
      params.set("utm", modifiedUtm);
    }

    // 예: "/service?store=y&utm=cta_abcd"
    window.location.href = `/service?${params.toString()}`;
  };

  return (
    <section className="slider_section">
      <div id="customCarousel1" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                {/* 중앙 텍스트 박스 */}
                <div>
                  <div
                    className="detail-box"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <img
                      src="/images/hero-logo.png"
                      alt="Video Brain 로고"
                      style={{ width: 200, height: 200 }}
                    />
                    <h1 style={{ fontWeight: "bold", fontSize: "3rem" }}>
                      Video Brain
                    </h1>
                    <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
                      제품명이 뭐였더라? 어떻게 쓰는 거였지?
                      <br />
                      왜 검색해도 안 나오는 걸까?
                      <br />
                      <br />
                      수십 개의 링크와 영상 속에서 헤매는 당신을 위해,
                      <br />
                      Video Brain이 대신 기억해 드릴게요.
                    </p>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        // height: "5rem",
                        marginTop: "1rem",
                      }}
                    >
                      <button
                        onClick={submitCTA}
                        style={{
                          width: "20%",
                          marginTop: "1rem",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          fontWeight: 600,
                          background: "#fff",
                          color: "#7f5af0",
                          border: "none",
                          borderRadius: 8,
                          transition: "0.3s",
                        }}
                      >
                        {"🚀 지금 체험하기"}
                      </button>
                      <div style={{ width: "2%" }}></div>
                      <button
                        onClick={() => {}}
                        style={{
                          width: "5%",
                          aspectRatio: "1",
                          marginTop: "1rem",
                          padding: "0.8rem",
                          fontSize: "1rem",
                          fontWeight: 600,
                          background: "#fff",
                          color: "#7f5af0",
                          border: "none",
                          borderRadius: 200,
                          transition: "0.3s",
                        }}
                      >
                        <MdDownload size={30} />
                      </button>
                    </div>
                  </div>
                </div>
                {/* 오른쪽 이메일/조언 폼 */}
              </div>
            </div>
          </div>
          {/* (추가 슬라이드가 필요없다면 이곳에 다른 .carousel-item 주석 처리) */}
        </div>
        {/* 인디케이터·컨트롤이 필요하다면 여기에 추가 */}
      </div>
    </section>
  );
}
