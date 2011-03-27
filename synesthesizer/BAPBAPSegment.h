//
//  BAPBAPSegment.h
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface BAPBAPSegment : NSObject {
    CGImageRef image;
    
}

@property NSUInteger originX;
@property NSUInteger originY;
@property NSUInteger width;
@property NSUInteger height;

- (UIColor*) getAverageRGB;
- (id) initWithCGImageRef: (CGImageRef) theImage x: (NSUInteger) x y: (NSUInteger) y width: (NSUInteger) w height: (NSUInteger) h;
@end
