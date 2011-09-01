Filters = {};
Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img);
  return ctx.getImageData(0,0,c.width,c.height);
};

Filters.getCanvas = function(w,h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};


Filters.RGBA2A = function(pixels, context) {
	var d = pixels.data;
	var out = {};
	var outData = out.data = [];
	out.width = pixels.width;
	out.height = pixels.height;

	var j = 0;
	for (var i=0; i<d.length; i+=4) {
		var r = d[i];
		var g = d[i+1];
		var b = d[i+2];
		outData[j] = 0.2126*r + 0.7152*g + 0.0722*b;
		j++;
		
	}
	return out;
};

Filters.A2RGBA = function(pixels, context) {
	var d = pixels.data;
	var out = context.createImageData(pixels.width,pixels.height);
	var outData = out.data;
	out.width = pixels.width;
	out.height = pixels.height;

	var j = 0;
	for (var i=0; i<d.length; i++) {
		var v = d[i];

		outData[j] = outData[j+1] = outData[j+2] = v;
		outData[j+3] = 255;
		j += 4;
	}
	return out;
};



function rgbDist(r1, g1, b1,   r2, g2, b2)
{
	return abs(r1-r2)+abs(g1-g2)+abs(b1-b2);
}


var blackMax = 0;
function fill4(x, y, r1, neueFarbe) {
 
  if (getPixel(x, y) == alteFarbe){
     
     markierePixel(x, y, neueFarbe);
     
     fill4(x, y + 1, alteFarbe, neueFarbe); // unten
     fill4(x - 1, y, alteFarbe, neueFarbe); // links
     fill4(x, y - 1, alteFarbe, neueFarbe); // oben
     fill4(x + 1, y, alteFarbe, neueFarbe); // rechts
  
  }
  return;
}


// adapted from: http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
function lineIterator(x0, y0, x1, y1, callback) {
	var disty = y1 - y0;
	if (disty < 0) disty = -disty;
	var distx = x1 - x0;
	if (distx < 0) distx = -distx;

	var steep = disty > distx;
	if (steep) {
		//swap(x0, y0)
		//swap(x1, y1)
		var tmp = x0;
		x0 = y0;
		y0 = tmp;
		tmp = x1;
		x1 = y1;
		y1 = tmp;
	}
	if (x0 > x1) {
		//swap(x0, x1)
		//swap(y0, y1)
		var tmp = x0;
		x0 = x1;
		x1 = tmp;
		tmp = y0;
		y0 = y1;
		y1 = tmp;
	}	
	var deltax = x1 - x0;
	var deltay = disty;
	var error = deltax / 2;
	var ystep;
	var y = y0;
	if (y0 < y1) ystep = 1;
	else ystep = -1;

	for (x = x0; x <= x1; x++) {
        	if (steep) callback(y,x);
		else callback(x,y);
         	error = error - deltay;
         	if (error < 0) {
             		y = y + ystep;
             		error = error + deltax;
		}
	}
}
