var instance = null
export default class PageManager {

    constructor() {
        this.list = []
        this.transition = []
        this._current = 0
    }

    /**
     * Access PageManager singleton
     * @returns {PageManager} instance
     */
    static get instance() {
        if (!instance)
            instance = new PageManager()

        return instance
    }

    addPage(name, ref, isDefault) {
        if (isDefault)
            ref.toggle()
            
        this.list.push({ name: name, ref: ref, default: isDefault || false })
    }

    get current() {
        return this.list[this._current]
    }

    addTransition(from, to) {
        this.transition.push({ from: from, to: to })
    }

    setTransition(to) {

        let cur = this.current

        let pageToIndex = this.list.findIndex(item => item.name === to)
        let index = this.transition.findIndex((item, index) =>
            item.from === cur.name && item.to === to)
        if (index === -1)
            console.warn('Not found mapping transition: ', cur.name, to)
        else {
            cur.ref.toggle()
            this.list[pageToIndex].ref.toggle()

            this._current = pageToIndex
        }

        console.log('transition', to)
        return this.list[pageToIndex].ref
    }
}