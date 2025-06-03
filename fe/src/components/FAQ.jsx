// File: fe/src/components/FAQ.jsx
import React from "react";

export default function FAQ() {
  return (
    <section className="contact_section layout_padding">
      <div style={{ height: "8rem" }}></div>

      <div className="container">
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
    </section>
  );
}
