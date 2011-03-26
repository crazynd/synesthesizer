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

@property NSUInteger *_originX;
@property NSUInteger *_originY;
@property NSUInteger *_width;
@property NSUInteger *_height;

- (UIColor*) getAverageRGB;
- (id) initWithCGImageRef: (CGImageRef) theImage;
@end
