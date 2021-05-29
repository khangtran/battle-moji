
let instance;

class UserLevel {
    constructor() {
        this.level = 1
        this.exp = 0
        this.next = 100
    }

    setLevelUp(increase) {
        this.level += 1
        this.exp = 0
        this.next += Math.floor(this.next / 3) + this.level * increase
    }

    // exp = 150
    // next = 100
    // 
    process(exp) {
        if (this.exp >= this.next) {

            let exp = this.exp - this.next
            this.setLevelUp(10)
            this.exp = exp
            this.process(this.exp)
        }

        this.exp += exp
    }
}
export default class Profile {
    constructor(name, kcoin, kgold, fbid) {
        this.name = name
        this.level = new UserLevel()
        this.kcoin = kcoin || 0
        this.kgold = kgold || 0
        this.fbid = fbid
        this.avatar = '/res/profile_me.jpg'
        this.token = '1234'
    }

    /**
     * Access Profile singleton
     * @returns {Profile} instance
     */
    static get instance() {
        if (!instance) {
            console.warn('Profile dont loaded')
            return instance = new Profile()
        }
        return instance
    }

    /**
     * Get information profile user
     * @returns {Promise<Profile>} Profile 
     */
    static async login() {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let data = new Profile('khangtran', 1000, 20, 'adasd123asdqe12fdg43')
                instance = data
                resolve(data)
            }, 2500)
        })
    }

    static isAuthen() {
        let localData = localStorage.getItem('@profile')

        if (localData)
            instance = JSON.parse(localData)
        else
            return false

        return true
    }

    static create(name, fbid) {

    }

    static sync_profile() {

    }
}