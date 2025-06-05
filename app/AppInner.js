import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddScreen from "./src/screens/AddScreen";
import ListScreen from "./src/screens/ListScreen";
import {
  Alert,
  AppState,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingScreen from "./src/screens/SettingScreen";
import Icon from "react-native-vector-icons/Ionicons";
const Tab = createBottomTabNavigator();

const { FloatingBubbleModule } = NativeModules;
const bubbleEmitter = new NativeEventEmitter(FloatingBubbleModule);

export default function AppInner() {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      checkOverlayPermission();
      handleStartBubble();
    }
    const subscription = bubbleEmitter.addListener("bubbleClick", () => {
      Alert.alert("플로팅 버튼 클릭", "플로팅 버튼이 클릭되었습니다!");
    });

    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          if (Platform.OS === "android" && Platform.Version >= 23) {
            handleStartBubble();
          }
        }
        appState.current = nextAppState;
      }
    );
    return () => {
      subscription.remove();
      appStateListener.remove();
    };
  }, []);
  // );
  const checkOverlayPermission = async () => {
    try {
      const canDraw = await FloatingBubbleModule.checkOverlayPermission();
      if (!canDraw) {
        Alert.alert(
          "권한 요청",
          "플로팅 버튼을 사용하려면 “다른 앱 위에 그리기” 권한이 필요합니다.\n설정 화면으로 이동하시겠습니까?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정으로 이동",
              onPress: () => {
                FloatingBubbleModule.openOverlayPermissionSettings();
              },
            },
          ]
        );
      }
    } catch (e) {
      console.warn("Overlay permission check error:", e);
    }
  };

  const handleStartBubble = async () => {
    const canDraw = await FloatingBubbleModule.checkOverlayPermission();
    if (canDraw) {
      const bubbleEnabled = await AsyncStorage.getItem("bubbleEnabled");
      if (bubbleEnabled !== "false") {
        FloatingBubbleModule.startService();
      }
    } else {
      Alert.alert(
        "권한 필요",
        "먼저 “다른 앱 위에 그리기” 권한을 허용하셔야 플로팅 버튼을 사용할 수 있습니다."
      );
    }
  };
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6038aa",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Add"
          component={AddScreen}
          options={{
            tabBarLabel: "영상 추가",
            tabBarIcon: ({ focused }) => (
              <Icon name="add" size={20} color={focused ? "#6038aa" : "gray"} />
            ), // 아이콘을 사용하지 않으려면 null 반환
          }}
        />
        <Tab.Screen
          name="List"
          component={ListScreen}
          options={{
            tabBarLabel: "목록·검색",
            tabBarIcon: ({ focused }) => (
              <Icon
                name="search"
                size={20}
                color={focused ? "#6038aa" : "gray"}
              />
            ), // 아이콘을 사용하지 않으려면 null 반환
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            tabBarLabel: "설정",
            tabBarIcon: ({ focused }) => (
              <Icon
                name="settings-outline"
                size={25}
                color={focused ? "#6038aa" : "gray"}
              />
            ), // 아이콘을 사용하지 않으려면 null 반환
          }}
        />
      </Tab.Navigator>
    </>
  );
}
