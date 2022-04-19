import React, { Component } from "react";
import { Input, Button, Radio, Modal, Space, Select } from "antd";
import { jpushService } from "../../service/jpush.service";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import JpushTable from "./jpush_table";
import JpushForm from "./jpush_form";

const { Option } = Select;

class JpushSend extends Component {
  constructor(props) {
    super(props);

    this.getFilter = this.getFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectChange = this.selectChange.bind(this);

    this.state = {
      filled: false,
      user_list: [],
      notificationStatus: "all",
      selectedRowKeys: [],
      loading: false,
      isModalVisible: false,
      searchText: "",
      searchedColumn: "",
      filter: [],
      filteredInfo: null,
      tags_list: [],
      select_tags: [], 
    };
  }

  componentWillMount() {
    jpushService.getAllUserInfo().then((result) => {
      this.setState({
        user_list: result,
      });
      this.getFilter();
    });
    jpushService.getAllTags().then((result) => {
      this.setState({
        tags_list: result,
      });
      this.setTagKey();
    });
  }

  setRidKey() {
    let data = this.state.user_list;
    for (let i of data) {
      i.key = i.rid;
    }
    this.setState({
      user_list: data,
    });
  }

  setTagKey() {
    const children = [];
    for (let i of this.state.tags_list) {
      children.push(<Option key={i}>{i}</Option>);
    }
    this.setState({
      tags_list: children,
    });
  }

  handleChange({ current: pageNum, pageSize }, filters, sorter) {
    this.setState({
      current_page: pageNum,
      filteredInfo: filters,
    });
  }

  onRadioChange = (e) => {
    if (e.target.value === "rid") {
      this.setRidKey();
    }
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

  getFilter() {
    let data = this.state.user_list;
    let filter = [];
    for (let i = 0, l = data.length; i < l; i++) {
      if (filter.indexOf(data[i].tags) === -1) {
        filter.push({ text: data[i].tags, value: data[i].tags });
      }
    }
    this.setState({ filter: filter });
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  selectChange(value){
    let select = value;
    this.setState({
      select_tags: select,
    })
  }

  render() {
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
        ellipsis: true,
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
        ellipsis: true,
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
          <JpushForm submit={this.submit} notiStatus="all" />
        )}
        {this.state.user_list && this.state.user_list.length > 0 &&
          this.state.notificationStatus == "rid" && (
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
                footer={[
                  <Button
                    key="cancel"
                    htmlType="button"
                    style={{ marginLeft: "10px" }}
                    onClick={this.handleCancel}
                  >
                    取消
                  </Button>,
                ]}
                okButtonProps={{ disabled: !this.state.filled }}
              >
                <JpushForm
                  notiStatus="rid"
                  selectedRowKeys={this.state.selectedRowKeys}
                />
              </Modal>
              <JpushTable
                rowSelection={rowSelection}
                dataSource={this.state.user_list}
                columns={columns}
                onChange={this.handleChange}
              />
            </div>
          )}
        {this.state.notificationStatus === "tag" && (
          <div>
            <div style={{ marginBottom:"10px"}}>推送标签（必填）</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%", marginBottom: "15px" }}
              placeholder="请选择标签"
              onChange={this.selectChange}
            >
              {this.state.tags_list}
            </Select>
            <br />
            <JpushForm
                notiStatus="tag" tags_list = {this.state.select_tags}
              ></JpushForm>
          </div>
        )}
      </div>
    );
  }
}

export default JpushSend;
