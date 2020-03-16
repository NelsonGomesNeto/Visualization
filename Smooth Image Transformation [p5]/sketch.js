let curveRadious = 50;
let imagesPath = ['1.jpg', '2.jpg'];
var images = [], pg;
var imagesPixels = [], biggest = 0;

function copyColor(a) {
  var res = new Array(4);
  for (var k = 0; k < 4; k++)
    res[k] = a[k];
  return res;
}

function addColor(a, b) {
  var res = new Array(4);
  for (var k = 0; k < 4; k++)
    res[k] = a[k] + b[k];
  return res;
}

function subColor(a, b) {
  var res = new Array(4);
  for (var k = 0; k < 4; k++)
    res[k] = a[k] - b[k];
  return res;
}

function multColor(a, alpha) {
  var res = new Array(4);
  for (var k = 0; k < 4; k++)
    res[k] = a[k] * alpha;
  return res;
}

class Pixel {
  constructor(i, j, c = [255, 255, 255, 255]) {
    this.i = i;
    this.j = j;
    this.c = copyColor(c);
  }

  compare(other) {
    for (var k = 0; k < this.c.length; k++) {
      if (this.c[k] < other.c[k]) return -1;
      if (this.c[k] > other.c[k]) return 1;
    }
    return 0;
  }

  draw() {
    pg.set(Math.round(this.i), Math.round(this.j), this.c);
  }

  add(other) {
    return new Pixel(this.i + other.i, this.j + other.j, addColor(this.c, other.c));
  }

  sub(other) {
    return new Pixel(this.i - other.i, this.j - other.j, subColor(this.c, other.c));
  }

  mult(alpha) {
    return new Pixel(this.i * alpha, this.j * alpha, multColor(this.c, alpha));
  }

  rotate(angle) {
    /*
      cos -sin
      sin cos
      
      x*(cos + sin), y*(cos - sin)
    */
    let co = cos(angle), si = sin(angle);
    return new Pixel(this.i * (co + si), this.j * (co - si), this.c);
  }
}

function smoothFunction(t) {
  return min(1, max(0, atan(t) / (PI * 0.7) + 0.5));
}

function pointBetween(u, v) {
  let vu = v.sub(u);
  return u.add(vu.mult(tt));
  let angle = atan2(vu.i, vu.j);
  let dCurve = new Pixel(curveRadious * sin(tt * 8 * PI), curveRadious * sin(tt * 4 * PI), [0, 0, 0, 0]).rotate(angle);
  return u.add(vu.mult(tt)).add(dCurve);
}

var t = 0, tt, dt = 0.1;
var loaded = 0;

function setup() {
  createCanvas(600, 600);
  pg = createImage(width, height);

  fill(255);
  textSize(20);

  imagesPath.forEach((path) => {
    loadImage(path, img => {
      img.resize(300, 0);
      images.push(img);
      print(img);

      var p = new Array(img.height * img.width);
      for (var i = 0; i < img.height; i++)
        for (var j = 0; j < img.width; j++)
          p[i*img.width + j] = new Pixel(j, i, img.get(j, i));  
      p.sort((a, b) => a.compare(b));
      biggest = Math.max(biggest, p.length);
      imagesPixels.push(p);
      print(p.length);

      loaded++;
    });
  });
}

function draw() {
  background(0);

  if (loaded == imagesPath.length) {
    tt = smoothFunction(t);
    pg.loadPixels();
    for (var i = 0; i < height; i++)
      for (var j = 0; j < width; j++)
        pg.set(j, i, 0);

    for (var i = 0; i < biggest; i++) {
      let u = imagesPixels[0][i % imagesPixels[0].length];
      let v = imagesPixels[1][i % imagesPixels[1].length];
      pointBetween(u, v).draw();
    }

    let u = new Pixel(10, height - 50), v = new Pixel(width - 10, height - 50);
    pointBetween(u, v).draw();
    t += dt;
    if (t > 2.5 || t < -2.5) dt *= -1;
    
    pg.updatePixels();
    image(pg, 0, 0, 1*width, 1*height);
  }
  
  text(tt, width / 2, height - 20);
}