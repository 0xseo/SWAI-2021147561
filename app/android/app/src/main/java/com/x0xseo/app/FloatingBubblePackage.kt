package com.x0xseo.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class FloatingBubblePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // FloatingBubbleModule을 모듈 목록에 추가
        return listOf(FloatingBubbleModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // 네이티브 뷰 매니저는 사용하지 않으므로 빈 리스트 반환
        return emptyList()
    }
}
