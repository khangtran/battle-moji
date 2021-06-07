import React from "react";
import { UIPage, UITab } from "../Component";
import { HelperTextElement } from "../gamecore";

export default class NewsPage extends React.Component {

    componentDidMount() {
        this.requireInstallApp()
    }

    install_event

    requireInstallApp() {

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => { console.log('Service Worker Registered'); });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()

            this.install_event = e
        })

        window.addEventListener('appinstalled', () => {

            HelperTextElement('bt-install', 'Mở')
            console.log('PWA was installed');
        });
    }

    onDownloadPress() {

        this.install_event.prompt()
        this.install_event.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            this.install_event = null;
        });
        console.log('install prompt')
    }

    renderNews() {
        return <div>
            <span>Tin mới</span>

            <div>
                <span>abcd</span>
            </div>

        </div>
    }

    renderDownload() {
        return <div>
            <div className='row-tab'>
                <img src='/launcher_icon.png' style={{ width: 60, height: 60, borderRadius: 10 }} />
                <div style={{ fontSize: 15, marginLeft: 8 }}>
                    <span>Battle Syaster</span>
                    <span style={{ color: 'gray' }}>Phiên bản APLA TEST v0.1 build 17052021</span>
                    <button id='bt-install' className='' style={{ padding: '5px 10px', borderRadius: '3px', width: '30%', border: 'none', backgroundColor: 'blue', color: 'white' }} onClick={() => this.onDownloadPress()}>Cài đặt</button>
                </div>
            </div>

            <div style={{ marginTop: 8 }}>
                <span style={{ fontWeight: 600 }}>Mô tả trò chơi</span>
                <span>Trò chơi trực tuyến đối kháng</span>
                <span>• Kĩ năng đa dạng</span>
                <span>• Cách chơi mới lạ</span>
                <span>• Solo với bạn bè</span>

            </div>
        </div>
    }

    renderPulbic() {
        return <div>
            <span>Cộng đồng</span>
        </div>
    }

    renderAbout() {
        return <div>
            <span></span>
        </div>
    }

    toggle() {
        this.page.toggle()
    }

    render() {
        return <UIPage ref={c => this.page = c}  >

            <UITab style={{ margin: 8 }} tabs={[
                { name: 'Trang chủ', component: this.renderNews() },
                { name: 'Cộng đồng', component: this.renderPulbic() },
                { name: 'Tải game', component: this.renderDownload() }]} />

        </UIPage>
    }
}