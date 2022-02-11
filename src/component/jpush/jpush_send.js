import React, { Component } from "react";
import { Form, Input, Button, notification, Radio, Table, Modal, Space } from "antd";
import { jpushService } from "../../service/jpush.service";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class JpushSend extends Component {
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
    this.paginationChange = this.paginationChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.getFilter = this.getFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      notificationTitle: "",
      notificationContent: "",
      timeToLive: "",
      pic_url: "",
      content: "",
      filled: false,
      user_list: [],
      notificationStatus: "all",
      current_page: 1,
      page_size: 10,
      selectedRowKeys: [],
      loading: false,
      isModalVisible: false,
      searchText: "",
      searchedColumn: "",
      filter: [],
      filteredInfo: null,
    };
  }

  componentWillMount() {
    jpushService.getAllUserInfo().then((result) => {
      this.setState({
        user_list: result,
      });
      this.getFilter();
    });
  }

  setRidKey() {
    let data = this.state.user_list;
    for (let i = 0; i < data.length; i++) {
      data[i].key = data[i].rid;
    }
    this.setState({
      user_list: data,
    });
  }

  setTagKey() {
    let data = this.state.user_list;
    for (let i = 0; i < data.length; i++) {
      data[i].key = data[i].tags;
    }
    this.setState({
      user_list: data,
    });
  }

  paginationChange(e) {
    //console.log('Various parameters', pageSize, filters, sorter);
    this.setState({
      current_page: e,
      //filteredInfo: filters,
    });
  }

  handleChange({current: pageNum, pageSize}, filters, sorter) {
    this.setState({
      current_page: pageNum,
      filteredInfo: filters,
    });
  }

  pageSizeChange(current, size) {
    this.setState({
      current_page: 1,
      page_size: size,
    });
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
      });
    this.handleOk();
  };

  submit2 = () => {
    let tagsList = [];
    for (let i = 0, l = this.state.selectedRowKeys.length; i < l; i++) {
      if (tagsList.indexOf(this.state.selectedRowKeys[i]) === -1) {
        tagsList.push(this.state.selectedRowKeys[i]);
      }
    }
    jpushService
      .sendToTagsList(
        this.state.notificationTitle,
        this.state.notificationContent,
        this.state.pic_url,
        this.state.content,
        this.state.timeToLive,
        tagsList
      )
      .then((result) => {
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
      });
  };

  onRadioChange = (e) => {
    if (e.target.value === "rid") {
      this.setRidKey();
    }
    if (e.target.value === "tag") {
      this.setTagKey();
    }
    this.clear_content();
    this.setState({
      selectedRowKeys: [],
      current_page: 1,
      notificationStatus: e.target.value,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  start = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  showModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  handleOk = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getFilter(){
    let data = this.state.user_list;
    let filter = [];
    for (let i = 0, l = data.length; i < l; i++) {
      if (filter.indexOf(data[i].tags) === -1) {
        filter.push({text: data[i].tags, value: data[i].tags});
      }
    }
    this.setState({ filter: filter });
  }


  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  render() {
    //let { filteredInfo } = this.state.filteredInfo;
    this.state.filteredInfo = this.state.filteredInfo || {};
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "城市",
        dataIndex: "city",
        key: "city",
      },
      {
        title: "省份",
        dataIndex: "province",
        key: "province",
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "地址",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "用户ID",
        dataIndex: "consumerid",
        key: "consumerid",
      },
      {
        title: "别名",
        dataIndex: "alias",
        key: "alias",
      },
      {
        title: "设备ID",
        dataIndex: "rid",
        key: "rid",
        ...this.getColumnSearchProps("rid"),
      },
      {
        title: "是否访客",
        dataIndex: "isvisitor",
        key: "isvisitor",
        render: (text) => {
          if (text === 1) {
            text = "是";
          }
          if (text === 0) {
            text = "否";
          }
          return <span>{text}</span>;
        },
      },
      {
        title: "平台",
        dataIndex: "platform",
        key: "platform",
      },
      {
        title: "标签",
        dataIndex: "tags",
        key: "tags",
        filters: this.state.filter,
        filteredValue: this.state.filteredInfo.tags || null,
        onFilter: (value, record) => record.tags === value,
        ellipsis: true,
      },
    ];

    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onRadioChange}
          style={{ marginBottom: "20px" }}
        >
          <Radio.Button value="all">广播推送</Radio.Button>
          <Radio.Button value="rid">指定设备id推送</Radio.Button>
          <Radio.Button value="tag">指定同一标签的用户推送</Radio.Button>
        </Radio.Group>
        {this.state.notificationStatus === "all" && (
          <Form layout="vertical">
            <Form.Item
              label="通知标题（必填）"
              name="notificationTitle"
              rules={[{ required: true, message: "Please input your title!" }]}
              value={this.state.notificationTitle}
              onChange={this.process_notificationTitle}
            >
              <Input
                placeholder="请输入通知栏标题"
                value={this.state.notificationTitle}
              />
            </Form.Item>
            <Form.Item
              label="通知内容简介（必填）"
              name="notificationContent"
              rules={[
                { required: true, message: "Please input your content!" },
              ]}
              value={this.state.notificationContent}
              onChange={this.process_notificationContent}
            >
              <Input
                placeholder="请输入推送内容简介"
                value={this.state.notificationContent}
              />
            </Form.Item>
            <Form.Item
              label="通知内容"
              value={this.state.content}
              onChange={this.process_content}
            >
              <Input.TextArea
                placeholder="请输入推送内容"
                value={this.state.content}
              />
            </Form.Item>
            <Form.Item
              label="推送时间（必填）"
              name="time"
              rules={[
                {
                  required: true,
                  message: "Please input a number!",
                  type: "number",
                },
              ]}
              value={this.state.timeToLive}
              onChange={this.process_timeToLive}
            >
              <Input
                placeholder="请输入存活时间"
                value={this.state.timeToLive}
              />
            </Form.Item>
            <Form.Item
              label="推送图片"
              value={this.state.pic_url}
              onChange={this.process_picurl}
            >
              <Input placeholder="请输入图片url" value={this.state.pic_url} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!this.state.filled}
                onClick={this.submit}
              >
                提交
              </Button>
              <Button
                htmlType="button"
                style={{ marginLeft: "10px" }}
                onClick={this.clear_content}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
        )}
        {this.state.notificationStatus === "rid" &&
          this.state.user_list.length > 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  onClick={this.start}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Reload
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected
                    ? `Selected ${selectedRowKeys.length} items`
                    : ""}
                </span>
                <Button
                  style={{ float: "right" }}
                  type="primary"
                  onClick={this.showModal}
                  disabled={!hasSelected}
                >
                  完成选择
                </Button>
              </div>
              <Modal
                title="指定设备id推送"
                visible={this.state.isModalVisible}
                onOk={this.submit1}
                onCancel={this.handleCancel}
                // okText="提交"
                // cancelText="取消"
                footer={[
                  <Button
                    key="cancel"
                    htmlType="button"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handleCancel}
                  >
                    取消
                  </Button>,
                  <Button
                    key="reset"
                    htmlType="button"
                    style={{ marginLeft: "10px" }}
                    onClick={this.clear_content}
                  >
                    重置
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    disabled={!this.state.filled}
                    onClick={this.submit1}
                  >
                    提交
                  </Button>,
                ]}
                okButtonProps={{ disabled: !this.state.filled }}
              >
                <Form layout="vertical">
                  <Form.Item
                    label="通知标题（必填）"
                    name="notificationTitle"
                    rules={[
                      { required: true, message: "Please input your title!" },
                    ]}
                    value={this.state.notificationTitle}
                    onChange={this.process_notificationTitle}
                  >
                    <Input
                      placeholder="请输入通知栏标题"
                      value={this.state.notificationTitle}
                    />
                  </Form.Item>
                  <Form.Item
                    label="通知内容简介（必填）"
                    name="notificationContent"
                    rules={[
                      { required: true, message: "Please input your content!" },
                    ]}
                    value={this.state.notificationContent}
                    onChange={this.process_notificationContent}
                  >
                    <Input
                      placeholder="请输入推送内容简介"
                      value={this.state.notificationContent}
                    />
                  </Form.Item>
                  <Form.Item
                    label="通知内容"
                    value={this.state.content}
                    onChange={this.process_content}
                  >
                    <Input.TextArea
                      placeholder="请输入推送内容"
                      value={this.state.content}
                    />
                  </Form.Item>
                  <Form.Item
                    label="推送时间（必填）"
                    name="time"
                    rules={[
                      {
                        required: true,
                        message: "Please input a number!",
                        type: "number",
                      },
                    ]}
                    value={this.state.timeToLive}
                    onChange={this.process_timeToLive}
                  >
                    <Input
                      placeholder="请输入存活时间"
                      value={this.state.timeToLive}
                    />
                  </Form.Item>
                  <Form.Item
                    label="推送图片"
                    value={this.state.pic_url}
                    onChange={this.process_picurl}
                  >
                    <Input
                      placeholder="请输入图片url"
                      value={this.state.pic_url}
                    />
                  </Form.Item>
                </Form>
              </Modal>
              <Table
                rowSelection={rowSelection}
                dataSource={this.state.user_list}
                columns={columns}
                pagination={{
                  showQuickJumper: true,
                  total: this.state.total,
                  showSizeChanger: true,
                  onChange: this.paginationChange,
                  onShowSizeChange: this.pageSizeChange,
                  current: this.state.current_page,
                }}
                onChange={this.handleChange}
              />
            </div>
          )}
        {this.state.notificationStatus === "tag" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={this.start}
                disabled={!hasSelected}
                loading={loading}
              >
                Reload
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
              </span>
              <Button
                style={{ float: "right" }}
                type="primary"
                onClick={this.showModal}
                disabled={!hasSelected}
              >
                完成选择
              </Button>
            </div>
            <Modal
              closable="false"
              title="指定同一标签的用户推送"
              visible={this.state.isModalVisible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button
                  key="cancel"
                  htmlType="button"
                  style={{ marginLeft: "10px" }}
                  onClick={this.handleCancel}
                >
                  取消
                </Button>,
                <Button
                  key="reset"
                  htmlType="button"
                  style={{ marginLeft: "10px" }}
                  onClick={this.clear_content}
                >
                  重置
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  disabled={!this.state.filled}
                  onClick={this.submit1}
                >
                  提交
                </Button>,
              ]}
            >
              <Form layout="vertical">
                <Form.Item
                  label="通知标题（必填）"
                  title="notificationTitle"
                  rules={[
                    { required: true, message: "Please input your title!" },
                  ]}
                  value={this.state.notificationTitle}
                  onChange={this.process_notificationTitle}
                >
                  <Input
                    placeholder="请输入通知栏标题"
                    value={this.state.notificationTitle}
                  />
                </Form.Item>
                <Form.Item
                  label="通知内容简介（必填）"
                  name="notificationContent"
                  rules={[
                    { required: true, message: "Please input your content!" },
                  ]}
                  value={this.state.notificationContent}
                  onChange={this.process_notificationContent}
                >
                  <Input
                    placeholder="请输入推送内容简介"
                    value={this.state.notificationContent}
                  />
                </Form.Item>
                <Form.Item
                  label="通知内容"
                  value={this.state.content}
                  onChange={this.process_content}
                >
                  <Input.TextArea
                    placeholder="请输入推送内容"
                    value={this.state.content}
                  />
                </Form.Item>
                <Form.Item
                  label="推送时间（必填）"
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: "Please input your time!",
                      type: "number",
                    },
                  ]}
                  value={this.state.timeToLive}
                  onChange={this.process_timeToLive}
                >
                  <Input
                    placeholder="请输入存活时间"
                    value={this.state.timeToLive}
                  />
                </Form.Item>
                <Form.Item
                  label="推送图片"
                  value={this.state.pic_url}
                  onChange={this.process_picurl}
                >
                  <Input
                    placeholder="请输入图片url"
                    value={this.state.pic_url}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Table
              rowSelection={rowSelection}
              dataSource={this.state.user_list}
              columns={columns}
              pagination={{
                showQuickJumper: true,
                total: this.state.total,
                showSizeChanger: true,
                onChange: this.paginationChange,
                onShowSizeChange: this.pageSizeChange,
                currenst: this.state.current_page,
              }}
              onChange={this.handleChange}
            />
            <div>同一标签选择一名用户即可</div>
          </div>
        )}
      </div>
    );
  }
}

export default JpushSend;
