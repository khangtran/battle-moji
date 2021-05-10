import React from "react";

export class ListWrap extends React.Component {
    render() {
        return <div className='wrap' style={{}}>
            {this.props.data.map(((item, index) => <div key={index} style={{ width: 100, height: 175, margin: '10px 10px 10px 0' }}>
                <img alt='hình' src={`/res/gfx/${item.img}`} style={{ width: 100, height: 100, border: 0 }} />
                <div style={{ marginLeft: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: 500, marginTop: 5 }} >{item.name}</span>
                    <span style={{ fontSize: 13 }} >{`Yêu cầu Level ${item.require}. `}</span>
                    <span style={{ fontSize: 13 }}>  {`${item.des} ${item.affect}s`}</span>
                </div>
            </div>))}
        </div>
    }
}

export class List extends React.Component {
    render() {
        return <div className='list'>
            {this.props.data.map((item, index) => this.props.render && this.props.render(item, index))}
        </div>
    }
}