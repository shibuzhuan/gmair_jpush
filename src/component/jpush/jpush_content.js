import React from 'react'
import {Layout, Breadcrumb} from 'antd'
import {Route} from 'react-router-dom'

import JpushUserInfo from './jpush_userinfo';
import JpushSend from './jpush_send';
import JpushSendRecords from './jpush_send_records';
import Sidebar from "../sidebar/sidebar";
import GmairHeader from "../header/GmairHeader";
import RecordsItem from './records_item';

const {Content} = Layout

class JpushContent extends React.Component {
    render() {
        return (
            <div>
                <GmairHeader/>
                <Layout>
                    <Sidebar/>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>极光推送</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 480}}>
                            <div className="page">
                                <Route path='/jpush'></Route>
                                <div className="page-content">
                                    <div className="container-fluid">
                                        <Route exat path='/jpush'></Route>
                                        <Route path="/jpush/userinfo" render={() => (<JpushUserInfo/>)}/>
                                        <Route path="/jpush/send" render={() => (<JpushSend/>)}/>
                                        <Route exact path="/jpush/sendrecords" render={() => (<JpushSendRecords/>)}/>
                                        <Route path="/jpush/sendrecords/:messageId" component={RecordsItem}/>
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default JpushContent