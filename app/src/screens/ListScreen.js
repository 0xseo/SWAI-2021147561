// src/screens/ListScreen.js
import React from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListScreen() {
  const videobrainListUrl =
    "https://videobrain.netlify.app/service?utm=app&f=s";
  const STORAGE_KEY = "videoList";

  const [isLoading, setIsLoading] = useState(true);
  const webviewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let canceled = false;
      (async () => {
        try {
          const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
          if (canceled) return;
          console.log(
            "ListScreen useFocusEffect jsonString:",
            jsonString.length
          );

          if (jsonString && webviewRef.current) {
            const escaped = jsonString
              .replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"');
            console.log("ListScreen useFocusEffect escaped:", escaped.length);
            const script = `
            (function() {
              try {
                window.localStorage.setItem("videoList", "${escaped}");
              } catch (e) {
                console.warn("injected script error:", e);
              }
            })();
            true;
            `;
            webviewRef.current.injectJavaScript(script);
          }
        } catch (error) {
          console.error("Error in ListScreen useFocusEffect:", error);
        } finally {
          if (!canceled) {
            setIsLoading(false);
          }
        }
      })();
      return () => {
        canceled = true;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: videobrainListUrl }}
        startInLoadingState={true}
        style={styles.webview}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error (List): ", nativeEvent);
        }}
        onMessage={async (event) => {
          try {
            const updatedJson = event.nativeEvent.data;
            await AsyncStorage.setItem(STORAGE_KEY, updatedJson);
            console.log("WebView onMessage 저장 성공:", updatedJson);
          } catch (error) {
            console.error("WebView onMessage error:", error);
          }
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
