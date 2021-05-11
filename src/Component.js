import React from "react";

export class ListWrap extends React.Component {
    render() {
        return <div className='wrap' style={{}}>
            {this.props.data.map(((item, index) => this.props.render && this.props.render(item, index)))}
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