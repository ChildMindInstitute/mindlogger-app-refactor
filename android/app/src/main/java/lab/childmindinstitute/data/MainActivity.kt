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

  // Reflection because the Unity library is unlinked in non-Unity builds.
  private fun unityScreenMounted(): Boolean = try {
      Class.forName("com.azesmwayreactnativeunity.ReactNativeUnityViewManager")
          .getMethod("hasActiveView")
          .invoke(null) as Boolean
  } catch (e: Exception) {
      false
  }
}
