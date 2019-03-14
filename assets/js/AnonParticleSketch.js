anonParticles = [];
let angle = 0;

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

  for (var i = 0; i < anonParticles.length; i++) {
    anonParticles[i].show(angle);
    anonParticles[i].kinematics();
    for (var j = 0; j < anonParticles.length; j++) {
      if (i != j) {
        anonParticles[i].collision(anonParticles[j]);
        if (anonParticles[i].lineDrawIntersects(anonParticles[j])) {
          anonParticles[i].lerpLineDraw(anonParticles[j]);
        }
      }
      anonParticles[i].vel.limit(2);
    }
  }
  angle += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
