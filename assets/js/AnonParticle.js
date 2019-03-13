// goal: make hdr colored, polygon

// particle takes an init (x.y)
function AnonParticle(xCoord, yCoord, radius, speed) {
  this.pos = createVector(xCoord, yCoord);
  this.vel = p5.Vector.random2D(); // 2D unit vector from a random angle
  this.vel.mult(speed);
  this.accl = createVector();
  this.radius = radius;
  this.col = color(255, 255, 255, 80);
  this.drawDistance = 200;
}

AnonParticle.prototype.changeColor = function() {
  //   this.col = color(random(255), random(255), random(255));
  this.col = color(0, 0, 0);
};

AnonParticle.prototype.collision = function(anotherParticle) {
  var distance = dist(
    this.pos.x,
    this.pos.y,
    anotherParticle.pos.x,
    anotherParticle.pos.y
  );

  if (distance < this.radius + anotherParticle.radius) {
    return true;
  } else {
    return false;
  }
};

// boolean to see if a particle is in range of another particle
AnonParticle.prototype.lineDrawIntersects = function(anotherParticle) {
  var distance = dist(
    this.pos.x,
    this.pos.y,
    anotherParticle.pos.x,
    anotherParticle.pos.y
  );

  if (distance < this.drawDistance) {
    return true;
  } else {
    return false;
  }
};

// draw line with transparency based on distance
// should only get called if lineDrawIntersects returns true
AnonParticle.prototype.lerpLineDraw = function(anotherParticle) {
  var distance = dist(
    this.pos.x,
    this.pos.y,
    anotherParticle.pos.x,
    anotherParticle.pos.y
  );
  // // lerp the transparency
  // var strokeTrans = (distance/this.drawDistance) * 255;
  var mappedDistToTransparency = map(distance, 0, 200, 255, 0);
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
  // polygon(x,y,radius, n)
  stroke(0, 0, 0, 80);
  fill(this.col);
  polygon(0, 0, this.radius, 7);
  pop();
};
