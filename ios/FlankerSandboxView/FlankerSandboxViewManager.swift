//
//  FlankerSandboxViewManager.swift
//  MindloggerMobile
//
//  Created by Dzmitry on 16.03.23.
//

@objc(FlankerSandboxViewManager)
class FlankerSandboxViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
     return true
   }
  
   override func view() -> UIView! {
     return FlankerSandboxView()
   }
}
