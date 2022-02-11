import React from 'react';
import {Menu, Layout} from 'antd';
import './ant_mydefine.css'

const {Header} = Layout

class GmairHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            current: 'none',
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
        if (e.key === "http://www.gmair.net" || e.key === "https://mall.jd.com/index-748610.html") {
            const w = window.open('about:blank');
            w.location.href = '' + e.key

        } else {
            window.location.href = '' + e.key
        }
    }

    render() {
        return <div className="header" style={{height:`64px`}}>
            <div className="logo"></div>
            <Menu theme="dark" mode="horizontal" style={{lineHeight: '64px'}}>
                <Menu.Item>果麦新风</Menu.Item>
                <Menu.Item key="http://www.gmair.net" onClick={this.handleClick}>官网</Menu.Item>
                <Menu.Item key="https://mall.jd.com/index-748610.html" onClick={this.handleClick}>商城</Menu.Item>
            </Menu>
        </div>
    }
}

export default GmairHeader