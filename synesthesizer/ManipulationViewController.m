//
//  ManipulationViewController.m
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "ManipulationViewController.h"

@implementation ManipulationViewController

NSMutableArray *segments = nil;

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
    [segmentSlider release];
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
    [imageView setImage: theImage];
    
    // Defaults for slider
    segmentSlider.continuous = NO;
    segmentSlider.minimumValue = 10.0;
    segmentSlider.maximumValue = 30.0;
}

- (void)viewDidUnload
{
    [imageView release];
    imageView = nil;
    [playButton release];
    playButton = nil;
    [self setImageView:nil];
    [segmentSlider release];
    segmentSlider = nil;
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

    //BAPBAPSegment *test = [[BAPBAPSegment alloc] initWithCGImageRef: w ];
    //UIColor *c = [test getAverageRGB];
    
  //  NSLog(@"%@", c);
}

- (IBAction)segmentsChanged:(id)sender {

    segments = [NSMutableArray array];
    NSUInteger segmentCountFromSlider = (int) segmentSlider.value;
    
    CGImageRef image = [self.imageView.image  CGImage];
    NSUInteger imageWidth = CGImageGetWidth(image);
    NSUInteger imageHeight = CGImageGetHeight(image);
    NSUInteger segmentWidth = imageWidth / segmentCountFromSlider;
    NSUInteger segmentHeight = imageHeight/3;
    NSUInteger yOffset = imageHeight/3;
    
    for(int i = 0; i < segmentCountFromSlider; i++) {
        NSUInteger xOffset = i * segmentWidth;
        
        BAPBAPSegment *segment = [[BAPBAPSegment alloc] initWithCGImageRef: image
                                                                         x: xOffset
                                                                         y: yOffset
                                                                     width: segmentWidth
                                                                    height: segmentHeight];
        [segments addObject:segment];
    }
    
    BAPBAPSegment *segment;
    for (segment in segments) {
        NSLog(@"Segment on x: %i, y: %i with width: %i, height: %i and average RGB color: %@", segment.originX, segment.originY, segment.width, segment.height, [segment getAverageRGB]);
    }

    
}
@end
