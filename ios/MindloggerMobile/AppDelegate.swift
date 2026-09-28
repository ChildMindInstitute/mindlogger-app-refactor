import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import TSBackgroundFetch
import Firebase
import react_native_orientation_director

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "MindloggerMobile",
      in: window,
      launchOptions: launchOptions
    )

    FirebaseApp.configure()
    TSBackgroundFetch.sharedInstance().didFinishLaunching();

    return true
  }

  func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    // Unity's window keeps a static mask so it can't crash on relaunch into a
    // landscape activity (M2-10056)
    if isUnityWindow(window) {
      return [.portrait, .landscapeLeft, .landscapeRight]
    }
    // Other windows (app, alerts, system prompts) follow orientation-director.
    // Before JS locks, the director holds Info.plist's full set, so treat any
    // mask containing portrait as portrait-only.
    let mask = OrientationDirector.getSupportedInterfaceOrientationsForWindow()
    return mask.contains(.portrait) ? .portrait : mask
  }

  private func isUnityWindow(_ window: UIWindow?) -> Bool {
    guard let root = window?.rootViewController else { return false }
    return NSStringFromClass(type(of: root)).hasPrefix("Unity")
  }

  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }

  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    return RCTLinkingManager.application(
      application,
      continue: userActivity,
      restorationHandler: restorationHandler
    )
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }

  override func createRootViewController() -> UIViewController {
    return OrientationAwareRootViewController()
  }
}

class OrientationAwareRootViewController: UIViewController {
  override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    // Constrain view controller to orientations configured by react-native-orientation-director
    // Intersects with the app's static orientation mask above (M2-10056)
    return OrientationDirector.getSupportedInterfaceOrientationsForWindow()
  }
}
