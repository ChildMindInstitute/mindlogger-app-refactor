//
//  ParameterGameManager.swift
//  MDCApp
//
//  Created by Volodymyr Nazarkevych on 28.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit
import Promises
 
class ParameterGameManager {
  static let shared = ParameterGameManager()
  private var allParameters: ParameterModel?
  var fixationImage: UIImageView?
  
  func setJsonWithParameters(json: String) {
    guard
      let jsonData = json.data(using: .utf8),
      let parameters: ParameterModel = try? JSONDecoder().decode(ParameterModel.self, from: jsonData)
    else { return }
    allParameters = parameters
  }
  
  func getParameters() -> ParameterModel? {
    return allParameters
  }
  
  func loadAllImage(dataJson: String, onFinish: @escaping RCTResponseSenderBlock) {
    guard
      let jsonData = dataJson.data(using: .utf8),
      let parameters: ParameterModel = try? JSONDecoder().decode(ParameterModel.self, from: jsonData)
    else { return }
    
    var urls: [URL] = []
    
    if let fixationUrl = URL(string: parameters.fixation) {
      urls.append(fixationUrl)
    }
    
    parameters.trials.forEach { trial in
      if let url = URL(string: trial.stimulus.en) {
        urls.append(url)
      }
      trial.choices.forEach { choice in
        if let url = URL(string: choice.name.en) {
          urls.append(url)
        }
      }
    }
    
    let promises: [Promise<Any?>] = urls.map{url in
      return ImageLoader().loadImageWithUrlWrapper(url)
    }
    
    all(promises).then(on: .main) {_ in
      onFinish(nil)
    }
  }
}
