import { GameSprite, Time } from "./GameScript";

export default class GameSymbol {
  constructor(name, speed, pos, hp, score, img, w, h) {
    this.sprite = new GameSprite(img, pos, { width: w, height: h })
    this.name = name;
    this.speed = speed;
    this.hp = hp;
    this.score = score;
  }

  get position() { return this.sprite.position }

  update() {
    if (this.hp <= 0)
      return

    this.movement()
    this.sprite.update()
    this.draw()

    this.sprite.onUpdate = () => {

      // console.log('update')
      this.onUpdate && this.onUpdate()
    }
  }

  draw() {
    let centerX = this.sprite.position.x + this.sprite.size.width / 2;
    let single = centerX / this.hp;
    let space = 5;

    for (var i = 0; i < this.hp; i++) {
      this.drawHealth(centerX);
    }
  }

  drawHealth(x) {
    window.ctx.beginPath();
    window.ctx.fillStyle = "red";
    window.ctx.arc(x, this.sprite.position.y - 10, 5, 0, 2 * Math.PI);
    window.ctx.fill();
    window.ctx.closePath();
  }

  movement() {
    this.sprite.position.y += this.speed * Time.deltaTime;
  }

  takeDame(damge) {

    this.hp -= damge;

    if (this.hp <= 0) {
      this.sprite.destroy()
    }
  }
}
