// // src/screens/ListScreen.js
// import React from "react";
// import { StyleSheet, View, Platform, StatusBar } from "react-native";
// import { WebView } from "react-native-webview";

// export default function ListScreen() {
//   // 여기에 실제 Videobrain 사이트의 '목록·검색' 페이지 URL을 넣으세요.
//   const videobrainListUrl = "https://videobrain.netlify.app/service";

//   return (
//     <View style={styles.container}>
//       <WebView
//         source={{ uri: videobrainListUrl }}
//         startInLoadingState={true}
//         style={styles.webview}
//         onError={(syntheticEvent) => {
//           const { nativeEvent } = syntheticEvent;
//           console.warn("WebView error (List): ", nativeEvent);
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   webview: {
//     flex: 1,
//   },
// });
import React, { useEffect } from "react";
import {
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Button,
  View,
  NativeEventEmitter,
} from "react-native";
const { FloatingBubbleModule } = NativeModules;
const bubbleEmitter = new NativeEventEmitter(FloatingBubbleModule);
export default function ListScreen() {
  // useEffect(() => {
  //   const subscription = bubbleEmitter.addListener("bubbleClick", () => {
  //     // 플로팅 버튼 클릭 이벤트 처리
  //     Alert.alert("플로팅 버튼 클릭", "플로팅 버튼이 클릭되었습니다!");
  //   });
  //   return () => {
  //     // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //     subscription.remove();
  //   };
  // }, []);
  useEffect(() => {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      checkOverlayPermission();
      handleStartBubble();
    }
    const subscription = bubbleEmitter.addListener("bubbleClick", () => {
      // 플로팅 버튼 클릭 이벤트 처리
      Alert.alert("플로팅 버튼 클릭", "플로팅 버튼이 클릭되었습니다!");
    });
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      subscription.remove();
    };
  }, []);
  const checkOverlayPermission = async () => {
    // 네이티브 Settings.canDrawOverlays를 호출할 수 있는 브릿지 메서드를 미리 만들어 두셨다면
    // NativeModules.OverlayPermissionModule.canDrawOverlays()처럼 호출해도 되고,
    // 아니면 Intent로 직접 설정 창을 여는 방법도 있습니다.
    // 여기서는 Intent로 바로 연결하는 방식을 예시로 보여 드립니다.
    try {
      const canDraw = await FloatingBubbleModule.checkOverlayPermission();
      // checkOverlayPermission()은 아래 네이티브 모듈에 구현되어야 합니다.
      if (!canDraw) {
        Alert.alert(
          "권한 요청",
          "플로팅 버튼을 사용하려면 “다른 앱 위에 그리기” 권한이 필요합니다.\n설정 화면으로 이동하시겠습니까?",
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정으로 이동",
              onPress: () => {
                // 안드로이드 설정에서 오버레이 권한 설정 화면으로 이동
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
    // 권한을 이미 허용했는지 다시 확인
    const canDraw = await FloatingBubbleModule.checkOverlayPermission();
    if (canDraw) {
      FloatingBubbleModule.startService();
    } else {
      Alert.alert(
        "권한 필요",
        "먼저 “다른 앱 위에 그리기” 권한을 허용하셔야 플로팅 버튼을 사용할 수 있습니다."
      );
    }
  };
  const handleStop = () => {
    FloatingBubbleModule.stopService();
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="시작" onPress={handleStartBubble} />
      <Button title="중지" onPress={handleStop} />
    </View>
  );
}
