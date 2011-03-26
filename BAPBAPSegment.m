//
//  BAPBAPSegment.m
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "BAPBAPSegment.h"

CGImageRef image = nil;

@implementation BAPBAPSegment


@synthesize _originY;
@synthesize _originX;
@synthesize _width;
@synthesize _height;

- (UIColor*) getAverageRGB {
    
    CGImageRef imageRef = (CGImageRef) image;
    //  NSUInteger width = CGImageGetWidth(imageRef);
    //    NSUInteger height = CGImageGetHeight(imageRef);
    NSUInteger width = 1;
    NSUInteger height = 1;
    
    CGFloat tempRed = 0.0;
   CGFloat tempGreen = 0.0;
   CGFloat tempBlue = 0.0;
    
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    unsigned char *rawData = malloc(height * width * 4);
    NSUInteger bytesPerPixel = 4;
    NSUInteger bytesPerRow = bytesPerPixel * width;
    NSUInteger bitsPerComponent = 8;
    CGContextRef context = CGBitmapContextCreate(rawData, width, height,
												 bitsPerComponent, bytesPerRow, colorSpace,
												 kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);
    CGColorSpaceRelease(colorSpace);
	
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), imageRef);
    CGContextRelease(context);
	
    // Now your rawData contains the image data in the RGBA8888 pixel format.
    int byteIndex = (bytesPerRow * 0) + 0 * bytesPerPixel;
    for (int ii = 0 ; ii < width * height ; ++ii)
    {
        // Get color values to construct a UIColor
        //		  CGFloat red   = (rawData[byteIndex]     * 1.0) / 255.0;
        //        CGFloat green = (rawData[byteIndex + 1] * 1.0) / 255.0;
        //        CGFloat blue  = (rawData[byteIndex + 2] * 1.0) / 255.0;
        //        CGFloat alpha = (rawData[byteIndex + 3] * 1.0) / 255.0;
		
		//int outputColor = (rawData[byteIndex] + rawData[byteIndex+1] + rawData[byteIndex+2]) / 3;
        NSLog(@"Red: %i, Green: %i, Blue: %i", rawData[byteIndex], rawData[byteIndex+1], rawData[byteIndex+2]);
        tempRed += rawData[byteIndex];
        tempGreen += rawData[byteIndex+1];
        tempBlue += rawData[byteIndex+2];
		
		//rawData[byteIndex] = (char) (outputColor);
		//rawData[byteIndex+1] = (char) (outputColor);
		//rawData[byteIndex+2] = (char) (outputColor);
		
        byteIndex += 4;
    }
	
	free(rawData);
	
    NSLog(@"%f", ((tempRed/(width * height))/255));
    
    UIColor *c = [UIColor colorWithRed: ((tempRed/(width * height))/255) green:((tempGreen/(width * height))/255) blue:((tempBlue/(width * height))/255) alpha:1.0];
    
    return c;
}

- (id) initWithCGImageRef: (CGImageRef) theImage {
    self = [super init];
    image = theImage;
    
    return self;
}

@end
