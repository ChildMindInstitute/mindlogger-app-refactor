#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <Firebase.h>
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import "RNFBMessagingModule.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MindloggerMobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  [FIRApp configure];
  [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (UIView *)createRootViewWithBridge:(RCTBridge *)bridge
                          moduleName:(NSString *)moduleName
                           initProps:(NSDictionary *)initProps
{
  UIView * rootView = [super createRootViewWithBridge:bridge moduleName:moduleName initProps:initProps];

  rootView.backgroundColor = [UIColor colorWithRed: 0.00 green: 0.40 blue: 0.63 alpha: 1.00];

  return rootView;
}

@end
