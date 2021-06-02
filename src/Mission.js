export class Mission {
    constructor(name, des, target) {
        this.name = name
        this.des = des
        this.target = target
        this.current = 0
    }

    toString() {
        return `(${this.current}/${this.target}) ${this.des}`
    }
}