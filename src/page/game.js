import React from "react";
import { UIPage } from "../Component";
import GameCoreInstance, { HelperTextElement } from "../gamecore";
import { Time } from "../GameScript";
import Network from "../network";
import PageManager from "../PageManager";
import PlayerSkill from "../PlayerSkill";

let url_data = '/res/data_skill.json'

export default class GamePage extends React.Component {

    isFirstLoad = false

    /**
     * @type {PlayerSkill} Current active skill
     */
    skill = null

    /** 
     * @type {Array<PlayerSkill>} list skill
     */
    listSkill = []

    state = {
        listSkill: [],
        shop: []
    }

    isCastSkill = false
    castTime = 3000
    async componentDidMount() {

        let data = await Network.http.loadFile(url_data)
        let res = data.res
        let list = [res[0], res[3], res[2]]

        GameCoreInstance.onEndGameDelegate = () => {
            PageManager.instance.setTransition('result')
                .setData(this.gamedata)
        }

        // /** 
        //  * @type {Array<PlayerSkill>} list skill
        //  */
        this.listSkill = this.createSkill(list)
        console.log('create skill', this.listSkill)
        this.combo = []

        GameCoreInstance.onActiveSkillDelegate = (result) => {

            if (this.skill && result.percent > 70) {

                this.combo.push(result.key)
            }

            if (this.isCastSkill) {
                let isCast = this.skill.active(this.combo)
                if (isCast) {
                    console.log('>> true magic')
                    this.combo = []
                }
            }
        }

        this.setState({ listSkill: list, shop: res })

    }

    async prepareBoard(data) {

        await GameCoreInstance.prepare(data)
    }

    createSkill(data) {
        let list = []

        let freezeSkill = new PlayerSkill(data[0].name, data[0].duration, data[0].combo, () => {
            setTimeout(() => {
                Time.timeScale = 0
            }, data[0].effect * 1000)

            Time.timeScale = 1
        })
        list.push(freezeSkill)

        return list
    }

    toggle() {
        this.page.toggle()

        setTimeout(() => {
            if (!this.page.state.isShow) return

            let time = 3
            let id;
            id = setInterval(() => {
                time -= 1
                HelperTextElement('lb-ctime', `${time}s`)

                if (time === 0) {
                    HelperTextElement('lb-ctime', ``)
                    HelperTextElement('lb-popup', ``)
                    clearInterval(id)
                }
            }, 1000)
        }, 50)


        // set init here
        setTimeout(() => {
            if (!this.page.state.isShow) return

            // let { players } = GameCoreInstance.matchInfo
            let players = [{ name: 'player1' }, { name: 'player2' }]
            HelperTextElement('lb-name', players[0].name)
            HelperTextElement('lb-name p2', players[1].name)

        }, 1000)

        setTimeout(async () => {
            if (this.page.state.isShow) {
                if (!this.isFirstLoad) {
                    GameCoreInstance.setup_canvas();
                    this.isFirstLoad = true
                }

                let _gameData = { symbols: [[">"], ["^"], ["v", ">"]] }
                await this.prepareBoard(_gameData)
                GameCoreInstance.startGame()
            }
        }, 4000)
    }

    get gamedata() {
        return GameCoreInstance.gamedata
    }

    toggleShop() {
        let id_atrribute = 'open-shop'
        if (this.shopView.getAttribute('id') === 'open-shop')
            id_atrribute = 'close-shop'

        this.shopView.setAttribute('id', id_atrribute)
    }

    onActiveSkill(index) {
        if (this.skill) return
        this.isCastSkill = true

        this.skill = this.listSkill[index]
        setTimeout(() => {
            console.log('>> Close cast skill', this.skill.name)

            this.skill = null
            this.isCastSkill = false
            this.combo = []
        }, this.castTime)
        console.log('>> Open cast skill', this.skill.name)
    }

    render() {
        return <UIPage ref={c => this.page = c} >
            <div id="ui-game" style={{ backgroundImage: '' }} >
                <canvas id="canvas" />

                <div className='ui wave'>
                    <div style={{ width: 200, height: 4, border: '1px solid lightgray' }}>
                        <div id='progress' style={{ height: 2, margin: 1, }} />
                    </div>
                </div>

                <div className="ui score">
                    <span id='lb-name'>[Tên người chơi]</span>
                    <div className='row' style={{ justifyContent: 'flex-start', alignItems: 'baseline', marginTop: 10, }}  >
                        <span id="lb-score" style={{}} >0</span>
                        <span style={{ fontSize: 13, marginLeft: 5 }}>điểm</span>
                    </div>

                    <div id='combo' className='row --score' >
                        <span id="lb-mutil" style={{}} />
                        <span style={{ fontSize: 20, marginLeft: 5 }}>hit</span>

                    </div>
                </div>

                <div className='ui score-p2' style={{ textAlign: "right" }}>
                    <span id='lb-name p2'>[Tên đối thủ]</span>
                    <div className='row' style={{ justifyContent: 'flex-end', alignItems: 'baseline', marginTop: 10, }}>
                        <span id="lb-score p2" style={{ marginTop: 5 }} >0</span>
                        <span style={{ fontSize: 13, marginLeft: 5 }}>điểm</span>
                    </div>
                    <div className='row --score' style={{ justifyContent: 'flex-end', }} >
                        <span style={{ fontSize: 20, marginLeft: 5 }}>hit</span>
                        <span id="lb-mutil p2" />
                    </div>
                </div>

                <div className='ui popup' style={{ alignSelf: 'center' }} >
                    <span id='lb-popup' style={{ fontSize: 22, textAlign: 'center' }}>Sẵn sàng</span>
                    <span id='lb-ctime' style={{ fontSize: 50, textAlign: 'center', color: '#1890ff' }}>3s</span>
                </div>

                <div className="ui fps">
                    <span id="lb-fps">fps: </span>
                </div>

                <div className="ui time">
                    <span id="lb-time">00:00</span>
                </div>

                <div className="ui detect">
                    <span id="lb-detect">Nhận dạng</span>
                </div>

                <div className='ui shop' style={{ height: '50%', fontSize: 13, justifyContent: 'space-between' }} >

                    <div style={{}} >
                        {
                            this.state.listSkill.map((item, index) => <div key={index} style={{
                                border: '2px solid lighgray', borderRadius: '50%',
                                width: 40, height: 40, margin: '8px 0'
                            }} onClick={() => this.onActiveSkill(index)} >
                                <img alt='hình' src={`/res/gfx/${item.icon}`} style={{ border: '2px solid cornflowerblue', borderRadius: '50%' }} />
                            </div>)
                        }
                    </div>

                    <div style={{ marginTop: 55 }} >

                        <div className='row' style={{}} >

                            <div style={{ marginRight: 16, height: 40 }} onClick={() => this.toggleShop()} >
                                <img src='/res/gfx/ic_shop.png' style={{ width: 40, height: 40, border: '2px solid green', }} />
                                <span style={{ marginTop: 8, textAlign: 'center', fontSize: 14 }}>Cửa hàng</span>
                            </div>

                            <div id='close-shop' ref={c => this.shopView = c} >
                                <div style={{ backgroundColor: 'whitesmoke', border: '5px solid gray', overflowX: "scroll" }}>

                                    <div className='' style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', margin: 8 }} >
                                        {
                                            this.state.shop.map((item, index) => <div key={index} style={{
                                                border: '2px solid lighgray', borderRadius: '50%',
                                                margin: '0px 16px 16px 0px'
                                            }} >
                                                <img alt='hình' src={`/res/gfx/${item.icon}`} style={{ width: 60, height: 60, border: '2px solid lightgray' }} />
                                                <div>
                                                    <span style={{ fontWeight: 'bold' }} >{item.name}</span>
                                                </div>
                                                <span style={{}}>{item.intro}</span>
                                                <span style={{ fontWeight: 'bold' }}>{item.cost.toLocaleString()}</span>
                                            </div>)
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UIPage >
    }
}