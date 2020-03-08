let limit = 1e6, it = 0, iterations = 10000;
let colorSize = 250, colorWidth = 255;
let zoom = 0.5;
var at = 0;
let xMin = -2,
  xMax = 2;
let yMin = -2,
  yMax = 2;
// let xMin = -1.281982421875,
//   xMax = -1.280517578125;
// let yMin = 0.0552978515625,
//   yMax = 0.0567626953125;
var gridColor, done, gridC, gridValue;
var img;

class Complex {
  constructor(r, i) {
    this.r = r;
    this.i = i;
  }

  magnitude() {
    return this.r * this.r + this.i * this.i;
  }

  multiply(other) {
    // (a + bi) * (c + di)
    // (ac - bd) + (bc + ad)i
    let r = this.r * other.r - this.i * other.i;
    let i = this.i * other.r + this.r * other.i;
    this.r = r;
    this.i = i;
  }

  add(other) {
    this.r += other.r;
    this.i += other.i;
  }
  
  exploded() {
    return Number.isNaN(this.magnitude());
  }
  
  applyF(c) {
    this.multiply(this);
    this.add(c);
  }
}

function init() {
  noLoop();
  it = 0;
  for (var i = 0; i < height; i++)
    for (var j = 0; j < width; j++) {
      img.set(j, i, color(0, 0, colorWidth));
      gridC[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
      gridValue[i][j] = new Complex(0, 0);
      done[i][j] = false;
    }
  loop();
}

function setup() {
  // frameRate(60);
  colorMode(HSL, colorWidth);
  createCanvas(600, 600);
  img = createImage(height, width);

  gridColor = new Array(height);
  gridC = new Array(height);
  done = new Array(height);
  gridValue = new Array(height);
  for (var i = 0; i < height; i++) {
    gridColor[i] = new Array(width);
    gridC[i] = new Array(width);
    done[i] = new Array(width);
    gridValue[i] = new Array(width);
    for (var j = 0; j < width; j++) {
      img.set(j, i, color(0, 0, colorWidth));
      done[i][j] = false;
      gridC[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
      gridValue[i][j] = new Complex(0, 0);
    }
  }
}

function draw() {

  if (it++ <= iterations)
    for (var i = 0; i < height; i++)
      for (var j = 0; j < width; j++) {
        if (done[i][j]) continue;
        gridValue[i][j].applyF(gridC[i][j]);
        if (gridValue[i][j].exploded()) {
          img.set(j, i, color(3 * int(colorWidth * (it + 1) / colorSize) % colorWidth, 2 * int(colorWidth * (it + 1) / colorSize) % colorWidth, int(colorWidth * (it + 1) / colorSize) % colorWidth));
          done[i][j] = true;
        }
      }
  img.updatePixels();
  
  image(img, 0 ,0);

  stroke(colorWidth, colorWidth, colorWidth);
  text(xMin.toFixed(2) + ' ' + yMin.toFixed(2), width - 75, 20);
  text(xMax.toFixed(2) + ' ' + yMax.toFixed(2), width - 75, 30);
  text(it, width - 75, 40);
}

function mouseWheel(event) {
  let dir = event.delta < 0 ? zoom : 1 / zoom;
  let x = (mouseX + 2*width/2) / (3 * width) * (xMax - xMin) + xMin;
  let y = (mouseY + 2*height/2) / (3*height) * (yMax - yMin) + yMin;
  let xdelta = (xMax - xMin) / 2 * dir, ydelta = (yMax - yMin) / 2 * dir;
  xMin = x - xdelta; xMax = x + xdelta;
  yMin = y - ydelta; yMax = y + ydelta;
  print(dir, x, y, '|\n', xdelta, ydelta, '|\n', xMin.toFixed(4), xMax.toFixed(4), yMin.toFixed(4), yMax.toFixed(4));
  init();
}

function keyReleased() {
  if (key >= '1' && key <= '3') {
    modes = [HSB, RGB, HSL];
    mode = modes[int(key - '1')]
    colorMode(mode, colorWidth);
  }

  // if (key == 's') {
  //   noLoop();
  // }
  // if (key == 'd') {
  //   init();
  // }

  if (key == 'r') {
    xMin = -2;
    xMax = 2;
    yMin = -2;
    yMax = 2;
  }

  let xdelta = (xMax - xMin) * zoom,
    ydelta = (yMax - yMin) * zoom;

  if (keyCode == UP_ARROW) {
    yMin += ydelta;
    yMax += ydelta;
  }
  if (keyCode == DOWN_ARROW) {
    yMin -= ydelta;
    yMax -= ydelta;
  }
  if (keyCode == LEFT_ARROW) {
    xMin -= xdelta;
    xMax -= xdelta;
  }
  if (keyCode == RIGHT_ARROW) {
    xMin += xdelta;
    xMax += xdelta;
  }

  if (key == '+') {
    xMin += xdelta;
    xMax -= xdelta;
    yMin += ydelta;
    yMax -= ydelta;
  }
  if (key == '-') {
    xMin -= xdelta;
    xMax += xdelta;
    yMin -= ydelta;
    yMax += ydelta;
  }

  init();
  print(xMin, xMax, yMin, yMax);
}