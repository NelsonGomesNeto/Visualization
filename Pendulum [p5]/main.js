let graphHeight = 290, graphWidth = 500, graphBallRadious = 2;

let dFade = 5;

var stop = false;
var drag = 1, g = 9.8, dt = 1e-5, iterations = 25;
var anchor;
var pendulum;

var thetaSlider, speedSlider, accelerationSlider, distanceSlider, weightSlider;
var dragSlider, gravitySlider;
var sliderTexts = [
  "theta",
  "speed*10^3",
  "acceleration*10^6",
  "distance",
  "weight",
  "drag",
  "gravity"
], valueTexts = new Array(6);

function setup() {
  createCanvas(940, 890);

  thetaSlider = createSlider(-Math.PI, Math.PI, 0, 1e-9);
  thetaSlider.position(width - 125, 50);
  speedSlider = createSlider(-200 * dt, 200 * dt, 0, 1e-9);
  speedSlider.position(width - 125, 100);
  accelerationSlider = createSlider(-200 * 1e3 * dt, 200 * 1e3 * dt, 0, 1e-9);
  accelerationSlider.position(width - 125, 150);
  distanceSlider = createSlider(0, height, 0, 1e-9);
  distanceSlider.position(width - 125, 200);
  weightSlider = createSlider(1, 100, 0, 1e-9);
  weightSlider.position(width - 125, 250);
  dragSlider = createSlider(-1, 10, 0, 1e-9);
  dragSlider.position(width - 125, 300);
  gravitySlider = createSlider(-50, 50, 0, 1e-9);
  gravitySlider.position(width - 125, 350);
  
  reset();
}

function reset() {
  background(0);

  anchor = new Vector(height / 2, 2 * height / 3);
  theta = Math.PI / 1.1;
  distance = height / 3;
  speed = -10 * dt;
  weight = 5;
  pendulum = new Pendulum(anchor, theta, speed, distance, weight);
}

function sliders() {
  textSize(32);
  fill(255);
  stroke(0);

  if (stop) {
    pendulum.theta = thetaSlider.value();
    pendulum.thetaSpeed = speedSlider.value();
    pendulum.thetaAcceleration = accelerationSlider.value();
    pendulum.distance = distanceSlider.value();
    pendulum.weight = weightSlider.value();
    
    drag = dragSlider.value();
    g = gravitySlider.value();
  }
  else {
    thetaSlider.value(pendulum.theta);
    speedSlider.value(pendulum.thetaSpeed);
    accelerationSlider.value(pendulum.thetaAcceleration);
    distanceSlider.value(pendulum.distance);
    weightSlider.value(pendulum.weight);

    dragSlider.value(drag);
    gravitySlider.value(g);
  }

  valueTexts[0] = pendulum.theta;
  valueTexts[1] = 1e3*pendulum.thetaSpeed;
  valueTexts[2] = 1e6*pendulum.thetaAcceleration;
  valueTexts[3] = pendulum.distance;
  valueTexts[4] = pendulum.weight;
  valueTexts[5] = drag;
  valueTexts[6] = g;
  textAlign(RIGHT, CENTER);
  for (var i = 0; i < sliderTexts.length; i++) {
    fill(255);
    if (i == 0) fill(255, 0, 0);
    if (i == 1) fill(0, 255, 0);
    if (i == 2) fill(255, 255, 0);
    text(sliderTexts[i] + ": ", width - 125, 28 + 50*i);
  }
  textAlign(LEFT, CENTER);
  for (var i = 0; i < sliderTexts.length; i++) {
    fill(0);
    rect(width - 125, 10 + 50*i, 200, 30);
    fill(255);
    if (i == 0) fill(255, 0, 0);
    if (i == 1) fill(0, 255, 0);
    if (i == 2) fill(255, 255, 0);
    text(round(valueTexts[i], 3), width - 125, 28 + 50*i);
  }
}

function graph() {
  stroke(255); fill(255);
  ellipse(graphWidth, graphHeight / 2, 0.1, 0.1);

  stroke(255, 0, 0); fill(255, 0, 0);
  ellipse(graphWidth, graphHeight / 2 + pendulum.theta * ((graphHeight / 2 - pendulum.weight) / Math.PI), graphBallRadious, graphBallRadious);
  stroke(0, 255, 0); fill(0, 255, 0);
  ellipse(graphWidth, graphHeight / 2 + 1e3 * pendulum.thetaSpeed * ((graphHeight / 2 - pendulum.weight) / Math.PI), graphBallRadious, graphBallRadious);
  stroke(255, 255, 0); fill(255, 255, 0);
  ellipse(graphWidth, graphHeight / 2 + 1e6 * pendulum.thetaAcceleration * ((graphHeight / 2 - pendulum.weight) / Math.PI), graphBallRadious, graphBallRadious);
}

function draw() {
  if (!stop) {
    loadPixels();
    for (var y = 0; y < graphHeight; y++)
      for (var x = 0; x < 510; x++)
        for (var k = 0; k < 4; k++)
          pixels[4*(y * width + x) + k] = pixels[4*(y * width + x + 1) + k];
    for (var y = graphHeight; y < height; y++)
      for (var x = 0, end = height + pendulum.weight; x <= end; x++)
        for (var k = 0; k < 3; k++)
          pixels[4*(y * width + x) + k] -= dFade;
    updatePixels();
  }

  if (!stop) {
    pendulum.update();
  }
  pendulum.draw();

  sliders();

  graph();
}

function keyReleased() {
  if (key == 'r')
    reset();
  if (key == 's')
    stop = !stop;
}