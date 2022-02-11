import React, { Component } from "react";
import { jpushService } from "../../service/jpush.service";
import { Image } from "react-bootstrap";
import { Table, Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

class JpushSendRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record_list: [],
      current_page: 1,
      page_size: 10,
      searchText: "",
      searchedColumn: "",
      filteredInfo: null,
    };
    this.paginationChange = this.paginationChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
  }

  componentWillMount() {
    jpushService.getSendRecords().then((result) => {
      this.setState({
        record_list: result,
      });
    });
  }

  paginationChange(e) {
    this.setState({
      current_page: e,
    });
    //this.obtain_list(this.state.search, e, this.state.page_size,this.state.sort);
  }

  pageSizeChange(current, size) {
    this.setState({
      current_page: 1,
      page_size: size,
    });
    //this.obtain_list(this.state.search, 1, size,this.state.sort);
  }

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
        {this.state.record_list.length > 0 && (
          <Table
            dataSource={this.state.record_list}
            columns={columns}
            scroll={{ x: 1500 }}
            pagination={{
              showQuickJumper: true,
              total: this.state.total,
              showSizeChanger: true,
              onChange: this.paginationChange,
              onShowSizeChange: this.pageSizeChange,
              current: this.state.current_page,
            }}
          />
        )}
      </div>
    );
  }
}

export default JpushSendRecords;
