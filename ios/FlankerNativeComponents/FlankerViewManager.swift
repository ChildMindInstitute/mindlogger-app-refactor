import Foundation
import React

@objc(FlankerViewManager)
class FlankerViewManager: RCTViewManager {
  private let resultManeger = ResultManager.shared
  private var flankerView: FlankerView? = nil
    
  override func view() -> UIView! {
    flankerView = FlankerView()
    return flankerView
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func setGameParameters(_ json: String) {
    ParameterGameManager.shared.setJsonWithParameters(json: json)
  }

  @objc
  func preloadGameImages(_ dataJson: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let promise = ParameterGameManager.shared.loadAllImage(dataJson: dataJson)
    
    if promise != nil {
      promise?.then({_ in 
        resolve(nil)
      }).catch({err in
        reject("", err.localizedDescription, err)
      })
    }
  }

  @objc
  func startGame(_ isFirst: Bool, isLast: Bool) {
    if isFirst {
      flankerView!.typeResult = .ok
      flankerView!.isLast = false // todo - review if we need to use this
    } else if isLast {
      flankerView!.typeResult = .finish
    } else {
      flankerView!.typeResult = .next
    }
    flankerView!.parameterGame()
  }
}
