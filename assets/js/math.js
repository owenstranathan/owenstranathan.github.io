/***********
 * Vectors *
 ***********/

function Vec2(x,y) {
	this.x = x;
	this.y = y;
}

Vec2.prototype.zero = function () {
	return new Vec2(0.0,0.0);
}

Vec2.prototype.dot = function(other) {
	return this.x * other.x + this.y + other.y;
}

Vec2.prototype.cross = function(other) {
	return this.x * other.y - this.y * other.x;
}

Vec2.prototype.add = function(other) {
	return new Vec2(this.x + other.x, this.y + other.y);
}

Vec2.prototype.sub = function(other) {
	return new Vec2(this.x - other.x, this.y - other.y);
}

Vec2.prototype.mult = function(scalar) {
	return new Vec2(scalar * this.x, scalar * this.y);
}

Vec2.prototype.div = function(scalar) {
	return new Vec2(scalar / this.x, scalar / this.y);
}

Vec2.prototype.squaredMagnitude = function() {
	return this.dot(this);
}

Vec2.prototype.magnitude = function() {
	return Math.sqrt(this.squaredMagnitude);
}

Vec2.prototype.normalized = function() {
	var mag = this.magnitude;
	if (mag = 0) { return Vec2.zero(); }
	return this.div(mag);
}

Vec2.prototype.nomralize = function() {
	var mag = this.magnitude;
	if (mag = 0) { return this.x = this.y = 0.0; }
	this.x /= mag;
	this.y /= mag;
}

// Lol I don't need all this crap down there

/**********
 * Shapes *
 **********/

function Rectangle(position, width, height) {
	this.position = position;
	this.width = width;
	this.height = height;
	this.rotation = 0.0;
	var halfWidth = width/2;
	var halfHeight = height/2;
	this.model = [
		new Vec2(-halfWidth,  halfHeight), // top right
		new Vec2( halfWidth,  halfHeight), // top left
		new Vec2( halfWidth, -halfHeight), // bottom left
		new Vec2(-halfWidth, -halfHeight), // bottom right
	]
	this.vertices = [
		this.position.add(this.model[0]),
		this.position.add(this.model[1]),
		this.position.add(this.model[2]),
		this.position.add(this.model[3]),
	]
}

Rectangle.prototype.update = function(){
	for(var i = 0; i < 4; i++) {
		// TODO: implement rotation
		this.vertices[i] = this.position.add(this.model[i]);
	}
}


function lineSegmentIntersection(a, b, c, d) {
	var h = (d.x - c.x) * (a.y - b.y) - (a.x - b.x) * (d.y - c.y);
	if (h == 0){
		return false; // h is zero when the lines are colinear
	}
	var t = ((a.x - c.x) * (a.y - b.y) + (a.y - c.y) * (b.x - a.x)) / h;
	var s = ((a.x - c.x) * (c.y - d.y) + (a.y - c.y) * (d.x - c.x)) / h;
	if (s >= 0 && s < 1 && t >=0 && t < 1) {
		return a + s * (b-a);
	} else {
		return null;
	}
}

function findNormal(a, b, c) {
	var u = b.sub(a);
	var v = c.sub(a);
	var product = u.cross(v);
	if (product == 0) {
		// c is colinear/parallel to ba
		return Vec2.zero;
	} else if (product > 0) {
		// c is on the right of ba
		return new Vec2(-u.y, u.x);  // {-dy, dx} is the right normal
	} else {
		// c is on the left
		return new Vec2(u.y, -u.x);  // {dy, -dx} is the left normal
}
}

