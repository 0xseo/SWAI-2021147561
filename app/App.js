// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// 화면 컴포넌트 임포트 (나중에 src/screens 폴더에 파일 생성)
import MetadataScreen from "./src/screens/MetadataScreen";
import ListScreen from "./src/screens/ListScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // 상단 헤더 숨기기
        }}
      >
        <Tab.Screen
          name="Metadata"
          component={MetadataScreen}
          options={{ tabBarLabel: "URL 메타" }}
        />
        <Tab.Screen
          name="List"
          component={ListScreen}
          options={{ tabBarLabel: "목록·검색" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
