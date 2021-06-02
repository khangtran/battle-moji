import { io } from "socket.io-client"

const url = 'http://192.168.43.47:4646'

let instance;
export default class Network {
    constructor() {
        this.socket = io(url, { autoConnect: false, reconnection: false })
        this.networkid = undefined
        this.isConnected = false
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

    static http = {
        async loadFile(path) {
            console.log(">> loadfile", path);
            let response = await fetch(path);
            let result = await response.json();
            return result;
        }
    }

    setupEvent(cb) {
        this.socket.on('onConnected', (msg) => {
            this.networkid = msg.playerid
            this.isConnected = true
            cb({ name: 'connected', data: msg })
        })

        this.socket.on('onMatched', (msg) => {
            cb({ name: 'onMatched', data: msg })
        })

        this.socket.on('onGameLoad', msg => {
            cb({ name: 'onGameLoad', data: msg })
        })

        this.socket.on('onGameStart', msg => {
            cb({ name: 'onGameStart' })
        })

        this.socket.on('onGameSync', msg => {
            cb({ name: 'onGameSync', data: msg })
        })

        this.socket.on('disconnect', msg => {
            cb({ name: 'disconnect', data: msg })
        })

        this.socket.on('onReceiveMsg', msg => {
            cb({ name: 'onReceiveMsg', data: msg })
        })
    }

    connect() {
        this.socket.connect()
    }

    CmdSendMessage(msg) {
        this.socket.emit('send-msg', msg)
        console.log('[network] send-msg')
    }

    CmdFindMatch(playerinfo) {
        this.socket.emit('create match', playerinfo)
        console.log('[network] find-matched')
    }

    CmdCancelMatch() {
        this.socket.emit('cancel match')
        console.log('[network] cancel-matched')
    }

    CmdReady(matchid) {
        this.socket.emit('ready', { matchid: matchid, playerid: this.networkid })
        console.log('[network] ready')
    }

    CmdSync(data) {
        this.socket.emit('gameSync', data)
        console.log('[network] match-sync')
    }

    CmdGameEnd(matchid) {
        this.socket.emit('gameEnd', { matchid: matchid, playerid: this.networkid })
        console.log('[network] game-end')
    }
}