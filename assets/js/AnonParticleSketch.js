anonParticles = [];
aabbs = [];
xaxisorder = [];
yaxisorder = [];

let angle = 0;
let mouseWrapper = {
  pos: null,
  prevPos: null,
  radius: 1
};
let mouseParticle = null;
let canv = null
let start_id = 0;


function setup() {
  canv = createCanvas(windowWidth, windowHeight);
  canv.parent("sketch-holder");

  // at set up make a bunch of particles and add them to an empty array
  var buffer = 20; // some space from edge of window
  var numberOfParticles = Math.ceil(Math.max(windowHeight, windowWidth) / 50);
  // var numberOfParticles = 100;
  for (var i = 0; i < numberOfParticles; i++) {
    var randomX = random(buffer, windowWidth);
    var randomY = random(buffer, windowHeight);
    var randomSize = random(5, 22);
    var randomSpeed = random(1, 2);

    var anonParticle = new AnonParticle(
	  start_id++,
      randomX,
      randomY,
      randomSize,
      randomSpeed
    );
    anonParticles.push(anonParticle);
	// aabbs.push(new AABB(anonParticle));
	xaxisorder.push(anonParticle);
	yaxisorder.push(anonParticle);
  }
  // anonParticles[0].pos = anonParticles[1].pos;
  mouseParticle = new AnonParticle(
    mouseX,
    mouseY,
    5,
    0
  );
  updateAABBs();
}

function updateAABBs() {
	// for(var i = 0; i < aabbs.length; i++) {
	// 	var aabb = aabbs[i];
	// 	var particle = binarySearch(aabb.id, anonParticles, function(p) {return p.id;});
	// 	console.assert(particle != null);
	// 	aabbs[i].update(particle);
	// }
	// aabbs.sort(function(a, b) { return a.id > b.id; }); // javascript sorts greatest to least for some reason...

	insertionSort(xaxisorder, function(a, b) {
		return a.lower().x > b.lower().x;
	});
	insertionSort(xaxisorder, function(a, b) {
		return a.lower().y > b.lower().y;
	});
	// xaxisorder.sort(function(a, b) {
	// 	var aabbA = binarySearch(a, aabbs, function(aabb) { return aabb.id;});
	// 	console.assert(aabbA != null);
	// 	var aabbB = binarySearch(b, aabbs, function(aabb) { return aabb.id;});
	// 	console.assert(aabbB != null);
	// 	return aabbA.lower.x > aabbB.lower.x;
	// });
	// yaxisorder.sort(function(a, b) {
	// 	var aabbA = binarySearch(a, aabbs, function(aabb) { return aabb.id;});
	// 	console.assert(aabbA != null);
	// 	var aabbB = binarySearch(b, aabbs, function(aabb) { return aabb.id;});
	// 	console.assert(aabbB != null);
	// 	return aabbA.lower.y > aabbB.lower.y;
	// });
}

// update method
function draw() {
  clear()
  mouseParticle.pos.x = mouseX;
  mouseParticle.pos.y = mouseY;
  mouseParticle.show(angle);
  updateAABBs();
  const x_axis = 1;
  const y_axis = 2;
  const both_axes = 3;
  var pairs = [];
  for(var a = 0; a < 2; a++) {
    var axisorder = a<1 ? xaxisorder : yaxisorder;
    var axis = a+1
    var check = function (vec) {
   	return a < 1 ? vec.x : vec.y;
    }
    var searchProp = function(particle) { return particle.id; };
    var start = axisorder[0]
    var max = check(start.upper());
    for(var i = 1; i < anonParticles.length; i++) {
   	var current = axisorder[i];
    for(var j = i - 1; j >= 0; --j) {
   		var previous = axisorder[j];
   		var prevUp = check(previous.upper());
   		var curLow = check(current.lower());
   		if (prevUp > curLow) {
   			// collision
   			if (pairs.length == 0) {
   					console.assert(axis == x_axis); // this should only happen on the x-axis because of the short circuit at the bottom of the outermost loop
   					pairs.push({ax: axis, first: current, second: previous });
   			} else {
   				// otherwise
   				var pairPredicate = function (pair) {
   					return (pair.first.id == previous.id && pair.second.id == current.id) || (pair.first.id == current.id && pair.second.id == previous.id);
   				};
   				// look for the pair in the pairs list
   				var search = pairs.find(pairPredicate);
   				// if you find it then set the axis
   				if (search != undefined) {
   					search.ax |= axis;
   				} else if (a<1){ // if this is second axis and we didn't have an overlap already then
   					// we don't there's no potential collision
   					// otherwise add the pair to the list
   					pairs.push({ax: axis, first: current, second: previous });
   				}
   			}
   		}
   		// if the current collider is right of the right most point of our
   		// biggest-so-far box then we don't need to keep looking back
   		if (curLow > max) break;
   	}
   	// if this box's AABB is the biggest we've seen so far then remember it
   	var curUp = check(current.upper());
   	max = (curUp > max) ? curUp : max;
    }
  }
  for(var i = 0; i < pairs.length; i++) {
     pair = pairs[i];
     if(pair.ax == both_axes) {
 		var p1 = binarySearch(pair.first, anonParticles, searchProp);
 		console.assert(p1 != null);
 		var p2 = binarySearch(pair.second, anonParticles, searchProp);
 		console.assert(p2 != null);
 		if(p1.collision(p2)) { // resolve the collision;
 			p1.collide(p2);
 			p2.collide(p1);
 		}
     }
  }

  for (var i = 0; i < anonParticles.length; i++) {
    if (anonParticles[i].collision(mouseParticle)){
      anonParticles[i].collide(mouseParticle);
    }
    anonParticles[i].kinematics();
	anonParticles[i].show(angle);
  }

 //    for (var j = i; j < anonParticles.length; j++) {
 //      if (i != j) {
 //        if (anonParticles[i].collision(anonParticles[j])){
 //          anonParticles[i].collide(anonParticles[j]);
 //          anonParticles[j].collide(anonParticles[i]);
 //        }
 //        if (anonParticles[i].lineDrawIntersects(anonParticles[j])) {
 //          anonParticles[i].lerpLineDraw(anonParticles[j]);
 //        }
 //      }
 //      anonParticles[i].drag();
 //      anonParticles[i].vel.limit(5);
 //      if (anonParticles[i].vel.magSq() < 1) {
 //        anonParticles[i].vel.setMag(1);
 //      }
 //    }
 //  }
 //  angle += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
