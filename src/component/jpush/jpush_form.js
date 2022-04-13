import React, { Component } from "react";
import { Form, Input, Button, notification } from "antd";
import { jpushService } from "../../service/jpush.service";

class JpushForm extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.process_notificationTitle = this.process_notificationTitle.bind(this);
    this.process_notificationContent =
      this.process_notificationContent.bind(this);
    this.process_timeToLive = this.process_timeToLive.bind(this);
    this.process_content = this.process_content.bind(this);
    this.process_picurl = this.process_picurl.bind(this);
    this.clear_content = this.clear_content.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.submit1 = this.submit1.bind(this);
    this.submit2 = this.submit2.bind(this);
    this.state = {
      notiStatus: props.notiStatus,
      selectedRowKeys: props.selectedRowKeys,
      notificationTitle: "",
      notificationContent: "",
      content: "",
      timeToLive: "",
      pic_url: "",
      filled: false,
      tags_list: props.tags_list,
    };
  }

  notiMessage(result) {
    if (result === 1) {
      notification.open({
        message: "提交成功！",
      });
      this.clear_content();
    } else {
      notification.open({
        message: "提交失败！",
      });
    }
  }

  submit = () => {
    jpushService
      .sendToAll(
        this.state.notificationTitle,
        this.state.notificationContent,
        this.state.pic_url,
        this.state.content,
        this.state.timeToLive
      )
      .then((result) => {
        this.notiMessage(result);
      });
  };

  submit1 = () => {
    jpushService
      .sendByRid(
        this.state.notificationTitle,
        this.state.notificationContent,
        this.state.pic_url,
        this.state.content,
        this.state.timeToLive,
        this.state.selectedRowKeys
      )
      .then((result) => {
        this.notiMessage(result);
      });
  };

  submit2 = () => {
    jpushService
      .sendToTagsList(
        this.state.notificationTitle,
        this.state.notificationContent,
        this.state.pic_url,
        this.state.content,
        this.state.timeToLive,
        this.state.tags_list
      )
      .then((result) => {
        this.notiMessage(result);
      });
  };

  componentWillReceiveProps(props) {
    this.setState({
      selectedRowKeys:props.selectedRowKeys,
      notiStatus: props.notiStatus,
      tags_list: props.tags_list
    });
    this.clear_content();
  }

  process_notificationTitle(e) {
    this.setState({ notificationTitle: e.target.value }, this.validate);
  }

  process_notificationContent(e) {
    this.setState({ notificationContent: e.target.value }, this.validate);
  }

  process_timeToLive(e) {
    this.setState({ timeToLive: e.target.value }, this.validate);
  }

  process_content(e) {
    this.setState({ content: e.target.value });
  }

  process_picurl(e) {
    this.setState({ pic_url: e.target.value });
  }

  clear_content = () => {
    this.formRef.current.resetFields();
    this.setState({
      notificationTitle: "",
      notificationContent: "",
      timeToLive: "",
      pic_url: "",
      content: "",
      filled: false,
    });
  };

  validate = () => {
    if (
      this.state.notificationTitle !== "" &&
      this.state.notificationContent !== "" &&
      this.state.timeToLive !== ""
    ) {
      this.setState({ filled: true });
    } else {
      this.setState({ filled: false });
    }
  };

  render() {
    return (
      <div>
        <Form layout="vertical" ref={this.formRef}>
          <Form.Item
            label="通知标题（必填）"
            name="notificationTitle"
            value={this.state.notificationTitle}
            rules={[{ required: true, message: "Please input your title!" }]}
            onChange={this.process_notificationTitle}
          >
            <Input placeholder="请输入通知栏标题" />
          </Form.Item>
          <Form.Item
            label="通知内容简介（必填）"
            name="notificationContent"
            value={this.state.notificationContent}
            rules={[{ required: true, message: "Please input your content!" }]}
            onChange={this.process_notificationContent}
          >
            <Input placeholder="请输入推送内容简介" />
          </Form.Item>
          <Form.Item label="通知内容" name="content" onChange={this.process_content} value={this.state.content}>
            <Input.TextArea placeholder="请输入推送内容" />
          </Form.Item>
          <Form.Item
            label="推送时间（必填）"
            name="time"
            rules={[
              {
                required: true,
              },
              {
                type: "number",
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
              },
            ]}
            value={this.state.timeToLive}
            onChange={this.process_timeToLive}
          >
            <Input placeholder="请输入存活时间" />
          </Form.Item>
          <Form.Item label="推送图片" name="url" onChange={this.process_picurl} value={this.state.pic_url}>
            <Input placeholder="请输入图片url" />
          </Form.Item>
          <Form.Item>
            {this.state.notiStatus === "all" && (
              <Button
                type="primary"
                htmlType="submit"
                disabled={!this.state.filled}
                onClick={this.submit}
              >
                提交
              </Button>
            )}
            {this.state.notiStatus === "rid" && (
              <Button
                type="primary"
                htmlType="submit"
                disabled={!this.state.filled}
                onClick={this.submit1}
              >
                提交
              </Button>
            )}
            {this.state.notiStatus === "tag" && (
              <Button
                type="primary"
                htmlType="submit"
                disabled={!this.state.filled}
                onClick={this.submit2}
              >
                提交
              </Button>
            )}
            <Button
              htmlType="button"
              style={{ marginLeft: "10px" }}
              onClick={this.clear_content}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default JpushForm;
