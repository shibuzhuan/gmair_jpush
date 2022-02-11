import React, { Component } from "react";
import { jpushService } from "../../service/jpush.service";
import { Descriptions } from "antd";

export class RecordsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageId: "",
      timeToLive: 0,
      androidReceived: 0,
      iosReceived: 0,
      androidClicked: 1,
      pushTime: "",
      iosClicked: 0,
    };
  }

  componentDidMount() {
    let messageId = this.props.match.params.messageId;
    this.setState({
      messageId: messageId,
    });
    this.getRecordsItem(messageId);
  }

  getRecordsItem(messageId) {
    jpushService.getReceivedInfo(messageId).then((response) => {
      if (response.responseCode !== "RESPONSE_ERROR") {
        this.setState({
          timeToLive: response.timeToLive,
          androidReceived: response.androidReceived,
          iosReceived: response.iosReceived,
          androidClicked: response.androidClicked,
          pushTime: response.pushTime,
          iosClicked: response.iosClicked,
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Descriptions title="消息详情" bordered>
          <Descriptions.Item label="消息ID" span={2}>
            {this.state.messageId}
          </Descriptions.Item>
          <Descriptions.Item label="存活时间">
            {this.state.timeToLive}
          </Descriptions.Item>
          <Descriptions.Item label="安卓接收数">
            {this.state.androidReceived}
          </Descriptions.Item>
          <Descriptions.Item label="IOS接收数">
            {this.state.iosReceived}
          </Descriptions.Item>
          <Descriptions.Item label="安卓点击数">
            {this.state.androidClicked}
          </Descriptions.Item>
          <Descriptions.Item label="IOS点击数">
            {this.state.iosClicked}
          </Descriptions.Item>
          <Descriptions.Item label="推送时间" span={3}>
            {this.state.pushTime}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default RecordsItem;
