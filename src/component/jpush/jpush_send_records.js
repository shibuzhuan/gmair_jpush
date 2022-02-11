import React, { Component } from "react";
import { jpushService } from "../../service/jpush.service";
import { Image } from "react-bootstrap";
import { Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import JpushTable from "./jpush_table";

class JpushSendRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record_list: [],
      search: "",
      searchColumn: "",
      filteredInfo: null,
    };
  }

  componentWillMount() {
    jpushService.getSendRecords().then((result) => {
      this.setState({
        record_list: result,
      });
    });
  }

  getColumnSearchProps = (data) => ({
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
          placeholder={`Search ${data}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, data)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, data)}
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
                search: selectedKeys[0],
                searchColumn: data,
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
      record[data]
        ? record[data]
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
      this.state.searchColumn === data ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.search]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, data) => {
    confirm();
    this.setState({
      search: selectedKeys[0],
      searchColumn: data,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ search: "" });
  };



  render() {
    const columns = [
      {
        title: "通知标题",
        dataIndex: "notiTitle",
        key: "notiTitle",
        ...this.getColumnSearchProps("notiTitle"),
      },
      {
        title: "通知简介",
        dataIndex: "notiContent",
        key: "notiContent",
        ellipsis: true,
        ...this.getColumnSearchProps("notiContent"),
      },
      {
        title: "推送图片",
        dataIndex: "extrasPicUrl",
        key: "extrasPicUrl",
        render: (text) => {
          if (text != null) {
            return <Image src={text} rounded style={{ width: 80 }} />;
          } else {
            return <span></span>;
          }
        },
      },
      {
        title: "有效目标数",
        dataIndex: "audience",
        key: "audience",
      },
      {
        title: "Message ID",
        dataIndex: "msgId",
        key: "msgId",
        ...this.getColumnSearchProps("msgId"),
      },
      {
        title: "平台",
        dataIndex: "platform",
        key: "platform",
      },
      {
        title: "通知内容",
        dataIndex: "extrasText",
        key: "extrasText",
        ellipsis: true,
        ...this.getColumnSearchProps("extrasText"),
      },
      {
        title: "存活时间",
        dataIndex: "timeToLive",
        key: "timeToLive",
        width: 100,
      },
      {
        title: "推送状态",
        dataIndex: "isSuccess",
        key: "isSuccess",
        width: 100,
        render: (text) => {
          if (text === 1) {
            text = "成功";
          }
          if (text === 0) {
            text = "失败";
          }
          return <span>{text}</span>;
        },
      },
      {
        title: "操作",
        key: "action",
        render: (item) => {
          return (
            <Button
              type="link"
              onClick={() => {
                window.open("/jpush/sendrecords/" + item.msgId);
              }}
            >
              查看消息详情
            </Button>
          );
        },
      },
    ];
    return (
      <div>
        <JpushTable columns={columns} dataSource={this.state.record_list} scroll={{ x: 1500 }}></JpushTable>
      </div>
    );
  }
}

export default JpushSendRecords;
