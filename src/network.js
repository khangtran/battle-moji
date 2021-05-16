import { io } from "socket.io-client"

const url = 'http://192.168.43.47:4646'

let instance;
export default class Network {
    constructor() {
        this.socket = io(url, { autoConnect: false, reconnection: false })
        this.networkid = undefined

    }

    /**
     * Access singleton Network communication
     * @returns {Network} network instance
     */
    static get instance() {
        if (!instance)
            instance = new Network()

        return instance
    }

    setupEvent(cb) {
        this.socket.on('onConnected', (msg) => {
            this.networkid = msg.playerid
            cb({ name: 'connected', data: msg })
        })

        this.socket.on('onMatched', (msg) => {
            cb({ name: 'onMatched', data: msg })

            console.log('>> matched', msg)
        })

        this.socket.on('onGameLoad', msg => {
            cb({ name: 'onGameLoad', data: msg })
        })

        this.socket.on('onGameStart', msg => {
            // this.onGameStart && this.onGameStart(msg)
        })

        this.socket.on('onGameLoad', msg => {

            console.log('gameData', msg)
        })

        this.socket.on('disconnect', msg => {
            cb({ name: 'disconnect', data: msg })
            console.log('[Network] Disconnected', msg)
        })
    }

    connect() {
        this.socket.connect()
    }

    findMatch(playerinfo) {
        this.socket.emit('create match', playerinfo)
        console.log('[network] create-matched')
    }

    cancelMatch() {
        this.socket.emit('cancelMatch')
    }

}