
var canvas = document.getElementById('image');
var context = canvas.getContext("2d");
var image = document.getElementById('cat');

context.drawImage(image,0,0);
var values = [];
var yoffset = Math.ceil(113/3);

for(var i = 0; i < 5; i++) {
	
	var pommes = [];
	
	for(var j = 0; j < Math.ceil(113/3); j++) {
	
		for(var n = 0; n < Math.ceil(177/5); n++) {
			var xoffset = i*(Math.ceil(177/5));
			var pixeldata = context.getImageData(xoffset+n, yoffset+j, 1, 1);
			pommes.push(pixeldata.data);
			//pixeldata[] = [0,255,255,255];
			pixeldata.data[0] = 45;
			pixeldata.data[1] = 244;
			pixeldata.data[2] = 46;
			context.putImageData(pixeldata, xoffset+n, yoffset+j);
		}

	}
	values.push(pommes);	

}

console.log(values);
//data = context.getImageData(0, 0, 177, 113).data;
