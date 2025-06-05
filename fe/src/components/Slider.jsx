// File: fe/src/components/Slider.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Slider.css"; // 모달/스피너 스타일을 위한 별도 CSS
import { parceQuery } from "../utils/query";
import { MdDownload } from "react-icons/md";
import { getConnectionData } from "../utils/connection";
import { getUVfromCookie } from "../utils/cookie";
import { getTimeStamp } from "../utils/time";
export default function Slider() {
  const [downloadModal, setDownloadModal] = useState(false);
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

  const addLog = async () => {
    const addrScript =
      "https://script.google.com/macros/s/AKfycbzk38ar_wB1F_nGCc3Oegmi25qsLngxfxa5Y3egwzAmDjq1Od3a8dVIl-e-Clz6AYX4/exec";
    // "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
    let { ip, device } = await getConnectionData();
    var data = JSON.stringify({
      id: getUVfromCookie(),
      utm: parceQuery("utm"),
      time_stamp: getTimeStamp(),
      device: device,
      path: "homepage",
    });
    try {
      const response = await axios.get(
        addrScript + "?action=insert&table=download&data=" + data
      );
      console.log(JSON.stringify(response));
    } catch (e) {
      console.log("Error", e.data);
    }
  };

  // 다운로드 버튼 클릭 시 호출할 함수 예시
  const handleFileDownload = () => {
    const link = document.createElement("a");
    link.href = "/file/videoBrain.apk";
    link.download = "videoBrain.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => {
    setDownloadModal(false);
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
                        onClick={() => {
                          addLog();
                          setDownloadModal(true);
                          setTimeout(() => {
                            handleFileDownload();
                          }, 500);
                        }}
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
      {downloadModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>지금 다운로드가 시작됩니다.</h1>
            <p>
              시작되지 않는다면, QR 코드를 스캔해 보세요.
              <br />
              <img
                src="/images/QR.jpeg"
                alt="QR 코드"
                style={{ width: 300, marginTop: "1rem", borderRadius: 10 }}
              />
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
