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
    "https://script.google.com/macros/s/AKfycbzk38ar_wB1F_nGCc3Oegmi25qsLngxfxa5Y3egwzAmDjq1Od3a8dVIl-e-Clz6AYX4/exec";
  // "https://script.google.com/macros/s/AKfycbyLkowyKI9nkJK_cvtUdbiUJSRsols6mz_PSMGgujH-pWTzfDnNtrFfksZF6ZZvfeXANw/exec";
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

  return (
    <>
      <Header />
      <div style={{ height: "8rem" }}></div>
      <Slider />
      <div style={{ height: "8rem" }}></div>
      <FAQ />
    </>
  );
}
