//
//  DetailViewController.m
//  synesthesizer
//
//  Created by nd on 26.03.11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "CameraViewController.h"


@implementation CameraViewController

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
    [snapButton release];
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
    NSLog(@"Back?");
}

- (void)viewDidUnload
{
    [snapButton release];
    snapButton = nil;
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}



- (IBAction)snappedImage:(id)sender {
    
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera])
        { picker.sourceType = UIImagePickerControllerSourceTypeCamera;} 
    else
        { picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;}	
    
    [self presentModalViewController:picker animated:YES];
	[picker release];
    
    }

- (void)imagePickerController:(UIImagePickerController *) Picker

    didFinishPickingMediaWithInfo:(NSDictionary *)info {
    
    UIImage *pickedImage = [info objectForKey:UIImagePickerControllerOriginalImage];
    
    [[Picker parentViewController] dismissModalViewControllerAnimated:YES];
    
    ManipulationViewController *manipulationViewController = [[ManipulationViewController alloc] init];
    
    //UIImage *testImage = [[UIImage alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource: @"me" ofType: @"png"]];    
    
    [manipulationViewController setTheImage:pickedImage];
    
    [pickedImage release];
    
    [self.navigationController pushViewController:manipulationViewController animated:YES];
    
    [manipulationViewController release];

    
}

@end
