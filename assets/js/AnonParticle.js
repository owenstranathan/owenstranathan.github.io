function AnonParticle(xCoord, yCoord, radius, speed) {
  this.pos = createVector(xCoord, yCoord);
  this.vel = p5.Vector.random2D();
  this.vel.mult(speed);
  this.accl = createVector();
  this.radius = radius;
  this.col = color(255, 255, 255, 80);
  this.drawDistance = 200;
}

AnonParticle.prototype.changeColor = function() {
  this.col = color(0, 0, 0);
};

AnonParticle.prototype.collision = function(anotherParticle) {
  var relPos = p5.Vector.sub(this.pos, anotherParticle.pos);
  var distSq = relPos.magSq();
  var collisionRadius = (this.radius + anotherParticle.radius) ** 2;
  if (distSq < collisionRadius) {
    var relCollisionPoint = p5.Vector.mult(relPos.normalize(), this.radius);
    var collisionPoint = p5.Vector.add(this.pos, relCollisionPoint);
    var correctiveForce = p5.Vector.sub(collisionPoint, this.pos).normalize();
    // correctiveForce = p5.Vector.mult(correctiveForce, -1);
    correctiveForce = correctiveForce;
    this.vel.add(correctiveForce);
  }
};

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
  this.vel.add(impusle);
};

// kinda like ideal gas, perfect rteflections
AnonParticle.prototype.kinematics = function() {
  // basic kinematics
  this.pos.add(this.vel);
  this.vel.add(this.accl);

  if (this.pos.x < 0) {
    this.vel.x *= -1;
  } else if (this.pos.x > windowWidth) {
    this.vel.x *= -1;
  } else if (this.pos.y < 0) {
    this.vel.y *= -1;
  } else if (this.pos.y > windowHeight) {
    this.vel.y *= -1;
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
