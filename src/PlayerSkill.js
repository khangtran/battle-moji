export default class PlayerSkill {

    constructor(name, duration, combo, target) {
        this.name = name
        /**
         * @type {Array} 
         */
        this.combo = combo
        this.coolDownDuration = duration
        this.target = target

        this.isEffect = false
        this.isCoolDown = false

    }

    active(array) {
        if (this.isCoolDown)
            return

        let isMatch = this.combo.toString() === array.toString()
        if (isMatch) {
            // do stuff
            this.isCoolDown = true

            this.target && this.target()

            setTimeout(() => {
                this.isCoolDown = false
            }, this.coolDownDuration * 1000)
        }

        return isMatch
    }
}