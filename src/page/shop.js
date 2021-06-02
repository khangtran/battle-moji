import React from "react";
import { ListWrap, UIPage } from "../Component";

export default class ShopPage extends UIPage {
    render() {
        return <React.Fragment>

            {/* <span>Bộ kĩ năng</span>
                    <ListWrap data={list_skill} render={(item, index) => <div key={index} style={{ width: 100, height: 125, margin: '8px 10px 10px 0' }}>
                        <img alt='hình' src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100, border: 0 }} />
                        <div style={{ marginLeft: 1 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, marginTop: 5 }} >{item.name}</span>
                        </div>
                    </div>} />

                    <span>Sưu tầm</span>
                    <List data={list_skill} render={(item, index) => <div key={index} style={{ marginTop: 8, }}>
                        <div style={{ flexDirection: "row" }}>
                            <img src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100 }} />
                            <div style={{ marginLeft: 5 }}>
                                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                                <span style={{ fontSize: 13 }}> {`Yêu cầu Level ${item.require}. `}</span>
                                <span style={{ fontSize: 13 }}> {`${item.des} ${item.affect}s`}</span>
                            </div>
                        </div>
                    </div>} /> */}
        </React.Fragment>
    }
}