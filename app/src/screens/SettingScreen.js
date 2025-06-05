import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  NativeModules,
  Switch,
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
const { FloatingBubbleModule } = NativeModules;

export default function SettingScreen() {
  const [bubbleEnabled, setBubbleEnabled] = useState(false);
  useEffect(() => {
    (async () => {
      const isBubbleEnabled = await AsyncStorage.getItem("bubbleEnabled");
      if (isBubbleEnabled === "true") {
        setBubbleEnabled(true);
      } else {
        setBubbleEnabled(false);
      }
    })();
  }, []);
  const handleStop = async () => {
    FloatingBubbleModule.stopService();
    await AsyncStorage.setItem("bubbleEnabled", "false");
  };
  const handleStart = async () => {
    FloatingBubbleModule.startService();
    await AsyncStorage.setItem("bubbleEnabled", "true");
    FloatingBubbleModule.startService();
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#6038aa",
        padding: 20,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 150,
          height: 150,
          borderRadius: 150,
          backgroundColor: "#fff",
          marginVertical: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../images/logo.png")}
          style={{ width: 80, height: 80 }}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            marginRight: 10,
            fontWeight: "bold",
          }}
        >
          플로팅 버튼
        </Text>
        <Switch
          onValueChange={async (value) => {
            if (value) {
              await handleStart();
              setBubbleEnabled(true);
            } else {
              await handleStop();
              setBubbleEnabled(false);
            }
          }}
          value={bubbleEnabled}
          style={{ marginVertical: 10 }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          // thumbColor={bubbleEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
      <Pressable
        style={{
          position: "absolute",
          bottom: 20,
          backgroundColor: "white",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={() => {
          Linking.openURL("https://videobrain.netlify.app?utm=appSetting");
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#6038aa99",
            textAlign: "center",
          }}
        >
          웹사이트 방문하기
        </Text>
      </Pressable>
    </View>
  );
}
