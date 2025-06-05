// File: fe/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 전역 스타일(CSS) 혹은 bootstrap 불러오기
import "./index.css"; // FAQ용 커스텀 CSS 포함
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import Home from "./pages/Home";
import Service from "./pages/Service";
// 필요하다면 bootstrap JS(토글, 캐러셀) 기능을 사용하려면 index.js에서 import "bootstrap/dist/js/bootstrap.bundle";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          onEnter={() => {
            // 페이지가 로드될 때마다 콘솔에 메시지를 출력
            console.log("홈페이지에 접속했습니다.");
          }}
          element={
            <div
              style={{
                backgroundColor: "#6038aa",
              }}
            >
              <Home />
            </div>
          }
        />
        <Route path="/service" element={<Service />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "5rem" }}>
              <h2>페이지를 찾을 수 없습니다.</h2>
              <a href="/">홈으로 돌아가기</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
