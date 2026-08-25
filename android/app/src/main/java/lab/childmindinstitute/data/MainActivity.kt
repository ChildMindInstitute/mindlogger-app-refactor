package lab.childmindinstitute.data

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle;
import android.util.Log;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "MindloggerMobile"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * React Native Screen's configuration step.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(null)
  }

  /**
   * Ignore orientation requests the Unity engine makes while no Unity screen
   * is mounted. The parked engine re-asserts landscape while hidden behind the
   * Activities list, breaking touch handling.
   */
  override fun setRequestedOrientation(requestedOrientation: Int) {
      val fromUnity = Throwable().stackTrace.any {
          it.className.startsWith("com.unity3d.player")
      }
      if (fromUnity && !unityScreenMounted()) {
          Log.w("OrientationDebug", "ignored hidden-Unity request: $requestedOrientation")
          return
      }
      super.setRequestedOrientation(requestedOrientation)
  }

  // Log every touch so we can tell whether a dead tap is cancelled natively
  // or delivered cleanly and dropped by RN.
  override fun dispatchTouchEvent(ev: android.view.MotionEvent): Boolean {
      when (ev.actionMasked) {
          android.view.MotionEvent.ACTION_DOWN,
          android.view.MotionEvent.ACTION_UP,
          android.view.MotionEvent.ACTION_CANCEL ->
              Log.i("TouchDebug", "${android.view.MotionEvent.actionToString(ev.actionMasked)} x=${ev.x} y=${ev.y}")
      }
      return super.dispatchTouchEvent(ev)
  }

  // Reflection because the Unity library is unlinked in non-Unity builds.
  private fun unityScreenMounted(): Boolean = try {
      Class.forName("com.azesmwayreactnativeunity.ReactNativeUnityViewManager")
          .getMethod("hasActiveView")
          .invoke(null) as Boolean
  } catch (e: Exception) {
      false
  }
}
