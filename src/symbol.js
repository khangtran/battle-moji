export default class GameSymbol {
  constructor(name, speed, pos, hp, score, img, w, h) {
    this.name = name;
    this.speed = speed;
    this.hp = hp;
    this.source = new Image();
    this.source.onload = ev => {
      // this.draw();
    };
    this.source.src = img;
    this.size = { width: w, height: h };
    this.position = { x: pos.x, y: pos.y };
    this.score = score;
    this.update_id = 0;
    // this.update();

    this.draw();
  }

  draw() {
    let centerX = this.position.x + 15;
    let single = centerX / this.hp;
    let space = 5;

    for (var i = 0; i < this.hp; i++) {
      this.drawHealth(centerX);
    }
    window.ctx.drawImage(
      this.source,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
    // console.log('draw', this.position)
  }

  drawHealth(x) {
    window.ctx.beginPath();
    window.ctx.fillStyle = "red";
    window.ctx.arc(x, this.position.y - 10, 5, 0, 2 * Math.PI);
    window.ctx.fill();
    window.ctx.closePath();
  }

  update() {
    this.update_id = setInterval(() => {
      this.clear();
      this.drop();

      this.onUpdate && this.onUpdate();
    }, 33);
  }

  drop() {
    this.position.y += this.speed * 0.2;
    this.draw();
  }

  takeDame() {
    this.hp -= 1;
  }

  clear() {
    window.ctx.clearRect(
      this.position.x,
      this.position.y - 30,
      this.size.width,
      this.size.height + 30
    );
    this.onUpdate = null;
  }

  destroy() {
    clearInterval(this.update_id);
    this.clear();
  }
}
