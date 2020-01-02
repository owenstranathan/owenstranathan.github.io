function binarySearch(search, list, prop) {
	var left = 0;
	var right = list.length - 1;
	while (left <= right) {
		var middle = Math.floor((left + right) / 2);
		var propRes = prop(list[middle]);
		if (propRes < search) {
			left = middle + 1;
		} else if (propRes > search) {
			right = middle - 1;
		} else {
			return list[middle];
		}
	}
	return null;
}

function insertionSort(unsortedList, pred) {
	var len = unsortedList.length;
	for (var i = 1; i < len; i++) {
		var tmp = unsortedList[i]; //Copy of the current element.
		/*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
		for (var j = i - 1; j >= 0 && pred(unsortedList[j], tmp); j--) {
			//Shift the number
			unsortedList[j + 1] = unsortedList[j];
		}
		//Insert the copied number at the correct position
		//in sorted part.
		unsortedList[j + 1] = tmp;
	}
}

function AnonParticle(id, xCoord, yCoord, radius, speed) {
  this.id = id;
  this.pos = createVector(xCoord, yCoord);
  this.vel = p5.Vector.random2D();
  this.vel.mult(speed);
  this.accl = createVector();
  this.radius = radius;
  this.col = color(255, 255, 255, 80);
  this.drawDistance = 200;
  this.extents = createVector(radius, radius);
}

function AABB(particle) {
	this.lower = createVector(particle.pos.x - particle.radius, particle.pos.y - particle.radius);
	this.upper = createVector(particle.pos.x + particle.radius, particle.pos.y + particle.radius);
	this.id = particle.id;
}

AnonParticle.prototype.update = function() {
	console.assert(particle.id == this.id);
	// this.aabb.lower.x = this.pos.x - this.radius;
	// this.aabb.lower.y = this.pos.y - this.radius;
	// this.aabb.upper.x = this.pos.x + this.radius;
	// this.aabb.upper.y = this.pos.y + this.radius;
}

AnonParticle.prototype.area = function() {
  return Math.PI * this.radius ** 2;
};

AnonParticle.prototype.lower = function () {
	// bottom left corner of AABB for this particle
	return p5.Vector.sub(this.pos, this.extents);
}

AnonParticle.prototype.upper = function () {
	// top right corner of AABB for this particle
	return p5.Vector.add(this.pos, this.extents);
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
  if(p5.Vector.dot(this.vel, correctiveForce) == 0) { // the dot is zero on a parting velocity
	return;
  }
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
  this.drag();
  this.vel.limit(5);
  if (this.vel.magSq() < 1) {
	 this.vel.setMag(1);
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
