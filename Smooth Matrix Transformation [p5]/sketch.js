let wsz = 6,
  hsz = 10;
let curveRadious = 50;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    point(this.x, this.y);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  mult(alpha) {
    return new Point(this.x * alpha, this.y * alpha);
  }

  rotate(angle) {
    /*
    cos -sin
    sin cos
    
    x*(cos + sin), y*(cos - sin)
    */
    let c = cos(angle),
      s = sin(angle);
    return new Point(this.x * (c + s), this.y * (c - s));
  }
}

class PixelArt {
  constructor(n, m, mat) {
    this.n = n;
    this.m = m;
    this.mat = new Array(n);
    for (var i = 0; i < this.n; i++) {
      this.mat[i] = new Array(m);
      for (var j = 0; j < this.m; j++)
        this.mat[i][j] = mat[i][j];
    }
    this.points = [];
    for (var i = 0; i < this.n; i++)
      for (var j = 0; j < this.m; j++)
        if (this.mat[i][j] == '.')
          this.points.push(new Point((width - this.m * wsz) / 2 + j * wsz + wsz / 2, (height - this.n * hsz) / 2 + i * hsz + hsz / 2));
  }

  draw() {
    for (var i = 0; i < this.points.length; i++)
      this.points[i].draw();
  }
}

function smoothFunction(t) {
  return min(1, max(0, atan(t) / (PI * 0.7) + 0.5));
}

function pointBetween(u, v) {
  let vu = v.sub(u);
  let angle = atan2(vu.y, vu.x);
  let dCurve = new Point(curveRadious * sin(tt * 8 * PI), curveRadious * sin(tt * 4 * PI)).rotate(angle);
  return u.add(vu.mult(tt)).add(dCurve);
}

var pixelArts;
let animatedPoints = 600;
var t, tt, dt = 0.02;
let slider;

let data;

function preload() {
  data = loadStrings('women\'s day.txt');
}

function setup() {
  createCanvas(500, 500);

  stroke(0, 0, 255);
  strokeWeight(8);

  // slider = createSlider(0, 1, 0, 0.01);

  var it = 0;
  pixelArts = [];
  for (var k = 0; k < 2; k++) {
    var n = int(data[it].split(' ')[0]);
    var m = int(data[it++].split(' ')[1]);
    var mat = new Array(n);
    for (var i = 0; i < n; i++)
      mat[i] = data[it++];
    pixelArts.push(new PixelArt(n, m, mat));
  }
  t = 0;
}

function draw() {
  background(255);

  tt = smoothFunction(t);
  for (var i = 0; i < animatedPoints; i++) {
    let u = pixelArts[0].points[i % pixelArts[0].points.length];
    let v = pixelArts[1].points[(i + 100) % pixelArts[1].points.length];
    pointBetween(u, v).draw();
  }

  let u = new Point(10, 50), v = new Point(width - 10, 50);
  pointBetween(u, v).draw();
  t += dt;
  if (t > 2.5 || t < -2.5) dt *= -1;
}