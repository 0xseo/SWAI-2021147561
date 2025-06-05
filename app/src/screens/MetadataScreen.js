// src/screens/MetadataScreen.js
import React from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function MetadataScreen() {
  // 여기에 실제 Videobrain 사이트의 '메타데이터 입력/조회' 페이지 URL을 넣으세요.
  const videobrainMetaUrl =
    "https://videobrain.netlify.app/service?utm=app&f=a";

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videobrainMetaUrl }}
        startInLoadingState={true}
        style={styles.webview}
        // 필요하면 에러 핸들러나 로딩 인디케이터 커스터마이징 가능
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error (Metadata): ", nativeEvent);
        }}
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
