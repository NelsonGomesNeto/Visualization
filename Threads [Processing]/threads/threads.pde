import java.util.List;
final int threadCount = 32;
int threadHeight;

void setup() {
  frameRate(2);
  size(600, 600);
  colorMode(RGB, 255);
  
  threadHeight = height / threadCount;
}

class DrawLinesThread extends Thread {
  int lo, hi;
  color c;

  public DrawLinesThread(int lo, int hi, color c) {
    this.lo = lo; this.hi = hi;
    this.c = c;
  }

  void run() {
    for (int i = lo; i <= hi; i++)
      for (int j = 0; j < width; j++)
        pixels[i*width + j] = c;
  }
}

void drawWithThreads() {
  Thread[] threads = new Thread[threadCount];

  for (int i = 0; i < threadCount; i++) {
    threads[i] = new DrawLinesThread(i*threadHeight, (i + 1)*threadHeight - 1, color(random(255), random(255), random(255)));
    threads[i].start();
  }

  try {
    for (int i = 0; i < threadCount; i++)
      threads[i].join();
  } catch(Exception e) {}
}

void draw() {
  loadPixels();
  drawWithThreads();
  updatePixels();
}
