
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

export class GameObject {

    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;

        this.isColliding = false;
    }
}

export class Square extends GameObject {
    constructor(context, x, y, xx, yy) {
        super(context, x, y, xx, yy)

        this.width = 50
        this.height = 50
    }

    draw() {
        this.context.fillStyle = this.isColliding ? '#ff8080' : '#0099b0';
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(secondsPassed) {
        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

export class GameSprite {

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
    }

    start() {
        this.onStart && this.onStart()
    }

    update() {
        this.clear()
        this.draw()

        // this.drawDebugBound()

        let padding = this.size.width / 2 + 5
        this.bound = { x: this.position.x, y: this.position.y - padding, width: this.size.width, height: this.size.height + padding }

        this.onUpdate && this.onUpdate()
    }

    drawDebugBound() {
        window.ctx.beginPath();
        window.ctx.rect(this.bound.x, this.bound.y, this.bound.width, this.bound.height)
        window.ctx.stroke();
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
        window.ctx.clearRect(this.bound.x,
            this.bound.y,
            this.bound.width,
            this.bound.height)
    }

    destroy() {
        this.hp = 0
        this.clear()
        console.log('destroy', this.bound)
    }
}

export var Time = {
    deltaTime: 0,
    time: 0,
    timeScale: 1,
    unscaleTime: 0,
    unscaleDeltaTime: 0
};

export class WaitForSeconds {
    constructor(duration, isRepeat) {
        this.id = 0
        this.duration = duration
        this.remain = 0
        this.isRepeat = isRepeat || false
    }

    run(cb) {
        if (this.remain > 0)
            this.remain -= Time.deltaTime
        else {
            cb()
            if (this.isRepeat)
                this.remain = this.duration
        }
    }
}

export class GEngine {
    now = Date.now();
    elapsed = now - then;

    constructor(fps) {

        this.fps = 1000 / fps
        this.update()
    }

    update() {
        requestAnimationFrame(() => this.update())

        if (this.elapsed > this.fps) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (this.elapsed % this.fps);


            this.onStart && this.onStart()
            // Put your drawing code here
            this.onUpdate && this.onUpdate()
        }
    }
}

let audio_background = null
let audio_foreground = null
export class GAudio {
    constructor() {
        this.source = []

    }

    static background() {
        audio_background = document.getElementById('audio_background')

        if (!audio_background) {
            audio_background = document.createElement('audio')
            audio_background.setAttribute('id', 'audio_background')
        }

        return audio_background
    }

    static foreground() {
        audio_foreground = document.getElementById('audio_foreground')

        if (!audio_foreground) {
            audio_foreground = document.createElement('audio')
            audio_foreground.setAttribute('id', audio_foreground)
        }

        return audio_foreground
    }

    load(isBackground, file) {
        let audio = isBackground ? audio_background : audio_foreground
        audio.src = file
        audio.load()
    }

    play() {
        let audio = isBackground ? audio_background : audio_foreground
        audio.play()
    }
}