export async function getConnectionData() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const device = isMobile ? "mobile" : "desktop";

  try {
    // 2) Netlify Function 호출 (배포 후에도 이 경로를 유지해야 함)
    const response = await fetch("/.netlify/functions/get-ip");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // 함수에서 반환하는 형태: { ip: "실제 IP" }
    const ip = data.ip || "unknown";
    return { ip, device };
  } catch (e) {
    console.log("Error fetching IP from Netlify Function:", e);
    return { ip: "unknown", device };
  }
}
