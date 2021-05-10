
export class GVector2D {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    static distance(a, b) {
        let x = Math.pow(b.x - a.x, 2)
        let y = Math.pow(b.y - a.y, 2)
        let result = Math.sqrt(Math.abs(x) + Math.abs(y))
        return result
    }
}

export class GSprite {

    constructor(img, position, size) {
        this.position = new GVector2D(position.x, position.y)
        this.source = new Image();
        this.source.src = img;
        this.source.onload = () => {
            this.draw();
        };
        this.size = { width: size.width || 50, height: size.height || 50 }
        let padding = this.size.width / 2
        this.bound = { x: this.position.x, y: this.position.y - padding, width: this.size.width, height: this.size.height + padding }

        this._updateID = -1

        this.update()
    }

    start() {
        this.onStart && this.onStart()
    }

    update() {
        this._updateID = setInterval(() => {
            this.clear()
            this.draw()
            let padding = this.size.width / 2
            this.bound = { x: this.position.x, y: this.position.y - padding, width: this.size.width, height: this.size.height + padding }

            this.onUpdate && this.onUpdate()
        }, 33);
    }

    draw() {

        window.ctx.drawImage(
            this.source,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }

    clear() {
        window.ctx.clearRect(this.position.x,
            this.bound.y,
            this.bound.width,
            this.bound.height)
    }

    destroy() {
        clearInterval(this._updateID)
        this.clear()

        console.log('destroy')
    }
}

