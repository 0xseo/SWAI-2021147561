import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoApp from "../components/VideoApp";
import { getUVfromCookie } from "../utils/cookie";
import { getTimeStamp } from "../utils/time";
import { parceQuery } from "../utils/query";
import axios from "axios";
import { getConnectionData } from "../utils/connection";
import AddApp from "../components/AddApp";
import SearchApp from "../components/SearchApp";

export default function Service() {
  const [dv, setDv] = useState("mobile");
  const [utm, setUtm] = useState();
  const [f, setF] = useState("");
  const addrScript =
    "https://script.google.com/macros/s/AKfycbzk38ar_wB1F_nGCc3Oegmi25qsLngxfxa5Y3egwzAmDjq1Od3a8dVIl-e-Clz6AYX4/exec";

  // "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
  useEffect(() => {
    setUtm(parceQuery("utm"));
    setF(parceQuery("f"));
    sendVisitLog();
  }, []);
  const sendVisitLog = async () => {
    // 기기별 저장용 로컬스토리지 키
    const deviceId = getUVfromCookie();
    const STORAGE_KEY = `videos_${deviceId}`;
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      var { ip, device } = await getConnectionData();
    } catch (e) {
      console.log("Error", e);
    }
    var data = JSON.stringify({
      id: getUVfromCookie(),
      landingUrl: window.location.href,
      ip: ip || "",
      time_stamp: getTimeStamp(),
      utm: utm,
      device: device,
      store: utm == "app" || stored ? "y" : parceQuery("store"),
      cnt: "",
    });
    try {
      const response = await axios.get(
        addrScript + "?action=insert&table=visitor_service&data=" + data
      );
      console.log(JSON.stringify(response));
    } catch (e) {
      console.log("Error", e.data);
      console.log(
        addrScript + "?action=insert&table=visitor_service&data=" + data
      );
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: dv == "mobile" ? "#6038aa" : "#fff",
        minHeight: "100vh",
      }}
    >
      <div style={{ backgroundColor: "#6038aa" }}>
        <Header />
      </div>
      {utm !== "app" ? <VideoApp /> : f == "a" ? <AddApp /> : <SearchApp />}
    </div>
  );
}
