// File: fe/src/components/Header.jsx
import React from "react";

export default function Header() {
  return (
    <header className="header_section">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <div style={{ flex: 1 }}>
            <img
              src="/images/hero-logo.png"
              alt="Video Brain 로고"
              style={{ width: 50, height: 50, margin: 10 }}
            />
          </div>
          <a className="navbar-brand" href="/" style={{ flex: 1 }}>
            <span
              style={{ color: "#fff", fontWeight: "bold", fontSize: "1.5rem" }}
            >
              Video Brain
            </span>
          </a>
          <div style={{ width: 50, height: 50 }}></div>
        </nav>
      </div>
    </header>
  );
}
