//
//  ManipulationViewController.m
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ManipulationViewController.h"

@implementation ManipulationViewController

@synthesize imageView;
@synthesize theImage;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)dealloc
{
    [imageView release];
    [playButton release];
    [super dealloc];
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    NSLog(@"%@", theImage);
    NSLog(@"%@", imageView);
    [imageView setImage: theImage];
}

- (void)viewDidUnload
{
    [imageView release];
    imageView = nil;
    [playButton release];
    playButton = nil;
    [self setImageView:nil];
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

- (IBAction)pressedPlay:(id)sender {
    
    CGImageRef w =  [self.imageView.image  CGImage];
    BAPBAPSegment *test = [[BAPBAPSegment alloc] initWithCGImageRef: w ];
    UIColor *c = [test getAverageRGB];
    
    NSLog(@"%@", c);
    
}

@end
