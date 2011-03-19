var colors = {
	reds: 0,
	greens: 0,
	blues: 0,
	count: 0,
	getAverageColor: function() {
		var red = parseInt(colors.reds/colors.count, 10);
		var green = parseInt(colors.greens/colors.count, 10);
		var blue = parseInt(colors.blues/colors.count, 10);
		colors.reset();
		return {
			red: red,
			green: green,
			blue: blue
		};
	},
	reset: function() {
		colors.reds = 0;
		colors.greens = 0;
		colors.blues = 0;
		colors.count = 0;
	},
	toBW: function(color) {
		return parseInt( (color.red + color.green + color.blue) / 3, 10);
	}
};

var Synesthesizer = {
	/**
	 * Holds the reference to our image
	 */
	_image: null,

	_originalImageWidth: 0,
	_originalImageHeight: 0,
	_imageWidth: 0,
	_imageHeight: 0,

	/**
	 * This directly corresponds to the slider
	 * in the iPhone UI:
	 */
	_segments: 15,

	/**
	 * Holds our canvas
	 */ 
	_canvas: null,

	/**
	 * Holds our canvas2dContext
	 */
	_canvas2dContext: 0,

	width: 0,

	getOriginalImageWidth: function() {
		return this._originalImageWidth;
	},
	getOriginalImageHeight: function() {
		return this._originalImageHeight;
	},
	getImageWidth: function() {
		return this.getOriginalImageWidth()/4;
	},
	getImageHeight: function() {
		return this.getImageWidth() * (this.getOriginalImageHeight()/this.getOriginalImageWidth());
	},
	getSegmentWidth: function() {
		return Math.floor(this.getImageWidth()/this.getSegments());
	},
	getSegmentHeight: function() {
		// TODO: Change height to flexible!
		return Math.floor(this.getImageHeight()/3);
	},
	getYOffset: function() {
		return parseInt(this.getSegmentHeight(), 10);
	},
	segmentColors: [],

	setImage: function(image) {
		this._image = image;
		this._originalImageWidth = image.getWidth();
		this._originalImageHeight = image.getHeight();
		this._imageWidth = this.getImageWidth();
		this._imageHeight = this.getImageHeight();
		this._createCanvas();
		this._canvas2dContext.save();
		//this.getRawImage().setAttribute('style', 'visibility: none;');
		this._image.hide();
	},
	getImage: function() {
		return this._image;
	},
	getRawImage: function() {
		return this.getImage().dom;
	},

	_createCanvas: function() {
		this._canvas = Ext.DomHelper.append('synesthesizer', {
			tag: 'canvas',
			id: 'canvas',
		});
		// We need to set the height, otherwise it defaults
		// to 150… what a crap!
		this._canvas.height = 192;
		this._canvas2dContext = this._canvas.getContext('2d');
		console.log(this.getImageHeight());
		this.drawImageOnCanvas();
		console.log(this._canvas.height);
	},

	/**
	 * Setter
	 * @param {Number} segments
	 */
	setSegments: function(segments) {
		if(this._segments !== segments) {
			console.log('Set segments');
			this._segments = segments;
			// Do recalculation here!
			this.createSegments();
			this.drawBoxes();
		}
	},
	/**
	 * Getter
	 */
	getSegments: function() {
		return this._segments;
	},

	/**
	 * Sets canvas
	 */
	setCanvas: function(canvas) {
		this._canvas = canvas;
	},
	/**
	 * Get canvas
	 */
	getCanvas: function() {
		return this._canvas;
	},

	// Draw boxes
	drawBoxes: function() {
		this.drawImageOnCanvas();
		this._canvas2dContext.save();
		this.segmentColors.forEach(function(segment) {
			var gray = colors.toBW(segment.color);
			this._canvas2dContext.borderColor = 'rgba(0, 0, 0, .5)';
			this._canvas2dContext.borderStyle = 'solid';
			//this._canvas2dContext.fillStyle = 'rgba('+segment.color.red+', '+segment.color.green+', '+segment.color.blue+','+1+')';
			this._canvas2dContext.fillStyle = 'rgba('+gray+', '+gray+', '+gray+','+.8+')';
			this._canvas2dContext.fillRect(segment.x, segment.y, segment.width, segment.height);
			this._canvas2dContext.strokeRect(segment.x, segment.y, segment.width, segment.height);
		}, this);

		// Reset segments:
		this.segmentColors = [];
	},

	drawImageOnCanvas: function() {
		this._canvas2dContext.drawImage(this.getRawImage(), 0, 0, this.getImageWidth(), this.getImageHeight());
	},

	createSegments: function() {
		// Segments
		for(var i = 0; i < this.getSegments(); i++) {
			var xOffset = i*this.getSegmentWidth();
			var imageData = this._canvas2dContext.getImageData(xOffset,this.getYOffset(),this.getSegmentWidth(),this.getSegmentHeight());
			var segmentPixels = [];

			// Vertical
			for(var j = 0; j < imageData.height; j++) {

				// Horizontal
				for(var n = 0; n < imageData.width; n++) {
					//var index = ( (n*4)*imageData.width ) +(j*4);
					var index = ((n*4) * j);
					colors.reds += imageData.data[index];
					colors.greens += imageData.data[index+1];
					colors.blues += imageData.data[index+2];
					colors.count += 1;
				}
			}
			this.segmentColors.push({
				color: colors.getAverageColor(),
				x: xOffset,
				y: this.getYOffset(),
				width: this.getSegmentWidth(),
				height: this.getSegmentHeight()
			});
		}
	}
};


/*
//var image = Ext.get('image');
var originalImageWidth = image.getWidth();
var originalImageHeight = image.getHeight();
//var imageWidth = Ext.getCmp('imageView').getWidth();
var imageWidth = originalImageWidth/4;
//console.log('Panel height: '+Ext.getCmp('imageView').getHeight());
//console.log('We should get: ' + imageWidth + 'x' + imageHeight);
var canvas = Ext.get('canvas');
var canvas2dContext = canvas.dom.getContext('2d');
console.log('Canvas height: '+canvas.getHeight());
console.log('Canvas height: '+canvas.dom.height);
//canvas.setWidth(imageWidth);
//canvas.setHeight(imageHeight);
image.hide();
var yOffset = segmentHeight;

var segmentColors = [];
*/

