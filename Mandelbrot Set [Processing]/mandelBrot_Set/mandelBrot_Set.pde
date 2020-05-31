int it, iterations = 100000;
int colorPaletteSize = 1000, colorFlipSize = 500;
double xMin = -1.5, xMax = 1.5, yMin = -1.5, yMax = 1.5;
double zoom = 0.7;
Complex c0 = new Complex(-0.8, 0.156);
Complex[][] z, c;
boolean[][] done;
boolean juliaSet = false;
PGraphics pg;
int calculationId = 0;

void setup() {
  size(800, 800);
  //pg = createGraphics(width, height);
  colorMode(HSB, colorPaletteSize, colorPaletteSize, colorPaletteSize);

  z = new Complex[height][width];
  c = new Complex[height][width];
  done = new boolean[height][width];

  thread("init");
}

void init() {
  int currentCalculationId = ++calculationId;
  loadPixels();
  for (int i = 0; i < height; i++)
    for (int j = 0; j < width; j++) {
      if (juliaSet) {
        z[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
        c[i][j] = c0.copy();
      } else {
        z[i][j] = new Complex(0, 0);
        c[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
      }
      done[i][j] = false;
      pixels[i*width + j] = color(0, 0, colorPaletteSize);
    }
  if (currentCalculationId != calculationId) return;
  calculate();
  updatePixels();
}

void calculate() {
  int currentCalculationId = calculationId;
  it = 0;
  for (it = 0; it <= iterations; it++) {
    int k = int(colorPaletteSize * (1.0+sin(it / 100.0))/2.0);
    int r = 2 * k % colorPaletteSize;
    int g = 3 * k % colorPaletteSize;
    int b = 1 * k % colorPaletteSize;
    color col = color(r, g, b);
    for (int i = 0; i < height; i++)
      for (int j = 0; j < width; j++) {
        if (currentCalculationId != calculationId) return;
        if (!done[i][j]) {
          z[i][j].applyF(c[i][j]);
          if (z[i][j].exploded()) {
            //int col = int(colorPaletteSize * sqrt(it) / sqrt(iterations));
            
            pixels[i*width + j] = col;
            //float a = map(col, 0, 1, 0, colorPaletteSize);
            //float b = map(col, 0, 1, 0, 2*colorPaletteSize);
            //float c = map(col, 0, 1, 0, 3*colorPaletteSize);
            //pixels[i*width + j] = color(int(a) % colorPaletteSize, int(b) % colorPaletteSize, int(c) % colorPaletteSize);
            done[i][j] = true;
          }
        }
      }
  }
}

void draw() {
  updatePixels();

  stroke(colorPaletteSize, colorPaletteSize, colorPaletteSize);
  textSize(20);
  text(String.format("%.2f %.2f", xMin, yMin), width - 200, 20);
  text(String.format("%.2f %.2f", xMax, yMax), width - 200, 40);
  text(it, width - 200, 60);
  text(frameRate, width - 200, 80);
}

void mouseWheel(MouseEvent event) {
  double dir = event.getCount() < 0 ? zoom : 1.0 / zoom;
  double x = (mouseX + 2.0*width/2.0) / (3.0*width) * (xMax - xMin) + xMin;
  double y = (mouseY + 2.0*height/2.0) / (3.0*height) * (yMax - yMin) + yMin;
  double xdelta = (xMax - xMin) / 2 * dir, ydelta = (yMax - yMin) / 2 * dir;
  xMin = x - xdelta; 
  xMax = x + xdelta;
  yMin = y - ydelta; 
  yMax = y + ydelta;

  thread("init");
}

void keyReleased() {
  if (key == 'r') {
    xMin = -1.5; 
    xMax = 1.5;
    yMin = -1.5; 
    yMax = 1.5;
  }
  if (key == 'd')
    thread("init");
  if (key == '1')
    colorMode(RGB, colorPaletteSize, colorPaletteSize, colorPaletteSize);
  if (key == '2')
    colorMode(HSB, colorPaletteSize, colorPaletteSize, colorPaletteSize);
  if (key == '+')
    colorFlipSize += 25;
  if (key == '-')
    colorFlipSize += 25;
}
