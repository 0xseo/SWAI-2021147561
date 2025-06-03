// File: fe/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/js/bootstrap.bundle"; // 캐러셀, 토글 등 JS 기능

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
