import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppInner from "./AppInner";

export default function App() {
  return (
    <NavigationContainer>
      <AppInner />
    </NavigationContainer>
  );
}
