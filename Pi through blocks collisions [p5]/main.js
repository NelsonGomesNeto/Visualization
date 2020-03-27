var collisionSound;
var blocks;
var collisionsCount = 0, collided = false;
let stepsPerFrame = 100000000;

function loadStuff() {
  noLoop();
  collisionsCount = 0, idCount = 0;

  blocks = [];
  blocks.push(new Block(
    new Vector(2 * width / 10, height / 2),
    1,
    color(255, 0, 0)
  ));
  blocks.push(new Block(
    new Vector(4 * width / 10, height / 2),
    1000000000000000000.0,
    color(0, 0, 255))
  );

  blocks[1].speed = new Vector(-0.00000001, 0);
  loop();
}

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);

  soundFormats('mp3');
  collisionSound = loadSound('assets/collision.mp3');

  loadStuff();
}

function updateBlocks() {
  collided = false;
  for (var j = 0; j < stepsPerFrame; j++) {
    // for (var i = 0; i < blocks.length; i++)
    //   blocks[i].update();
    blocks[0].update();
    blocks[1].update();
  }
}

function drawBlocks() {
  // for (var i = 0; i < blocks.length; i++)
  //   blocks[i].draw();
  blocks[0].draw();
  blocks[1].draw();
}

function draw() {
  background(100);

  updateBlocks();
  drawBlocks();
  if (collided)
    collisionSound.play();

  fill(255), textSize(100);
  text(collisionsCount, width - 400, 100);
}

function keyReleased() {
  if (key == 'r') {
    loadStuff();
  }
  if (key == 'c') {
    collisionSound.play();
  }
}