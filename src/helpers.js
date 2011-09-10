function removeAllChildrenFromNode(node)
{
	if(node == undefined) return;
	while (node.hasChildNodes())
	{
	  node.removeChild(node.firstChild);
	}
}


function asyncLoadImageFromFile(file) {
	if (file.type.indexOf("image") == 0) {
		var reader = new FileReader();
		reader.onload = function(e) {
			asyncLoadImageFromURL(e.target.result);
		}
		reader.readAsDataURL(file);
	}
}

function asyncLoadImageFromURL(url) {
	img = new Image();
	img.onload = function() {
		drawImage(img);
	}
	img.src = url;
	return img;
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;



