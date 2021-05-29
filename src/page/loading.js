import React from "react";
import { UIPage } from "../Component";
import PageManager from "../PageManager";
import Profile from "../Profile";

export default class LoadingPage extends React.Component {

    state = {
        data: [],
        process: 0,
    }

    setData(data) {

        this.setState({ data: data })
    }

    setProgress(value) {
        this.setData({ process: value })
    }

    toggle() {
        this.page.toggle()
    }

    render() {
        let profile = Profile.instance

        let default_profile = ['/res/profile_me.jpg', '/res/profile_vy.jpg']
        let avatar_default = '/res/avatar_default.png'

        return <UIPage ref={c => this.page = c} >
            <div style={{ backgroundColor: 'black', height: '100%' }} >

                <div className='row' style={{
                    position: 'absolute', top: '38%', fontStyle: 'oblique',
                    width: '100%', color: 'white', fontSize: 20, zIndex: 2
                }}  >
                    {
                        this.state.data.map((item, index) => <div key={index} style={{ height: 150, marginLeft: 20, marginRight: 20 }} >
                            <img src={item.name === 'vyvy' ? default_profile[1] : item.name === 'khang' ? default_profile[0] : avatar_default} style={{ width: 120, height: 120, borderRadius: '50%' }} />
                            <span style={{ textAlign: 'center', marginTop: 2, }}>{item.name}</span>
                        </div>)
                    }

                </div>

                <img src='/res/background-vs.jpg' style={{
                    position: 'absolute',
                    top: 0, left: 0, transform: 'translate(0,30%)', width: '100%', zIndex: 1
                }} />

                <div className='ui loading-blur' style={{ bottom: 26, right: 8, }} >
                    <span>🐾</span>
                </div>

                <div className='row' style={{
                    position: 'absolute', width: '100%',
                    color: 'whitesmoke', bottom: 0, fontSize: 15,
                }} >
                    <span style={{ margin: 8, }} >Đang thiết lập trận đấu</span>
                    <span style={{ margin: 8 }}  >{this.state.process}/2</span>
                </div>
            </div>
        </UIPage>
    }
}