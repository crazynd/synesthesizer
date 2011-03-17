Ext.onReady(function() {
	var segments = 15;
	var image = document.getElementById('image');
	var imageWidth = image.width;
	var imageHeight = image.height;
	var canvas = document.getElementById('canvas');
	canvas.setAttribute('width', imageWidth);
	canvas.setAttribute('height', imageHeight);
	var context = canvas.getContext('2d');

	context.drawImage(image, 0, 0, imageWidth, imageHeight);
	image.setAttribute('style', 'display: none;');
	var values = [];
	//console.log('yOffset: '+yOffset);

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
		var imageData = context.getImageData(xOffset,yOffset,segmentWidth,segmentHeight);
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
		context.borderColor = 'rgba(0, 0, 0, .5)';
		context.borderStyle = 'solid';
		context.fillStyle = 'rgba('+segment.color.red+', '+segment.color.green+', '+segment.color.blue+','+0.8+')';
		//context.fillStyle = 'rgba('+gray+', '+gray+', '+gray+','+.8+')';
		context.fillRect(segment.x, segment.y, segment.width, segment.height);
		context.strokeRect(segment.x, segment.y, segment.width, segment.height);
	});
});
