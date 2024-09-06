//
//  ImageDimensions.m
//  MindloggerMobile
//
//  Created by Mironov, Artem on 8/27/24.
//

#import "ImageDimensions.h"
#import <UIKit/UIKit.h>

@implementation ImageDimensions

// Register the module with React Native
RCT_EXPORT_MODULE();

// Define the blocking synchronous method
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getImageDimensionsSync:(NSString *)uri) {
  UIImage *image = [UIImage imageWithContentsOfFile:uri];
  if (image) {
    NSNumber *width = @(image.size.width);
    NSNumber *height = @(image.size.height);

    return @{@"width": width, @"height": height};
  } else {
    NSLog(@"Failed to load image at path: %@", uri);
    return nil;
  }
}

@end
