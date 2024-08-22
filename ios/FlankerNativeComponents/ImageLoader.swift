//
//  ImageLoader.swift
//  MDCApp
//
//  Created by Volodymyr Nazarkevych on 29.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import UIKit
import Foundation
import Promises

let imageCache = NSCache<AnyObject, AnyObject>()

class ImageLoader: UIView {

    var imageURL: URL?

    let activityIndicator = UIActivityIndicatorView()

    var closureDate: ((CFTimeInterval) -> Void)? = nil

    var image: UIImage?  {
        didSet {
            self.setNeedsDisplay()
        }
    }
  
  private func calculateScale(image: UIImage) -> CGFloat {
    let scale: CGFloat
    
    let widthRatio = bounds.width / image.size.width
    let heightRatio = bounds.height / image.size.height
    
    if heightRatio > widthRatio {
      scale = widthRatio
    } else {
      scale = heightRatio
    }
  
    return scale
  }
  
  override func draw(_ rect: CGRect) {
    print("Marker Draw Start: \(CACurrentMediaTime())")
    guard let ctx = UIGraphicsGetCurrentContext() else { return }

    ctx.addRect(bounds)
    ctx.setFillColor(UIColor.white.cgColor)
    ctx.fillPath()

    if let im = image {
      let scale: CGFloat = self.calculateScale(image: im)

      let size = CGSize(width: im.size.width * scale, height: im.size.height * scale)

      UIGraphicsBeginImageContextWithOptions(size, true, UIScreen.main.scale)
      guard let imgCtx = UIGraphicsGetCurrentContext() else { return }

      imgCtx.setFillColor(UIColor.white.cgColor)
      UIColor.white.setFill()
      imgCtx.fill(rect)
      im.draw(in: CGRect(x: 0, y: 0, width: size.width, height: size.height))

      guard let cgImg = imgCtx.makeImage() else { return }
      ctx.scaleBy(x: 1, y: -1)
      ctx.translateBy(x: 0, y: -bounds.height)
      ctx.setFillColor(UIColor.white.cgColor)
      ctx.fillPath()
      ctx.draw(cgImg, in: CGRect(x: (bounds.width - size.width) / 2, y: (bounds.height - size.height) / 2, width: size.width, height: size.height))
      UIGraphicsEndImageContext()
      
      self.contentMode = .scaleAspectFit

      if #available(iOS 10.0, *) {
        super.draw(rect)
        print("MarkerDate: endDraw: \(CACurrentMediaTime())")
      }
      DispatchQueue.main.async {
        print("Marker Draw End: \(CACurrentMediaTime())")
      }
    }

    let date = CACurrentMediaTime()

    closureDate?(date)

  }
  
  func setupActivityIndicator(url: URL) {
    activityIndicator.color = .darkGray

    addSubview(activityIndicator)
    activityIndicator.translatesAutoresizingMaskIntoConstraints = false
    activityIndicator.centerXAnchor.constraint(equalTo: centerXAnchor).isActive = true
    activityIndicator.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true

    imageURL = url

    image = nil
    activityIndicator.startAnimating()
  }
  
  func downloadImage(url: URL) -> Promise<UIImage> {
    let promise = Promise<UIImage> { [self] fulfill, reject in
      if let imageFromCache = imageCache.object(forKey: url as AnyObject) as? UIImage {
        self.image = imageFromCache
        activityIndicator.stopAnimating()
        fulfill(imageFromCache)
        return
      }
      
      if let cachedImage = ImageCacheManager.loadCachedImage(from: url.absoluteString) {
        self.image = cachedImage
        imageCache.setObject(cachedImage, forKey: url as AnyObject)
        activityIndicator.stopAnimating()

        fulfill(cachedImage)
        return
      }

      URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) in
        if error != nil {
          reject(error!)
          print(error as Any)
          DispatchQueue.main.async(execute: {
            self.activityIndicator.stopAnimating()
          })
          return
        }

        DispatchQueue.main.async(execute: {
          if let unwrappedData = data, let imageToCache = UIImage(data: unwrappedData) {
            fulfill(imageToCache)
            if self.imageURL == url {
              self.image = imageToCache
            }

            imageCache.setObject(imageToCache, forKey: url as AnyObject)
            
            fulfill(imageToCache)
          }
          self.activityIndicator.stopAnimating()
        })
      }).resume()
    }
    
    return promise
  }
}
