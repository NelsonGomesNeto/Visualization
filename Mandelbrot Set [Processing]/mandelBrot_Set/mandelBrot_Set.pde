import java.util.concurrent.atomic.AtomicBoolean;

int iterations = int(1e5), dit = 200;
int colorPaletteSize = 1000, colorFlipSize = 500;
double xMin = -1.5, xMax = 1.5, yMin = -1.5, yMax = 1.5;
double zoom = 0.7;
Complex c0 = new Complex(-0.8, 0.156);
Complex[][] z, c;
boolean[][] done;
boolean juliaSet = false;

color[] colorTable;

int threadCount = 12, threadHeight;
MainThread mainThread;
CalculateThread[] calculateThreads;
double calculationTime = 0;

void setup() {
  size(900, 900);
  loadPixels();
  colorMode(HSB, colorPaletteSize, colorPaletteSize, colorPaletteSize);

  z = new Complex[height][width];
  c = new Complex[height][width];
  done = new boolean[height][width];

  colorTable = new color[iterations];
  for (int i = 0; i < iterations; i++)
    colorTable[i] = color(i % colorPaletteSize, colorPaletteSize, colorPaletteSize);

  calculateThreads = new CalculateThread[threadCount];
  threadHeight = height / threadCount;
  for (int i = 0; i < threadCount; i++) {
    calculateThreads[i] = new CalculateThread(i*threadHeight, (i + 1)*threadHeight - 1);
    calculateThreads[i].start();
  }

  mainThread = new MainThread();
  mainThread.start();
}

class MainThread extends Thread {
  AtomicBoolean updated = new AtomicBoolean();

  void run() {
    while (true) {
      updated.set(false);
      while (!updated.get());

      for (int i = 0; i < threadCount; i++)
        calculateThreads[i].reseted.set(true);
    }
  }
}

class CalculateThread extends Thread {
  int lo, hi;
  AtomicBoolean reseted = new AtomicBoolean();

  CalculateThread(int lo, int hi) {
    this.lo = lo;
    this.hi = hi;
  }

  void run() {
    int i, j, it, d, pixelIndex;
    long prvTime;

    while (true) {
      reseted.set(false);

      for (i = lo, pixelIndex = lo*width; i <= hi; i++)
        for (j = 0; j < width; j++, pixelIndex++) {
          if (juliaSet) {
            z[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
            c[i][j] = c0.copy();
          } else {
            z[i][j] = new Complex(0, 0);
            c[i][j] = new Complex(xMin + (xMax - xMin) * (j + 1) / width, yMin + (yMax - yMin) * (i + 1) / height);
          }
          done[i][j] = false;
          pixels[pixelIndex] = color(colorPaletteSize, 0, 0);
        }

      for (it = 0; it < iterations && !reseted.get(); it += dit) {
        prvTime = System.nanoTime(); 
        for (i = lo, pixelIndex = lo*width; i <= hi; i++)
          for (j = 0; j < width; j++, pixelIndex++)
            if (!done[i][j])
              for (d = 0; d < dit; d++) {
                z[i][j].applyF(c[i][j]);
                if (z[i][j].exploded()) {
                  pixels[pixelIndex] = colorTable[it + d];
                  done[i][j] = true;
                  break;
                }
              }
        calculationTime = (System.nanoTime() - prvTime) / 1000000.0;
      }
      while (!reseted.get());
    }
  }
}

void draw() {
  updatePixels();

  stroke(colorPaletteSize, colorPaletteSize, colorPaletteSize);
  textSize(20);
  text(String.format("%.2f %.2f", xMin, yMin), width - 200, 20);
  text(String.format("%.2f %.2f", xMax, yMax), width - 200, 40);
  text(String.format("%.3f", calculationTime), width - 200, 60);
  text(frameRate, width - 200, 80);
}

void mouseDragged() {
  double xdelta = (xMax - xMin) / width, ydelta = (yMax - yMin) / height;
  xMin += xdelta*(pmouseX - mouseX);
  xMax += xdelta*(pmouseX - mouseX);
  yMin += ydelta*(pmouseY - mouseY);
  yMax += ydelta*(pmouseY - mouseY);
  
  mainThread.updated.set(true);
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

  mainThread.updated.set(true);
}

void keyReleased() {
  if (key == 'r') {
    xMin = -1.5; 
    xMax = 1.5;
    yMin = -1.5; 
    yMax = 1.5;
    mainThread.updated.set(true);
  }
  if (key == 'd') {
    mainThread.updated.set(true);
  }
  if (key == '1')
    colorMode(RGB, colorPaletteSize, colorPaletteSize, colorPaletteSize);
  if (key == '2')
    colorMode(HSB, colorPaletteSize, colorPaletteSize, colorPaletteSize);
  if (key == '+')
    colorFlipSize += 25;
  if (key == '-')
    colorFlipSize += 25;
}
