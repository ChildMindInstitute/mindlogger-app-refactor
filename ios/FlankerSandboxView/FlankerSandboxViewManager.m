//
//  FlankerSandboxViewManager.m
//  MindloggerMobile
//
//  Created by Dzmitry on 16.03.23.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(FlankerSandboxViewManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(onClick, RCTBubblingEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(imageUrl, NSString)
  RCT_EXPORT_VIEW_PROPERTY(message, NSString)
@end
