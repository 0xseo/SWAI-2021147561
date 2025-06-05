// src/screens/ListScreen.js
import React from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function ListScreen() {
  // 여기에 실제 Videobrain 사이트의 '목록·검색' 페이지 URL을 넣으세요.
  const videobrainListUrl = "https://videobrain.netlify.app/service?f=s";

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videobrainListUrl }}
        startInLoadingState={true}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error (List): ", nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6038aa",

    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
