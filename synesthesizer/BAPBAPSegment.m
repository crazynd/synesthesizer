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


@synthesize originY;
@synthesize originX;
@synthesize width;
@synthesize height;

- (UIColor*) getAverageRGB {
    
    CGImageRef imageRef = (CGImageRef) image;
    
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
	
    CGContextDrawImage(context, CGRectMake(originX, originY, width, height), imageRef);
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
		
        tempRed += rawData[byteIndex];
        tempGreen += rawData[byteIndex+1];
        tempBlue += rawData[byteIndex+2];
		
        byteIndex += 4;
    }
	
	free(rawData);
    
    UIColor *c = [UIColor colorWithRed: ((tempRed/(width * height))/255) green:((tempGreen/(width * height))/255) blue:((tempBlue/(width * height))/255) alpha:1.0];
    
    return c;
}

- (id) initWithCGImageRef: (CGImageRef) theImage x: (NSUInteger) x y: (NSUInteger) y width: (NSUInteger) w height: (NSUInteger) h {
    self = [super init];
    image = theImage;
    originX = x;
    originY = y;
    width = w;
    height = h;
    
    return self;
}

@end
