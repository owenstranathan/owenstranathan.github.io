anonParticles = [];
let angle = 0;
let mouseWrapper = {
  pos: null,
  prevPos: null,
  radius: 5
};

function setup() {
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent("sketch-holder");

  // at set up make a bunch of particles and add them to an empty array
  var buffer = 20; // some space from edge of window
  var numberOfParticles = Math.ceil(windowHeight / 50);
  for (var i = 0; i < numberOfParticles; i++) {
    var randomX = random(buffer, windowWidth);
    var randomY = random(buffer, windowHeight);
    var randomSize = random(1, 22);
    var randomSpeed = random(1, 2);

    var anonParticle = new AnonParticle(
      randomX,
      randomY,
      randomSize,
      randomSpeed
    );
    anonParticles.push(anonParticle);
  }
}

// update method
function draw() {
  background(255, 255, 255);

  mouseWrapper.pos = createVector(mouseX, mouseY);
  for (var i = 0; i < anonParticles.length; i++) {
    anonParticles[i].show(angle);
    anonParticles[i].kinematics();
    for (var j = 0; j < anonParticles.length; j++) {
      anonParticles[i].collideMouse(mouseWrapper);
      if (i != j) {
        anonParticles[i].collision(anonParticles[j]);
        if (anonParticles[i].lineDrawIntersects(anonParticles[j])) {
          anonParticles[i].lerpLineDraw(anonParticles[j]);
        }
      }
      anonParticles[i].drag();
      anonParticles[i].vel.limit(5);
      if (anonParticles[i].vel.magSq() < 1) {
        anonParticles[i].vel.setMag(1);
      }
    }
  }
  mouseWrapper.prevPos = mouseWrapper.pos;
  angle += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
