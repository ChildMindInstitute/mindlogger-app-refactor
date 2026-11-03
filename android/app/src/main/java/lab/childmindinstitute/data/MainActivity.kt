package lab.childmindinstitute.data

import android.content.pm.ActivityInfo
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle;

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
   * Set requested orientation only if Unity is mounted, else always set portrait.
   */
  override fun setRequestedOrientation(requestedOrientation: Int) {
    val isUnityMounted = runCatching {
      // Look up by name since react-native-unity is only linked when BUILD_WITH_UNITY=1
      Class.forName("com.azesmwayreactnativeunity.ReactNativeUnityViewManager")
          .getMethod("hasActiveView")
          .invoke(null) as Boolean
    }.getOrDefault(false)
    super.setRequestedOrientation(
        if (isUnityMounted) requestedOrientation else ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)
  }
}
