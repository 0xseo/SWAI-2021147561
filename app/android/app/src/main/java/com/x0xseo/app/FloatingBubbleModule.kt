package com.x0xseo.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.provider.Settings
import android.net.Uri
import android.os.Build
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class FloatingBubbleModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    // 버블 클릭을 감지하기 위한 브로드캐스트 리시버
    private val bubbleClickReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            intent?.action?.let { action ->
                if (action == FloatingBubbleService.ACTION_BUBBLE_CLICK) {
                    // 디버그용 로그 (Logcat에서 확인)
                    android.util.Log.d("FloatingBubbleModule", "Broadcast 수신됨: $action")
                    // JS 쪽으로 이벤트 방출
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("bubbleClick", null)
                }
            }
        }
    }
    

    override fun getName(): String {
        return "FloatingBubbleModule"
    }

    override fun initialize() {
        super.initialize()
        val filter = IntentFilter(FloatingBubbleService.ACTION_BUBBLE_CLICK)
        // Android 12 이상부터 동적 리시버 등록 시 반드시 플래그를 명시해야 함
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            reactContext.registerReceiver(
                bubbleClickReceiver,
                filter,
                /* broadcastPermission = */ null,
                /* scheduler = */ null,
                /* flags = */ Context.RECEIVER_NOT_EXPORTED
            )
        } else {
            reactContext.registerReceiver(bubbleClickReceiver, filter)
        }
        android.util.Log.d("FloatingBubbleModule", "리시버 등록 완료")

        
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        // 모듈이 해제될 때 리시버도 반드시 해제
        try {
            reactContext.unregisterReceiver(bubbleClickReceiver)
            android.util.Log.d("FloatingBubbleModule", "리시버 해제 완료")
        } catch (e: Exception) {
            // 이미 해제되었거나 예외가 발생해도 무시
        }
    }

    // JS에서 new NativeEventEmitter() 호출 시 내부적으로 필요로 하는 빈 메서드들
    @ReactMethod
    fun addListener(eventName: String) {
        // 아무 동작도 하지 않아도 됩니다.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // 아무 동작도 하지 않아도 됩니다.
    }

    // 오버레이 권한이 있는지 체크 (Settings.canDrawOverlays)
    @ReactMethod
    fun checkOverlayPermission(promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            promise.resolve(Settings.canDrawOverlays(reactContext))
        } else {
            promise.resolve(true)
        }
    }

    // 설정 화면을 열어 “다른 앱 위에 그리기” 권한을 요청
    @ReactMethod
    fun openOverlayPermissionSettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${reactContext.packageName}")
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
        }
    }

    // 플로팅 서비스 시작
    @ReactMethod
    fun startService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(reactContext)) {
                return
            }
        }
        val serviceIntent = Intent(reactContext, FloatingBubbleService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent)
        } else {
            reactContext.startService(serviceIntent)
        }
    }

    // 플로팅 서비스 중지
    @ReactMethod
    fun stopService() {
        val serviceIntent = Intent(reactContext, FloatingBubbleService::class.java)
        reactContext.stopService(serviceIntent)
    }
}
