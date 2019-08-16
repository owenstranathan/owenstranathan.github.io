function AnonParticle(xCoord, yCoord, radius, speed) {
  this.pos = createVector(xCoord, yCoord);
  this.vel = p5.Vector.random2D();
  this.vel.mult(speed);
  this.accl = createVector();
  this.radius = radius;
  this.col = color(255, 255, 255, 80);
  this.drawDistance = 200;
}

AnonParticle.prototype.area = function() {
  return Math.PI * this.radius ** 2;
};

AnonParticle.prototype.lower = function () {
	// bottom left corner of AABB for this particle
	return p5.Vector(this.pos.x-this.radius, this.pos.y-this.radius);
}

AnonParticle.prototype.upper = function () {
	// top right corner of AABB for this particle
	return p5.Vector(this.pos.x+this.radius, this.pos.y+this.radius);
}

AnonParticle.prototype.circumference = function() {
  return Math.PI * this.radius * 2;
};

AnonParticle.prototype.changeColor = function() {
  this.col = color(0, 0, 0);
};

AnonParticle.prototype.drag = function(mouse) {
  let rho = 1.2;
  let dragCoef = 0.001;
  let dragForceCoef = 0.5 * rho * dragCoef;
  let dragForce = p5.Vector.mult(this.vel, -dragForceCoef);
  this.accl.add(dragForce);
};

AnonParticle.prototype.collision = function(anotherParticle, bedone=false) {
  var relPos = p5.Vector.sub(this.pos, anotherParticle.pos);
  var distSq = relPos.magSq();
  var collisionRadius = (this.radius + anotherParticle.radius) ** 2;
  if (distSq < collisionRadius) {
    return true  
  }
  else {
    return false;
  }
};

AnonParticle.prototype.collide = function(anotherParticle){
  var relPos = p5.Vector.sub(this.pos, anotherParticle.pos);
  var relCollisionPoint = p5.Vector.mult(relPos.normalize(), this.radius);
  var collisionPoint = p5.Vector.add(this.pos, relCollisionPoint);
  var correctiveForce = p5.Vector.sub(collisionPoint, anotherParticle.pos).normalize();
  this.vel.add(correctiveForce);
}

// boolean to see if a particle is in range of another particle
AnonParticle.prototype.lineDrawIntersects = function(anotherParticle) {
  var relPos = p5.Vector.sub(this.pos, anotherParticle.pos);
  var distSq = relPos.magSq();
  if (distSq < this.drawDistance ** 2) {
    return true;
  } else {
    return false;
  }
};

// draw line with transparency based on distance
// should only get called if lineDrawIntersects returns true
AnonParticle.prototype.lerpLineDraw = function(anotherParticle) {
  var relPos = p5.Vector.sub(this.pos, anotherParticle.pos);
  var distSq = relPos.magSq();
  var mappedDistToTransparency = map(distSq, 0, 200 ** 2, 255, 0);
  stroke(0, 0, 0, mappedDistToTransparency);
  line(this.pos.x, this.pos.y, anotherParticle.pos.x, anotherParticle.pos.y);
};

// weird overlap bug
AnonParticle.prototype.applyForce = function() {
  var impusle = createVector(-2 * this.vel.x, -2 * this.vel.y);
  this.accl.add(impusle);
};

// kinda like ideal gas, perfect rteflections
AnonParticle.prototype.kinematics = function() {
  // basic kinematics
  this.pos.add(this.vel);
  this.vel.add(this.accl);
  this.accl = createVector()

  var diff = this.pos.x - this.radius
  if ( diff < 0) {
    var fakeParticle = {
      pos: createVector(diff, this.pos.y),
      radius: Math.abs(diff)
    }
    this.collide(fakeParticle);
  } else{
    diff = this.pos.x + this.radius;
    if ( diff > windowWidth) {
      var fakeParticle = {
        pos: createVector(diff, this.pos.y),
        radius: Math.abs(diff - windowWidth)
      }
      this.collide(fakeParticle);
    }
  }
  diff = this.pos.y - this.radius;
  if (diff < 0) {
    var fakeParticle = {
      pos: createVector(this.pos.x, diff),
      radius: Math.abs(diff)
    }
    this.collide(fakeParticle);
  } 
  else{
    diff = this.pos.y + this.radius;
    if ( diff > windowHeight) {
      var fakeParticle = {
        pos: createVector(this.pos.x, diff),
        radius: Math.abs(diff - windowHeight)
      }
      this.collide(fakeParticle);
    }
  }
};

AnonParticle.prototype.show = function(angle) {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(-angle);
  stroke(0, 0, 0, 80);
  fill(this.col);
  polygon(0, 0, this.radius, 7);
  pop();
};
