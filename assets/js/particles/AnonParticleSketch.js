anonParticles = [];
let angle = 0;
let mouseWrapper = {
  pos: null,
  prevPos: null,
  radius: 1
};
let mouseParticle = null;
let canv = null


function setup() {
  canv = createCanvas(windowWidth, windowHeight);
  canv.parent("sketch-holder");

  // at set up make a bunch of particles and add them to an empty array
  var buffer = 20; // some space from edge of window
  var numberOfParticles = Math.ceil(Math.max(windowHeight, windowWidth) / 50);
  for (var i = 0; i < numberOfParticles; i++) {
    var randomX = random(buffer, windowWidth);
    var randomY = random(buffer, windowHeight);
    var randomSize = random(5, 22);
    var randomSpeed = random(1, 2);

    var anonParticle = new AnonParticle(
      randomX,
      randomY,
      randomSize,
      randomSpeed
    );
    anonParticles.push(anonParticle);
  }
  mouseParticle = new AnonParticle(
    mouseX,
    mouseY,
    5,
    0
  );
}

// update method
function draw() {
  clear()
  mouseParticle.pos.x = mouseX;
  mouseParticle.pos.y = mouseY;
  mouseParticle.show(angle);
  for (var i = 0; i < anonParticles.length; i++) {
    anonParticles[i].show(angle);
    anonParticles[i].kinematics();
    if (anonParticles[i].collision(mouseParticle)){
      anonParticles[i].collide(mouseParticle);
    }
    for (var j = i; j < anonParticles.length; j++) {
      if (i != j) {
        if (anonParticles[i].collision(anonParticles[j])){
          anonParticles[i].collide(anonParticles[j]);
          anonParticles[j].collide(anonParticles[i]);
        }
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
  angle += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
