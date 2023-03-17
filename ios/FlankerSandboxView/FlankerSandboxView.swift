//
//  FlankerSandboxView.swift
//  MindloggerMobile
//
//  Created by Dzmitry on 16.03.23.
//

import Foundation
import UIKit

@objc(FlankerSandboxView)
class FlankerSandboxView: UIView {
  @objc var message: String? = "Hello Native Custom View" {
      didSet {
          self.setupView()
      }
  }
  
  @objc var imageUrl: NSString = "" {
      didSet {
        let url = URL(string: imageUrl as String)
        
        let dataImage = try? Data(contentsOf: url!)
        
        if let data = dataImage {
          imageView.image = UIImage(data: data)
        }
    }
  }

  @objc var onClick: RCTBubblingEventBlock?
  
  var imageView: UIImageView!
  
  override init(frame: CGRect) {
      super.init(frame: frame)
  }

  required init?(coder aDecoder: NSCoder) {
      super.init(coder: aDecoder)
      setupView()
  }
  
  private func setupView() {
    superview?.isUserInteractionEnabled = true
    
    let label = UILabel()
    label.center = self.center
    label.textColor = .white
    label.text = self.message
    label.sizeToFit()
    self.addSubview(label)
    label.translatesAutoresizingMaskIntoConstraints = false
    
    let button = UIButton(type: .system)
    button.backgroundColor = .white
    button.setTitle("Click me", for: .normal)
    button.addTarget(self, action: #selector(onPress), for: .touchUpInside)
    button.sizeToFit()
    self.addSubview(button)
    button.translatesAutoresizingMaskIntoConstraints = false
    
    imageView = UIImageView()
    self.addSubview(imageView)
    imageView.translatesAutoresizingMaskIntoConstraints = false
    
    NSLayoutConstraint.activate([
      heightAnchor.constraint(equalToConstant: 1000),
      
      label.widthAnchor.constraint(equalToConstant: 260),
      label.heightAnchor.constraint(equalToConstant: 30),
      label.centerXAnchor.constraint(equalTo: self.centerXAnchor),
      label.centerYAnchor.constraint(equalTo: self.centerYAnchor),
      
      button.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 10),
      button.centerXAnchor.constraint(equalTo: label.centerXAnchor),
      button.widthAnchor.constraint(equalToConstant: 200.0),
      button.heightAnchor.constraint(equalToConstant: 30),
      
      imageView.heightAnchor.constraint(equalToConstant: 200),
      imageView.widthAnchor.constraint(equalToConstant: 150),
      imageView.centerXAnchor.constraint(equalTo: label.centerXAnchor),
      imageView.topAnchor.constraint(equalTo: button.bottomAnchor, constant: 10),
    ])
  }
  
  @objc public func onPress() {
    guard let onClick = self.onClick else { return }

    let params: [String : Any] = ["message":"button click"]
    onClick(params)
  }
}
