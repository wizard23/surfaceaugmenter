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
