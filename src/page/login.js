import React from "react";
import { UIPopup, UIPage } from "../Component";
import Network from "../network";
import NetworkInstance from "../network";
import PageManager from "../PageManager";
import Profile from "../Profile";

export default class LoginPage extends React.Component {

    componentDidMount() {

        setTimeout(() => {
            this.pop_loading.toggle()

            setTimeout(() => {
                if (!Profile.isAuthen())
                    this.pop_loading.toggle()
                else
                    PageManager.instance.setTransition('lobby')
            }, 1500)

        }, 500)
    }

    async onPressLogin() {
        this.pop_loading.toggle()

        let user = await Profile.login()
        Profile.instance.name = this.field_name.value

        // this.pop_loading.toggle()
        // localStorage.setItem('@profile', JSON.stringify(Profile.instance))
        // PageManager.instance.setTransition('lobby')
        Network.instance.connect()
    }

    toggle() {
        this.page.toggle()
    }

    render() {
        return <UIPage ref={c => this.page = c} >
            <div style={{ height: '100%', }} >

                <div style={{ width: '100%' }}>
                    <div style={{
                        alignSelf: 'center', fontSize: 50,
                        width: '55%', margin: '40% 0'
                    }} >
                        <span>Battle</span>
                        <span style={{ textAlign: 'right' }} >Moji</span>
                    </div>

                    <div style={{ alignSelf: 'center', width: '65%' }} >
                        <input ref={c => this.field_name = c} placeholder='Tên đăng nhập' />
                        <input ref={c => this.field_pass = c} placeholder='Mật khẩu' type='password' />

                        <div style={{ marginTop: 20 }} >
                            <button className='bt no-border login' style={{ color: 'white' }} onClick={() => this.onPressLogin()} >Đăng nhập</button>
                            <button className='bt signup' style={{}} >Đăng kí</button>
                        </div>
                    </div>
                </div>

                <UIPopup ref={c => this.pop_loading = c} text='Đang kết nối máy chủ' />
            </div>
        </UIPage>
    }
}