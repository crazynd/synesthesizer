//
//  ManipulationViewController.h
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BAPBAPSegment.h"

@interface ManipulationViewController : UIViewController {
    IBOutlet UIImageView *imageView;
    IBOutlet UIButton *playButton;
    UIImage *theImage;
//    UIImageView *imageView;
}
- (IBAction)pressedPlay:(id)sender;

@property (nonatomic, retain) IBOutlet UIImageView *imageView;
@property (nonatomic, retain) UIImage *theImage;

@end
