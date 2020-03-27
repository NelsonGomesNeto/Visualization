var idCount = 0;

class Block {
  constructor(position, mass, col) {
    this.id = idCount++;
    this.position = position;
    this.mass = mass;
    this.massPower = '10^' + round(Math.log10(this.mass), 0);
    this.size = 50 + 10 * Math.log10(this.mass);
    this.size2 = this.size / 2;
    this.col = col;
    
    this.acceleration = new Vector(0, 0);
    this.speed = new Vector(0, 0);
    this.position.y = height - this.size2;
  }

  draw() {
    fill(this.col);
    rect(this.position.x - this.size2, this.position.y - this.size2, this.size, this.size);
    fill(255), textSize(20);
    text(this.massPower, this.position.x, this.position.y);
  }

  collides(other) {
    let leftX = this.position.x - this.size2, rightX = this.position.x + this.size2;
    let otherLeftX = other.position.x - other.size2, otherRightX = other.position.x + other.size2;
    if (otherLeftX >= leftX && otherLeftX <= rightX)
      return true;
    if (otherRightX >= leftX && otherRightX <= rightX)
      return true;
    return false;
  }

  transferMomentum(other) {
    // using v2' = 2 * m1 * v1 / (m1 + m2) - v2 * (m1 - m2) / (m1 + m2)
    // and v1 = 2 * m2 * v2 / (m1 + m2) + v1 * (m1 - m2) / (m1 + m2)
    let v1 = this.speed.x, v2 = other.speed.x;
    let m1 = this.mass, m2 = other.mass;
    this.speed.x = 2 * m2 * v2 / (m1 + m2) + v1 * (m1 - m2) / (m1 + m2);
    other.speed.x = 2 * m1 * v1 / (m1 + m2) - v2 * (m1 - m2) / (m1 + m2);
  }

  fixCollisions() {
    if (this.position.x - this.size2 < 0) {
      this.position.x = this.size2 + -(this.position.x - this.size2);
      this.speed.x *= -1, this.acceleration.x *= -1;
      collisionsCount++, collided = true;
    }
    // if (this.position.x + this.size2 > width) {
    //   this.position.x = (width - this.size2) - (this.position.x + this.size2 - width);
    //   this.speed.x *= -1, this.acceleration.x *= -1;
    // }

    if (this.id == 0)
      for (var i = 0; i < blocks.length; i++)
        if (blocks[i].id != this.id)
          if (this.collides(blocks[i])) {
            collisionsCount++, collided = true;
            this.transferMomentum(blocks[i]);
          }
  }

  update() {
    this.speed.add(this.acceleration);
    this.position.add(this.speed);
    this.fixCollisions();
  }
}