//
//  DetailViewController.h
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface DetailViewController : UIViewController {
    
    IBOutlet UILabel *theLabel;
    
}

@property (nonatomic, retain) UILabel *theLabel;

@end
