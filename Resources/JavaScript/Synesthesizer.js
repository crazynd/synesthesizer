Ext.setup({
	onReady: function() {

		var panel = new Ext.Panel({
			fullscreen: true,
			dockedItems: [{
				dock : 'top',
				xtype: 'toolbar',
				title: 'Synesthesizer'
			},{
				dock : 'bottom',
				xtype: 'toolbar',
				ui   : 'dark',
				items: {
					text: 'Play'
				},
			}],
			layout: 'vbox',
			items: [{
				xtype: 'panel',
				id: 'imageView',
				title: 'test',
				flex: 1, 
				contentEl: 'canvas',
				centered: true
			},{
				xtype: 'sliderfield',
				label: 'Segments',
				value: 15,
				minValue: 10,
				maxValue: 30,
				listeners: {
					scope: this,
					change: function(slider, thumb, newValue, oldValue) {
						console.log('Slider set to: '+newValue);
					}
				}
			}],
		});

		var segments = 15;
		var image = Ext.get('image');
		//image.dom.setAttribute('width', Ext.getCmp('imageView').getWidth());
		var originalImageWidth = image.getWidth();
		var originalImageHeight = image.getHeight();
		var imageWidth = Ext.getCmp('imageView').getWidth();
		var imageHeight = imageWidth * (originalImageHeight/originalImageWidth);
		console.log(imageWidth + 'x' + imageHeight);
		console.log(imageHeight/imageWidth);
		var canvas = Ext.get('canvas').dom.getContext('2d');
		canvas.drawImage(image.dom, 0, 0, imageWidth, imageHeight);
		image.hide();

		var segmentWidth = Math.ceil(imageWidth/segments);
		var segmentHeight = Math.ceil(imageHeight/3);

		var yOffset = segmentHeight;

		var segmentColors = [];

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


		// Segments
		for(var i = 0; i < segments; i++) {
			var xOffset = i*segmentWidth;
			//console.log('xOffset: '+xOffset);
			var imageData = canvas.getImageData(xOffset,yOffset,segmentWidth,segmentHeight);
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
			segmentColors.push({
				color: colors.getAverageColor(),
				x: xOffset,
				y: yOffset,
				width: segmentWidth,
				height: segmentHeight
			});
		}

		// Draw boxes
		segmentColors.forEach(function(segment) {
			var gray = colors.toBW(segment.color);
			canvas.borderColor = 'rgba(0, 0, 0, .5)';
			canvas.borderStyle = 'solid';
			canvas.fillStyle = 'rgba('+segment.color.red+', '+segment.color.green+', '+segment.color.blue+','+0.8+')';
			//canvas.fillStyle = 'rgba('+gray+', '+gray+', '+gray+','+.8+')';
			canvas.fillRect(segment.x, segment.y, segment.width, segment.height);
			canvas.strokeRect(segment.x, segment.y, segment.width, segment.height);
		});

	}
});
