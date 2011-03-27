//
//  DetailViewController.h
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "ManipulationViewController.h"


//@interface CameraViewController : UIViewController {
@interface CameraViewController :  UIViewController<UIImagePickerControllerDelegate, UINavigationControllerDelegate> {

    IBOutlet UIButton *snapButton;
    
}

- (IBAction)snappedImage:(id)sender;


@end