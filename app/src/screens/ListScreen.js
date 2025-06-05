// src/screens/ListScreen.js
import React from "react";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { WebView } from "react-native-webview";

export default function ListScreen() {
  const videobrainListUrl =
    "https://videobrain.netlify.app/service?utm=app&f=s";

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
