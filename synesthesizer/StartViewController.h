//
//  StartViewController.h
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CameraViewController.h"

@interface StartViewController : UIViewController {

    IBOutlet UIButton *jumpButton;
}

- (IBAction)jumpButtonPressed:(id)sender;

@end
