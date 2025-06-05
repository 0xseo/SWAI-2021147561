import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useRef } from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function AddScreen() {
  const videobrainMetaUrl =
    "https://videobrain.netlify.app/service?utm=app&f=a";
  const STORAGE_KEY = "videoList";
  const webviewRef = useRef(null);

  const handleOnMessage = async (event) => {
    try {
      const jsonString = event.nativeEvent.data;
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log("WebView onMessage 저장 성공:", jsonString);
    } catch (error) {
      console.error("Error in WebView onMessage 저장 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: videobrainMetaUrl }}
        startInLoadingState={true}
        style={styles.webview}
        // 필요하면 에러 핸들러나 로딩 인디케이터 커스터마이징 가능
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error (Metadata): ", nativeEvent);
        }}
        onMessage={handleOnMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Android에서 상태바 영역을 피하기 위해 paddingTop 적용
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#6038aa",
  },
  webview: {
    flex: 1,
  },
});
