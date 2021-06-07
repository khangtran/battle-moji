import { io } from "socket.io-client"

const url = 'http://192.168.43.47:4000'
// const url = 'http://nameless-shelf-95293.herokuapp.com'

let instance;
let netspeed;
export default class Network {
    constructor() {
        this.connection = io(url, { autoConnect: false, reconnection: false, })
        this.networkid = undefined
        this.isConnected = false
    }

    /**
     * Access singleton Network communication
     * @returns {Network} network instance
     */
    static get Client() {
        if (!instance)
            instance = new Network()

        return instance
    }

    static http = {
        async get(path) {
            console.log("[http] get", path);
            let response = await fetch(path);
            let result = await response.json();
            return result;
        },

        ping() {
            setInterval(() => {
                Network.Client.connection.volatile.emit("ping", () => {
                    const latency = Date.now() - start;
                });
            }, 5000)
        }
    }

    setNetSpeed(v) {
        netspeed = v
    }

    get netSpeed() {
        return netspeed
    }

    setupEvent(cb) {
        this.connection.on('onConnected', (msg) => {
            this.networkid = msg.playerid
            this.isConnected = true
            cb({ name: 'connected', data: msg })
        })

        this.connection.on('onMatched', (msg) => {
            cb({ name: 'onMatched', data: msg })
        })

        this.connection.on('onGameLoad', msg => {
            cb({ name: 'onGameLoad', data: msg })
        })

        this.connection.on('onGameStart', msg => {
            cb({ name: 'onGameStart' })
        })

        this.connection.on('onGameSync', msg => {
            cb({ name: 'onGameSync', data: msg })
        })

        this.connection.on('disconnect', msg => {
            cb({ name: 'disconnect', data: msg })
        })

        this.connection.on('onReceiveMsg', msg => {
            cb({ name: 'onReceiveMsg', data: msg })
        })
    }

    connect() {
        this.connection.connect()
    }

    CmdSendMessage(msg) {
        this.connection.emit('send-msg', msg)
        console.log('[network] send-msg')
    }

    CmdFindMatch(playerinfo) {
        this.connection.emit('create match', playerinfo)
        console.log('[network] find-matched')
    }

    CmdCancelMatch() {
        this.connection.emit('cancel match')
        console.log('[network] cancel-matched')
    }

    CmdReady(matchid) {
        this.connection.emit('ready', { matchid: matchid, playerid: this.networkid })
        console.log('[network] ready')
    }

    CmdSync(data) {
        this.connection.emit('gameSync', data)
        console.log('[network] match-sync')
    }

    CmdGameEnd(matchid) {
        this.connection.emit('gameEnd', { matchid: matchid, playerid: this.networkid })
        console.log('[network] game-end')
    }
}