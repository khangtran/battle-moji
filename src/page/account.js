import React from "react";
import { UIPage } from "../Component";
import Profile from "../Profile";

export default class AccountPage extends React.Component {

    toggle() {
        this.page.toggle()
    }

    render() {
        return <UIPage ref={c => this.page = c}>
            <div className='box'>

                <img src={Profile.instance.avatar} style={{ width: 120, height: 120, borderRadius: '50%' }} />

                <div className='row-tab'>
                    <span>Tên người chơi</span>
                    <span style={{ marginLeft: 8 }} >{Profile.instance.name}</span>
                </div>
                <div className='row-tab'>
                    <span>Cấp</span>
                    <span style={{ marginLeft: 8 }}>{Profile.instance.level.level}</span>
                </div>
                <div className='row' style={{ border: '1px solid lightgray', backgroundColor: 'skyblue' }}>
                    <span style={{ margin: 8, color: 'white' }}>Liên kết FB</span>
                </div>
            </div>
        </UIPage>
    }
}