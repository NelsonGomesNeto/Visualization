/* Second Order Differential Equation:
  drag == air-resistance coefficient
  L == distance from the anchor to the pendulum

  theta''(t) = -drag * theta'(t) - g / L * sin(theta(t))
*/

class Pendulum {
  constructor(anchor=new Vector(width / 2, height / 4), theta=Math.PI/2, speed=0, distance=height / 4, weight=50) {
    this.anchor = anchor;
    this.position = new Vector(0, 0);
    this.distance = distance;
    this.weight = weight; // Irrelevant, but we will use for the ball size
    
    this.theta = theta;
    this.thetaAcceleration = 0;
    this.thetaSpeed = speed;
  }

  update() {
    for (var it = 0; it < iterations; it++) {
      this.thetaAcceleration = (-drag * this.thetaSpeed - g / this.distance * sin(this.theta)) * dt;
      this.thetaSpeed += this.thetaAcceleration;
      this.theta += this.thetaSpeed;
      while (this.theta > Math.PI)
        this.theta -= 2 * Math.PI;
      while (this.theta < -Math.PI)
        this.theta += 2 * Math.PI;
    }
  }

  draw() {
    stroke(255);
    fill(255);
    let x = this.anchor.x + this.distance * sin(this.theta);
    let y = this.anchor.y + this.distance * cos(this.theta);
    this.position.x = x, this.position.y = y;
    line(this.anchor.x, this.anchor.y, x, y);
    ellipse(x, y, this.weight, this.weight);
  }
}