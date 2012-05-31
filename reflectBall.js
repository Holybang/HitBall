

var debugFlag = 1;

function debugCall(s)
{
    if(debugFlag) console.log(s);
}

function vec2toString()
{
    return "(" + this.x + ", " + this.y + ")";
}

function newVector2(x, y)
{
	debugCall("newVector2(x, y)");
    vec = new Object();
	if(x == undefined) {
	    x = 0;
	}
	if(y == undefined) {
	    y = 0;
	}
	vec.x = x;
	vec.y = y;
	vec.toString = vec2toString;
	return vec;
}

function vector2Dis(vec0, vec1)
{
    debugCall("vector2Dis(vec0, vec1)");
    dx = vec0.x - vec1.x;
	dy = vec0.y - vec1.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function dotMulVec2(vec0, vec1)
{
    debugCall("dotMulVec2(vec0, vec1)");
    return vec0.x*vec1.x + vec0.y*vec1.y;
}

function mulVec2(vec0, a)
{
    debugCall("mulVec2(vec0, a)");
    return newVector2(vec0.x*a, vec0.y*a);
}

function normalizedVec2(vec)
{
    len = Math.sqrt(vec.x*vec.x + vec.y*vec.y);
	return mulVec2(vec, 1.0/len);
}

function addVec2(vec0, vec1)
{
    debugCall("addVec2(vec0, vec1)");
    return newVector2(vec0.x + vec1.x, vec0.y + vec1.y);
}

function moveFun(k, b, x)
{
    debugCall("moveFun(k, b, x)");
    return k*x + b;
}

function reflect(edgeNorm, inDir)
{
    debugCall("reflect(edgeNorm, inDir)");
	debugCall(edgeNorm.toString() + ", " + inDir.toString());
    //edgeNorm.dot(-in)*edgeNorm*2 - (-in) = out
	ix = -inDir.x;
	iy = -inDir.y;
	nx = edgeNorm.x;
	ny = edgeNorm.y;
	dotRslt = nx*ix + ny*iy;
	ox = 2*dotRslt*nx - ix;
	oy = 2*dotRslt*ny - iy;
	outDir = new Object();
	outDir.x = ox;
	outDir.y = oy;
	debugCall(ox + ", " + oy);
	return outDir;
}

function hitEdge_Point(x, y, left, right, top, bottom)
{
    debugCall("hitEdge_Point(x, y, left, right, top, bottom");
	debugCall(x + ", " + y + ", " + left + ", " + right + ", " + top + ", " + bottom);
	edgeNorm = newVector2();
    if(x < left) {
	    debugCall("hit left");
	    edgeNorm.x = 1;
		edgeNorm.y = 0;
	} else if(x > right) {
	    debugCall("hit right");
		edgeNorm.x = -1; 
		edgeNorm.y = 0;
	} else if(y < top) {
	    debugCall("hit top");
		edgeNorm.x = 0; 
		edgeNorm.y = 1;
	} else if(y > bottom) {
	    debugCall("hit bottom");
		edgeNorm.x = 0;
		edgeNorm.y = -1;
	}
	debugCall(edgeNorm.toString());
	return edgeNorm;
}

function isNoneZeroVec2(vec)
{
    debugCall("isNoneZeroVec2(vec)");
    return vec.x != 0 || vec.y != 0;
}

function isEdgeNormValid(edgeNorm)
{
    debugCall("isEdgeNormValid(edgeNorm)");
    return isNoneZeroVec2(edgeNorm);
}

function hitEdge_Ball(x, y, r, left, right, top, bottom) 
{
    debugCall("hitEdge_Ball(x, y, r, left, right, top, bottom");
	debugCall(x + ", " + y + ", " + r + ", " + left + ", " + right + ", " + top + ", " + bottom);
	edgeNorm = newVector2();
	edgeNorm = hitEdge_Point(x - r, y, left, right, top, bottom);
	if(isEdgeNormValid(edgeNorm)) {
	    return edgeNorm;
	}
	edgeNorm = hitEdge_Point(x + r, y, left, right, top, bottom);
	if(isEdgeNormValid(edgeNorm)) {
	    return edgeNorm;
	}
	edgeNorm = hitEdge_Point(x, y + r, left, right, top, bottom);
	if(isEdgeNormValid(edgeNorm)) {
	    return edgeNorm;
	}
	edgeNorm = hitEdge_Point(x, y - r, left, right, top, bottom);
	if(isEdgeNormValid(edgeNorm)) {
	    return edgeNorm;
	}
	return edgeNorm;
}

function hitBall(x, y, r, xx, yy, rr)
{
    debugCall("hitBall(x, y, r, xx, yy, rr)");
    edgeNorm = newVector2();
	
}

function hitAndReflect(x, y, r, dir, left, right, top, bottom)
{
    debugCall("hitAndRelect(x, y, r, dir, left, right, top, bottom)");
	debugCall(x + ", " + y + ", " + r + ", " + left + ", " + right + ", " + top + ", " + bottom);
    hitEdgeNorm = hitEdge_Ball(x, y, r, left, right, top, bottom);
	if(isEdgeNormValid(hitEdgeNorm)) {
	    return reflect(hitEdgeNorm, dir);
	}
	return newVector2();
}

function trancateCircleCen(x, y, r, left, right, top, bottom) 
{
    debugCall("trancateCircleCen");
    if(x - r < left) x = left + r + 0.1;
	if(x + r > right) x = right - r - 0.1;
	if(y - r < top) y = top + r + 0.1;
	if(y + r > bottom) y = bottom - r - 0.1;
	debugCall(x + ", " + y);
	return newVector2(x, y);
}



var st = 0;
var et = 0;

var r = 15;
var circleCen = newVector2(r + 1, r + 1);
var currDir = normalizedVec2(newVector2(1, 1));

var count=0;
var timeStep = 1000/60;
var t;
var timer_is_on=0;
var speed = 5;

var graphicObjects;

function redraw()
{
    debugCall("redraw()");
	
    var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	
	newCircleCen = addVec2(circleCen, mulVec2(currDir, speed));
	
    edgeLeft = 0;
	edgeRight = c.width;
	edgeTop = 0;
	edgeBottom = c.height;

	//console.log("previous cen: " + circleCen.toString());
	//console.log("previous dir: " + currDir.toString());
	
    newDir = hitAndReflect(newCircleCen.x, newCircleCen.y, r, currDir, edgeLeft, edgeRight, edgeTop, edgeBottom);
	if(isNoneZeroVec2(newDir)) {
	    console.log("hit!");
	    currDir = newDir;
		//truncate center
		newCircleCen = trancateCircleCen(newCircleCen.x, newCircleCen.y, r, edgeLeft, edgeRight, edgeTop, edgeBottom);
	}
	
	
	circleCen = newCircleCen;
	//console.log("current cen: " + circleCen.toString());
	//console.log("current dir: " + currDir.toString());
	

	ctx.clearRect(0, 0, c.width, c.height);
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	ctx.arc(circleCen.x,circleCen.y,r,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
}

function timedCount()
{
debugCall("timeCount()");
document.getElementById('lineEditor0').value=count;
count=count+1;
redraw();
t=setTimeout("timedCount()",timeStep);
}

function doTimer()
{
debugCall("doTimer()");
if (!timer_is_on)
  {
  timer_is_on=1;
  timedCount();
  }
}

function stopCount()
{
debugCall("stopCount()");
clearTimeout(t);
timer_is_on=0;
}