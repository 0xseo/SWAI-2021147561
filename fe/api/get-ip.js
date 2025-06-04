exports.handler = async (event, context) => {
  // Netlify는 클라이언트 IP를 x-forwarded-for 헤더에 넣어줍니다.
  const forwardedFor = event.headers["x-forwarded-for"] || "";
  // x-forwarded-for 헤더에는 "클라이언트IP, 프록시1, 프록시2, ..." 형식으로 올 수 있으므로
  // 맨 앞에 오는 값(실제 클라이언트 IP)을 꺼냅니다.
  const ip = forwardedFor.split(",")[0].trim() || "unknown";

  return {
    statusCode: 200,
    body: JSON.stringify({ ip }),
  };
};
