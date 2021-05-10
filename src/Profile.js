export default class Profile {
    constructor(name, kcoin, kgold, fbid) {
        this.name = name
        this.level = 1
        this.kcoin = kcoin
        this.kgold = kgold
        this.fbid = fbid
    }

    static loadData() {
        return new Profile('khangtran', 1000, 20, 'adasd123asdqe12fdg43')
    }

    sync_data() {

    }

    static get_data() {
        return this
    }
}