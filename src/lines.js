function createLine4(x1, y1, x2, y2) {
	


}

function calculateCenterPoint(mask) {
	var xSum = 0, ySum = 0, sumN = 0;
	
	var outIndex = 0;
	for (y = 0; y < mask.height; y++) {
		for (x = 0; x < mask.width; x++) {
			if (mask.data[outIndex] > 0) {
				xSum += x;
				ySum += y;
				sumN++;
			}
			outIndex++;
		}
	}

	return {x:xSum/sumN, y:ySum/sumN, n:sumN}; 
}

function intersectLines(l1, l2) {
	// a*d1 = (p2-p1)+ b*d2

	// a*d1x = (p2.x-p1.x) + b*d2x;
	// a*d1y = (p2.y-p1.y) + b*d2y

	//  a = ((p2.x-p1.x) + b*d2x)/d1x;
	//  b = ((p2.x-p1.x) + b*d2x)/d1x;

	var dx1 = l1.p1.x - l1.p2.x;
	var dy1 = l1.p1.y - l1.p2.y;

	var dx2 = l2.p1.x - l2.p2.x;
	var dy2 = l2.p1.y - l2.p2.y;

	var A = NumJS.MAT(2, 2, [
		dx1, -dx2,
		dy1, -dy2
	]);

	var Y = NumJS.MAT(2, 1, [l2.p1.x-l1.p1.x, l2.p1.y-l1.p1.y]);
	var X = NumJS.SOLVE(A, Y);
	
	var x = l1.p1.x + X.get(0,0) * dx1;
	var y = l1.p1.y + X.get(0,0) * dy1;

	return {x:x, y:y};
}

function distancePoints(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	
	return Math.sqrt(dx*dx+dy*dy);
}

function normalizeLine(line)
{
	var x = line.x;
	var y = line.y;

	var valid1 = false, valid2 = false;
	var x1, y1;
	var x2, y2;

	if (line.dx != 0) {
		x1 = 0;
		y1 = line.y - line.dy * (line.x/line.dx)	
		valid1 = true;
	}
	
	if (line.dy != 0) {
		x2 = line.x - line.dx * (line.y/line.dy)	
		y2 = 0;
		valid2 = true;
	}

	if (valid1 && valid2) {
		if (Math.abs(y1) < Math.abs(x2)) 
			return {x:x1, y:y1, dx:line.dx, dy:line.dy};
		else
			return {x:x2, y:y2, dx:line.dx, dy:line.dy};
	}
	else if (valid1) {
		return {x:x1, y:y1, dx:line.dx, dy:line.dy};
	}
	else if (valid2) {
		return {x:x2, y:y2, dx:line.dx, dy:line.dy};
	}
	else {
		alert("why is this hapening??");
		return {x:line.x, y:line.y, dx:line.dx, dy:line.dy};
	}
}

function intersectLinePoint(point, alpha, d, mask, fn) {
	var tx = point.x + Math.cos(alpha)*d;
	var ty = point.y + Math.sin(alpha)*d;


	var xSum = 0, ySum = 0, sumN = 0;
	var activated = 0, dead= false;	

	lineDirectedIterator(Math.round(point.x), Math.round(point.y), Math.round(tx), Math.round(ty), function (x, y) {
		if (!dead && x >= 0 && y >= 0 && x < mask.width && y < mask.height) {
			var idx = x+mask.width*y;
			if (fn(mask.data[idx], x, y)) {
				xSum += x;
				ySum += y;
				sumN++;
				activated = 5;
			}
			else if (activated) {
				activated--;
				if (!activated)
					dead = true;
			}
		}
	}); 

	if (sumN > 0) {
		return {x:xSum/sumN, y:ySum/sumN};
	}
	return {x:0, y:0};	
}

function drawLine2(p1, p2, pixels, r, g, b) {
	drawLine(p1.x, p1.y, p2.x, p2.y, pixels, r, g, b);
}

function drawLine(x1, y1, x2, y2, pixels, r, g, b) {
	var w = pixels.width;
	var h = pixels.height;

	xiaolinWuLineIterator(x1, y1, x2, y2, function(x, y, c) { 
		if (x >= 0 && y >= 0 && x < w && y < h) {
			var idx = 4*(x+w*y);
			pixels.data[idx] = (1-c) * pixels.data[idx] + c * r;
			pixels.data[idx+1] = (1-c) * pixels.data[idx+1] + c * g;
			pixels.data[idx+2] = (1-c) * pixels.data[idx+2] + c *  b;
			//pixels.data[idx+3] = 255;
		}
	});

}

function drawLine2A(p1, p2, pixels, v) {
	drawLineA(p1.x, p1.y, p2.x, p2.y, pixels, v);
}

function drawLineA(x1, y1, x2, y2, pixels, v) {
	var w = pixels.width;
	var h = pixels.height;

	xiaolinWuLineIterator(x1, y1, x2, y2, function(x, y, c) { 
		if (x >= 0 && y >= 0 && x < w && y < h) {
				var idx = (x+w*y);
				pixels.data[idx] = (1-c) * pixels.data[idx] + c * v;
		}
	});
}

function averageLine2A(p1, p2, pixels) {
	return integrateLineA(p1.x, p1.y, p2.x, p2.y, pixels).avg;
}

function integrateLine2A(p1, p2, pixels) {
	return integrateLineA(p1.x, p1.y, p2.x, p2.y, pixels);
}

function integrateLineA(x1, y1, x2, y2, pixels) {
	var w = pixels.width, h = pixels.height;
	var sum = 0;
	var weightSum = 0;

	xiaolinWuLineIterator(x1, y1, x2, y2, function(x, y, c) { 
		if (x >= 0 && y >= 0 && x < w && y < h) {
			sum += c * pixels.data[(x+w*y)];
			weightSum += c;
		}
	});
	if (weightSum == 0) return {sum:0, avg:0, n:0};

	return {sum:sum, avg:sum/weightSum, n:weightSum};
}

function improveLine(line, bwPixelsSobolev, epsilon, thresh) {
	var steps;
	
	do {	
		steps = 0;
		steps += improve1Point(line.p1, line.p2, 0, bwPixelsSobolev, epsilon, thresh);
		steps += improve1Point(line.p1, line.p2, Math.PI/2, bwPixelsSobolev, epsilon, thresh);
		steps += improve1Point(line.p1, line.p2, -Math.PI/2, bwPixelsSobolev, epsilon, thresh);

		steps += improve1Point(line.p2, line.p1, 0, bwPixelsSobolev, epsilon, thresh);
		steps += improve1Point(line.p2, line.p1, Math.PI/2, bwPixelsSobolev, epsilon, thresh);
		steps += improve1Point(line.p2, line.p1, -Math.PI/2, bwPixelsSobolev, epsilon, thresh);
		//alert(steps);
	} while (steps > 0);
	
}


function calcParameters(pointsIn, pointsOut)
{
	var M = NumJS.MAT(8, 8);
	var rhs = NumJS.MAT(8, 1);
	var para;

	for (var i = 0; i < 4; i++) {
		// M.row(i*2 + 0) << pointsOut[i].x*pointsIn[i].x, pointsOut[i].x*pointsIn[i].y, -pointsIn[i].x, -pointsIn[i].y, -1,     0,    0,  0;
		// M.row(i*2 + 1) << pointsOut[i].y*pointsIn[i].x, pointsOut[i].y*pointsIn[i].y,     0,    0,  0, -pointsIn[i].x, -pointsIn[i].y, -1;
		// rhs(i*2 + 0) = -pointsOut[i].x;
		// rhs(i*2 + 1) = -pointsOut[i].y;
		M.paste(i*2+0,0,1,8, [pointsOut[i].x*pointsIn[i].x, pointsOut[i].x*pointsIn[i].y, -pointsIn[i].x, -pointsIn[i].y, -1,     0,    0,  0]);
		M.paste(i*2+1,0,1,8, [pointsOut[i].y*pointsIn[i].x, pointsOut[i].y*pointsIn[i].y,     0,    0,  0, -pointsIn[i].x, -pointsIn[i].y, -1]);
		rhs.set(i*2+0,0, -pointsOut[i].x);
		rhs.set(i*2+1,0, -pointsOut[i].y);
	}

	para = NumJS.SOLVE(M, rhs);
	return para;
}

function fwdMapXY(matrix, point)
{
	var k = matrix.get(0,0), l = matrix.get(1,0), d = matrix.get(2,0), e = matrix.get(3,0);
	var f = matrix.get(4,0), g = matrix.get(5,0), h = matrix.get(6,0), i = matrix.get(7,0);
	var a = d*point.x + e*point.y + f;
	var b = g*point.x + h*point.y + i;
	var c = k*x + l*y + 1;
	return {x:xtic = a / c, y:b / c};
}

function invMapXY(matrix, point)
{
	var k = matrix.get(0,0), l = matrix.get(1,0), d = matrix.get(2,0), e = matrix.get(3,0);
	var f = matrix.get(4,0), g = matrix.get(5,0), h = matrix.get(6,0), i = matrix.get(7,0);
	var xt = point.x, yt = point.y;
	// Maxima: string(solve([xt*x*k + xt*y*l - x*d - y*e - f = -xt, yt*x*k + yt*y*l - x*g - y*h - i = -yt], [x,y]));
	var x = -(e*(yt-i)-f*l*yt+(i*l-h)*xt+f*h)/(-d*l*yt+e*k*yt+(g*l-h*k)*xt+d*h-e*g);
	var y = (d*(yt-i)-f*k*yt+(i*k-g)*xt+f*g)/(-d*l*yt+e*k*yt+(g*l-h*k)*xt+d*h-e*g);

	return {x:x, y:y};
}



function improve1Point(p1, p2, a, bwPixelsSobolev, epsilon, thresh) {
	
	var bestIntegral = integrateLine2A(p1, p2, bwPixelsSobolev);
	

	var stepOut = false;
	var e2 = epsilon;
	var steps = 0;
	do {
		var dx = p1.x - p2.x;
		var dy = p1.y - p2.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		dx /= d;
		dy /= d;

		var xn = p1.x + (Math.cos(a)*dx + Math.sin(a)*dy)*e2;
		var yn = p1.y + (-Math.sin(a)*dx + Math.cos(a)*dy)*e2;

		var newIntegral = integrateLine2A({x:xn, y:yn}, p2, bwPixelsSobolev);
		if (newIntegral.avg > bestIntegral.avg) {
		//if (newIntegral.sum > bestIntegral.sum) { // && newIntegral.sum - bestIntegral.sum > newIntegral.avg - bestIntegral.avg) {
			p1.x = xn;
			p1.y = yn;
			bestIntegral = newIntegral;
			steps++;
		}
		else e2 /= 2;
		if (e2 < thresh)
			break;
	} while(true);
	return steps;
}

function findLineCandidates(pixels, maskPixels, bwPixelsSobolev) {
	var point = calculateCenterPoint(maskPixels);
	var d = 4*Math.sqrt(point.n);

	var bestGroup = [];
	var bestAvg = -1;
		
	for (var offset = 0; offset < Math.PI/2; offset += 0.1) {	

		var group = [];
		var minAvg = -1;
		for (var i = 0; i < 4; i++) {
			var p1 = intersectLinePoint(point, offset + i * Math.PI/2, d, bwPixelsSobolev, function(v) {return v > 40});
			var p2 = intersectLinePoint(point, offset + i * Math.PI/2 + Math.PI/6, d, bwPixelsSobolev, function(v) {return v > 40});
		
			var a = Math.atan2(p1.y - p2.y, p1.x - p2.x);

			var isOut = 0, isDead = false;
			var pp1 = myLineExtender(p1, a, d, bwPixelsSobolev); 
		
			isOut = 0; isDead = false;
			var pp2 = myLineExtender(p2, a + Math.PI, d, bwPixelsSobolev); 

			var avg = averageLine2A(pp1, pp2, bwPixelsSobolev);
			if (minAvg < 0 || avg < minAvg) minAvg = avg; 

			group.push({p1:pp1, p2:pp2});

			//drawLine2(point, p1, pixels, 255, 155, 0);
			//drawLine2(point, p2, pixels, 255, 155, 0);
			//drawLine2(pp1, pp2, pixels, 0, 255, 0);
		}
		if (bestAvg < minAvg) {
			bestGroup = group;
			bestAvg = minAvg;
		}
	}

	return bestGroup;
}

function myLineExtender(point, alpha, dist, bwPixelsSobolev) {
	var isOut = 0, isDead = false;
	var lastX = 0, lastY = 0;

	intersectLinePoint(point, alpha, dist, bwPixelsSobolev, 
		function(v, x, y) {
			if (isDead) return false;

			if (v > 40)
			{
				lastX = x;
				lastY = y
				isOut = 0;
			}
			else if (isOut == 0)
				isOut = 20;

			if (isOut) { 
				isOut--; 
				if (!isOut) {
					isDead = true; 
					return true;
				} 
			} 

			return false;
		}
	);

	return {x:lastX, y:lastY};
}


	


