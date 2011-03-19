var colors = {
	reds: 0,
	greens: 0,
	blues: 0,
	count: 0,
	getAverageColor: function() {
		var red = parseInt(colors.reds/colors.count, 10);
		var green = parseInt(colors.greens/colors.count, 10);
		var blue = parseInt(colors.blues/colors.count, 10);
		this.reset();
		return {
			red: red,
			green: green,
			blue: blue
		};
	},
	reset: function() {
		this.reds = 0;
		this.greens = 0;
		this.blues = 0;
		this.count = 0;
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
	_segments: 0,

	/**
	 * Holds our canvas
	 */ 
	_canvas: null,

	/**
	 * Holds our canvas2dContext
	 */
	_canvas2dContext: 0,

	_width: 0,

	_sequence: [],
	_tempSequence: [],

	getOriginalImageWidth: function() {
		return this._originalImageWidth;
	},
	getOriginalImageHeight: function() {
		return this._originalImageHeight;
	},
	getImageWidth: function() {
		return this._width;
		// return this.getOriginalImageWidth()/4;
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
		this._width = Ext.getCmp('imageView').getWidth();
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
		if(this._canvas === null) {
			this._canvas = Ext.DomHelper.append('synesthesizer', {
				tag: 'canvas',
				id: 'canvas',
			});
			// We need to set the height, otherwise it defaults
			// to 150… what a crap!
			this._canvas.height = this.getImageHeight();
			this._canvas.width = this.getImageWidth();
			this._canvas2dContext = this._canvas.getContext('2d');
			this.drawImageOnCanvas();
		}
	},

	/**
	 * Setter
	 * @param {Number} segments
	 */
	setSegments: function(segments) {
		if(this._segments !== segments) {
			this._segments = segments;
			// Do recalculation here!
			this.drawImageOnCanvas();
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
		this._sequence = [];
		this.segmentColors.forEach(function(segment) {
			var gray = colors.toBW(segment.color);
			this._canvas2dContext.borderColor = 'rgba(0, 0, 0, .5)';
			this._canvas2dContext.borderStyle = 'solid';
			//this._canvas2dContext.fillStyle = 'rgba('+segment.color.red+', '+segment.color.green+', '+segment.color.blue+','+1+')';
			this._canvas2dContext.fillStyle = 'rgba('+gray+', '+gray+', '+gray+','+.8+')';
			this._canvas2dContext.fillRect(segment.x, segment.y, segment.width, segment.height);
			this._canvas2dContext.strokeRect(segment.x, segment.y, segment.width, segment.height);

			this.createNote(gray);
		}, this);

		// Reset segments:
		this.segmentColors = [];
		console.log(this._sequence);
	},

	drawImageOnCanvas: function() {
		this._canvas2dContext.drawImage(this.getRawImage(), 0, 0, this.getImageWidth(), this.getImageHeight());
	},

	createSegments: function() {
		// Segments
		for(var i = 0; i < this.getSegments(); i++) {
			var xOffset = i*this.getSegmentWidth();
			var imageData = this._canvas2dContext.getImageData(xOffset,this.getYOffset(),this.getSegmentWidth(),this.getSegmentHeight());

			// Vertical
			for(var j = 0; j < imageData.height; j++) {

				// Horizontal
				for(var n = 0; n < imageData.width; n++) {
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
	},

	createNote: function(amountOfGray) {
		if(amountOfGray < 51) {
			this._sequence.push('A');
		} else if(amountOfGray >= 51 && amountOfGray < 102) {
			this._sequence.push('C');
		} else if(amountOfGray >= 102 && amountOfGray < 153) {
			this._sequence.push('E');
		} else if(amountOfGray >= 153 && amountOfGray < 206) {
			this._sequence.push('F');
		} else {
			this._sequence.push('H');
		}
	},

    playSequence: function() {
        this._tempSequence = this._sequence;

        var path = 'Resources/Sounds/';
        var media = new Media(path+this._tempSequence[0]+'.mp3', function() {
            Synesthesizer.playNextNote()
        });
		//Ext.get('note'+this._tempSequence[0]).dom.play();
		//var note = Ext.get('note'+this._tempSequence[0]);
		//note.dom.play();
        media.play();
		
	},

	playNextNote: function() {
		this._tempSequence.shift();
		if(this._tempSequence.length !== 0) {
            //
            var path = 'Resources/Sounds/';
            var media = new Media(path+this._tempSequence[0]+'.mp3', function() {
                Synesthesizer.playNextNote()
            });
            media.play();
			//Ext.get('note'+this._tempSequence[0]).dom.play();
		}
	},

	initAudio: function() {
		// Create DOM-Elements
		notes = ['A', 'C', 'E', 'F', 'H'];
		notes.forEach(function(note) {
			console.log('NOTE: '+note);
			Ext.DomHelper.append('synesthesizer',
				{ tag: 'audio', preload: 'auto', src: 'Resources/Sounds/'+note+'.mp3', id: 'note'+note }
			);
		});
		// Add listeners
		Ext.select('audio').each(function(item, index, allItems){
			item.addListener('ended', this.playNextNote, this);
		}, this);
	}
};