// global variables
anonParticles = [];
let angle = 0;

// formatted screen to fill entire window
function setup() {
  var canv = createCanvas(windowWidth, windowHeight * (3.0 / 4.0));
  canv.parent("sketch-holder");
  // removes scroll bars
  //   canv.style("display", "block");

  // at set up make a bunch of particles and add them to an empty array
  var buffer = 20; // some space from edge of window
  var numberOfParticles = 50; // testing collision detection
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
  // frameRate(30);
  background(255, 255, 255);

  for (var i = 0; i < anonParticles.length; i++) {
    anonParticles[i].show(angle);
    anonParticles[i].kinematics();
    for (var j = 0; j < anonParticles.length; j++) {
      if (i != j && anonParticles[i].lineDrawIntersects(anonParticles[j])) {
        // change color
        // anonParticles[i].changeColor();
        // impulse
        // anonParticles[i].applyForce();
        // anonParticles[j].changeColor();
        // anonParticles[j].applyForce();
        anonParticles[i].lerpLineDraw(anonParticles[j]);
      }
    }
  }
  angle += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
