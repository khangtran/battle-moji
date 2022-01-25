import React, { createContext } from "react";
import SocialLogin from "react-social-login";
import SocialButton, { UIPopupText, UIPage } from "../Component";
import Network from "../network";
import NetworkInstance from "../network";
import PageManager from "../PageManager";
import Profile from "../Profile";

export default class LoginPage extends React.Component {

    componentDidMount() {

        let agent = navigator.userAgent
        console.log('userAgent', agent)
        if (agent.search('iPhone') === -1 && agent.search('Android') === -1) {
            this.createElementDontSupport()
            return
        }

        setTimeout(() => {
            if (!this.page.state.isShow)
                return

            this.pop_loading.toggle()

            setTimeout(() => {
                if (!Profile.isAuthen())
                    this.pop_loading.toggle()
                else
                    PageManager.instance.setTransition('lobby')
            }, 1500)

        }, 1000)
    }

    createElementDontSupport() {
        let root = document.getElementById('root')
        root.removeChild(root.childNodes[0])

        let span = document.createElement('span')

        span.style.textAlign = 'center'
        span.style.marginTop = '10%'
        span.style.fontSize = 30
        span.innerHTML = 'Syaster'

        let span2 = document.createElement('span')
        span2.style.textAlign = 'center'
        span2.style.marginTop = '10px'
        span2.style.fontSize = 20
        span2.style.color = 'gray'
        span2.innerHTML = 'Lỗi hỗ trợ! <br>Phiên bản hiện tại không hỗ trợ máy tính.'

        root.appendChild(span)
        root.appendChild(span2)
    }

    async onPressLogin() {
        this.pop_loading.toggle()

        let user = await Profile.login()
        Profile.instance.name = this.field_name.value

        // this.pop_loading.toggle()
        // localStorage.setItem('@profile', JSON.stringify(Profile.instance))
        // PageManager.instance.setTransition('lobby')
        Network.Client.connect()

        // let playFullscreen = confirm('Bạn muốn chơi toàn màn hình ?')
        // if (playFullscreen) {
        //     let root = document.getElementById('root')
        //     root.requestFullscreen()
        // }
    }

    toggle() {
        this.page.toggle()
    }

    onLoginFBSuccess(user) {
        console.log('fb_login', user)
        let { profilePicURL, id, name, } = user._profile
        Profile.instance.avatar = profilePicURL
        Profile.instance.fbid = id
        Profile.instance.name = name
        Profile.instance.token = user._token

        PageManager.instance.setTransition('lobby')
    }

    onLoginFBFailure(error) {
        console.log('fb_error', error)
    }

    render() {
        return <UIPage ref={c => this.page = c} >
            <div style={{ height: '100%', justifyContent: 'space-evenly' }} >

                <div style={{
                    alignSelf: 'center', fontSize: 50,
                    width: '55%',
                }} >
                    <span>Battle</span>
                    <span style={{ textAlign: 'right' }} >Syaster</span>
                </div>

                <div style={{ alignSelf: 'center', width: '65%', marginBottom: '10%' }} >

                    <span style={{ fontSize: 18 }} >Đăng nhập <span style={{ color: '#00a8b1' }} >Battle Syaster </span> qua</span>

                    <div style={{ justifyContent: 'space-between', height: 200, marginTop: 20 }} >
                        <div>
                            <div className='row' style={{ justifyContent: 'center' }} >
                                <input ref={c => this.field_name = c} placeholder='Tên người chơi' type='text' autoCapitalize='none' />
                                {/* <input ref={c => this.field_pass = c} placeholder='Mật khẩu' type='password' /> */}
                                <div>
                                    <button className='bt no-border bt-customer-login' style={{ height: 42 }} onClick={() => this.onPressLogin()} >Khách</button>
                                </div>
                            </div>
                            <span style={{ fontSize: 13, marginTop: 8 }}>* Tùy chọn này không sao lưu tiến trình chơi</span>
                        </div>

                        <div>
                            <span style={{ textAlign: 'center' }}>Hoặc</span>
                        </div>

                        <div style={{}} >
                            <SocialButton className='bt no-border bt-fb-login'
                                provider='facebook'
                                appId='127781681311362'
                                onLoginSuccess={user => this.onLoginFBSuccess(user)}
                                onLoginFailure={err => this.onLoginFBFailure(err)} >
                                Facebook
                            </SocialButton>
                        </div>
                    </div>


                    <div className='ui' style={{ bottom: 8, right: 8 }}>
                        <span style={{ color: 'gray', fontSize: 12 }}>APLA TEST v0.1 build 17052021</span>
                    </div>
                </div>

                <UIPopupText ref={c => this.pop_loading = c} text='Đang kết nối máy chủ' />
            </div>
        </UIPage>
    }
}