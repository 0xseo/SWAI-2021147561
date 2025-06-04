import React, { useEffect } from "react";
import Header from "../components/Header";
import Slider from "../components/Slider";
import FAQ from "../components/FAQ";
import axios from "axios";
import { getUVfromCookie } from "../utils/cookie";
import { getTimeStamp } from "../utils/time";
import { getConnectionData } from "../utils/connection";
import { parceQuery } from "../utils/query";

export default function Home() {
  const addrScript =
    "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
  useEffect(() => {
    sendLog();
  }, []);
  const sendLog = async () => {
    let { ip, device } = await getConnectionData();
    var data = JSON.stringify({
      id: getUVfromCookie(),
      landingUrl: window.location.href,
      ip: ip,
      time_stamp: getTimeStamp(),
      utm: parceQuery("utm"),
      device: device,
      cnt: "",
    });
    try {
      const response = await axios.get(
        addrScript + "?action=insert&table=visitor_landing&data=" + data
      );
      console.log(JSON.stringify(response));
    } catch (e) {
      console.log("Error", e.data);
    }
  };
  const submitCTA = () => {
    // 1. 랜덤으로 쿠키 있거나 없게 정하기 + 링크에 store= 쿼리 추가
    // 2. utm 받아서 cta_utm 이런식으로 바꾸기
    // 3. 링크 이동 (서비스로)

    const hasStore = Math.random() < 0.5; // 50% 확률
    const storeValue = hasStore ? "y" : "n";

    // 2. parseQuery("utm")로 utm을 받아와서 "cta_원래값"으로 변경
    const originalUtm = parceQuery("utm") || "";
    const modifiedUtm = originalUtm ? `cta_${originalUtm}` : "";

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
    <>
      <Header />
      <button onClick={() => submitCTA()}>
        <h2>체험해보기</h2>
      </button>
      <div style={{ height: "8rem" }}></div>
      <Slider />
      <div style={{ height: "8rem" }}></div>
      <FAQ />
    </>
  );
}
