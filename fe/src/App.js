// File: fe/src/App.jsx
import React from "react";
import Header from "./components/Header";
import Slider from "./components/Slider";
import VideoApp from "./components/VideoApp";
import FAQ from "./components/FAQ";

// 전역 스타일(CSS) 혹은 bootstrap 불러오기
import "./index.css"; // FAQ용 커스텀 CSS 포함
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
// 필요하다면 bootstrap JS(토글, 캐러셀) 기능을 사용하려면 index.js에서 import "bootstrap/dist/js/bootstrap.bundle";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#6038aa",
      }}
    >
      <Header />
      <div style={{ height: "8rem" }}></div>
      <Slider />
      <div style={{ height: "8rem" }}></div>

      {/* 비디오 메타데이터 + 목록/검색/상세 영역 */}
      <section style={{ padding: "2rem 0", background: "#ebd4ff" }}>
        <div className="container">
          <div style={{ height: "2rem" }}></div>

          <VideoApp />
        </div>
      </section>

      <FAQ />

      {/* Footer가 필요하면 여기에 추가 */}
    </div>
  );
}

export default App;
