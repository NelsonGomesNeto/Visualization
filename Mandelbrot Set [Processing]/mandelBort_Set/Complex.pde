public class Complex {
  double r, i;

  public Complex(double r, double i) {
    this.r = r;
    this.i = i;
  }

  public double magnitude() {
    return this.r * this.r + this.i * this.i;
  }

  public void multiply(Complex other) {
    // (a + bi) * (c + di)
    // (ac - bd) + (bc + ad)i
    double r = this.r * other.r - this.i * other.i;
    double i = this.i * other.r + this.r * other.i;
    this.r = r;
    this.i = i;
  }

  public void add(Complex other) {
    this.r += other.r;
    this.i += other.i;
  }
  
  public boolean exploded() {
    return Double.isNaN(this.r);
  }
  
  public void applyF(Complex c) {
    this.multiply(this);
    this.add(c);
  }
  
  public Complex copy() {
    return new Complex(this.r, this.i);
  }
}
