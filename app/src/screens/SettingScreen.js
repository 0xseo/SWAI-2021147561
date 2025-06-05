import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  NativeModules,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { FloatingBubbleModule } = NativeModules;

export default function SettingScreen() {
  const [bubbleEnabled, setBubbleEnabled] = useState(false);
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
    <View>
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
        style={{ margin: 10 }}
      />
    </View>
  );
}
