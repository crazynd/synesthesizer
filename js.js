window.onDomReady = DomReady;
//Setup the event
function DomReady(fn)
{
	//W3C
	if(document.addEventListener)
	{
		document.addEventListener("DOMContentLoaded", fn, false);
	}
}
//execute as soon as DOM is loaded
window.onDomReady(function() {

	var segments = 5;
	var image = document.getElementById('cat');
	var imageWidth = image.width;
	var imageHeight = image.height;
	var canvas = document.getElementById('image');
	canvas.setAttribute('width', imageWidth);
	canvas.setAttribute('height', imageHeight);
	var context = canvas.getContext('2d');

	context.drawImage(image,0,0);
	document.getElementById('cat').setAttribute('style', 'display: none;');
	var values = [];
	var yOffset = Math.floor(imageHeight/3);
	console.log('yOffset: '+yOffset);

	var segmentColors = [];

	var colors = {
		reds: 0,
		greens: 0,
		blues: 0,
		count: 0,
		getAverageColor: function() {
			var red = parseInt(colors.reds/colors.count);
			var green = parseInt(colors.greens/colors.count);
			var blue = parseInt(colors.blues/colors.count);
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
		}
	};

	segmentWidth = Math.floor(imageWidth/segments);
	segmentHeight = Math.floor(imageHeight/3);

	// Segments
	for(var i = 0; i < segments; i++) {
		var xOffset = i*segmentWidth;
		console.log('xOffset: '+xOffset);
		var imageData = context.getImageData(xOffset,yOffset,segmentWidth,segmentHeight);
		var segmentPixels = [];

		// Vertical
		for(var j = 0; j < imageData.height; j++) {

			// Horizontal
			for(var n = 0; n < imageData.width; n++) {
				var index = ( (n*4)*imageData.width ) +(j*4);
				var index = ((n*4) * j);
				colors.reds += imageData.data[index];
				colors.greens += imageData.data[index+1];
				colors.blues += imageData.data[index+2];
				colors.count += 1;
				/*
				if(n === Math.floor(imageWidth/segments)-1) {
					imageData.data[0] = 0;
					imageData.data[1] = 0;
					imageData.data[2] = 0;
				} else {
					imageData.data[0] = 45;
					imageData.data[1] = 244;
					imageData.data[2] = 46;
				}
				context.putImageData(imageData, xOffset+n, yOffset+j);
				*/
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
		context.fillStyle = 'rgba('+segment.color.red+', '+segment.color.green+', '+segment.color.blue+','+.8+')';
		context.fillRect(segment.x, segment.y, segment.width, segment.height);

	});
});
