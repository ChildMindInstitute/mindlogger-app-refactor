//
//  ImageCacheManager.swift
//  MindloggerMobile
//
//  Created by Mironov, Artem on 8/8/24.
//

import Foundation
import CommonCrypto
import UIKit

public class ImageCacheManager {
  public static let cacheDirectory = (NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true).first! as NSString).appendingPathComponent("images_cache")
    
  private static func sha1Hash(url: String) -> String {
    let data = Data(url.utf8)
    var digest = [UInt8](repeating: 0, count: Int(CC_SHA1_DIGEST_LENGTH))
    
    data.withUnsafeBytes {
      _ = CC_SHA1($0.baseAddress, CC_LONG(data.count), &digest)
    }
    
    return digest.map { String(format: "%02x", $0) }.joined()
  }
  
  public static func loadCachedImage(from url: String) -> UIImage? {
    guard let urlExtension = URL(string: url)?.pathExtension, !urlExtension.isEmpty else {
      print("Failed to extract extension from URL: \(url)")
      return nil
    }
     
    let hashedFileName = sha1Hash(url: url) + ".\(urlExtension)"
    let filePath = (cacheDirectory as NSString).appendingPathComponent(hashedFileName)
    
    let fileManager = FileManager.default
    
    if !fileManager.fileExists(atPath: filePath) {
      print("File does not exist at path: \(filePath)")
      return nil
    }
    
    return UIImage(contentsOfFile: filePath)
  }
}
