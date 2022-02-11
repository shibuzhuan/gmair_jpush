import React from 'react';
import { Menu, Layout } from 'antd'

const { SubMenu } = Menu;
const { Sider } = Layout;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            collapsed: false,
            defaultOpenKeys: []
        }
        this.handleClick = this.handleClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        if (this.props.current !== undefined) {
            this.setState({
                current: this.props.current,
            })
        }
        if (this.props.defaultOpenKeys !== undefined) {
            this.setState({
                defaultOpenKeys: this.props.defaultOpenKeys
            })
        }
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
        window.location.href = '' + e.key
    }

    render() {
        return <Sider collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.toggle}
            width={200}
            theme="light"
            style={{ background: '#fff' }}>
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="inline"
                style={{ height: '100%', borderRight: 0 }}
                defaultOpenKeys={this.state.defaultOpenKeys}
            >
                <SubMenu key="sub4" title={<span>极光推送</span>}>
                <Menu.Item key="/jpush/userinfo">
                    <span>用户信息</span>
                </Menu.Item>
                <Menu.Item key="/jpush/send">
                    <span>创建推送</span>
                </Menu.Item>
                <Menu.Item key="/jpush/sendrecords">
                    <span>推送记录</span>
                </Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    }
}

export default Sidebar
