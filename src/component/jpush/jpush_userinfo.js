import React, { Component } from "react";
import { jpushService } from "../../service/jpush.service";
import { Table, Input, Button, Space } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

class JpushUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_list: [],
      current_page: 1,
      page_size: 10,
      searchText: '',
      searchedColumn: '',
    };
    this.paginationChange = this.paginationChange.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
  }

  componentWillMount() {
    jpushService.getAllUserInfo().then((result) => {
      this.setState({
        user_list: result,
      });
    });
    this.addName();
  }

  addName(){
    let data = this.state.user_list;
    for (let i = 0; i < data.length; i++) {
      data[i].name = data[i].rid;
    }
    this.setState({
      user_list: data,
    });
  }

  paginationChange(e) {
    this.setState({
      current_page: e,
    });
  }

  pageSizeChange(current, size) {
    this.setState({
      current_page: 1,
      page_size: size,
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
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
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
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

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps('name'),
      },
      {
        title: "城市",
        dataIndex: "city",
        key: "city",
        ...this.getColumnSearchProps('city'),
      },
      {
        title: "省份",
        dataIndex: "province",
        key: "province",
        ...this.getColumnSearchProps('province'),
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "phone",
        ...this.getColumnSearchProps('phone'),
      },
      {
        title: "地址",
        dataIndex: "address",
        key: "address",
        ...this.getColumnSearchProps('address'),
      },
      {
        title: "用户ID",
        dataIndex: "consumerid",
        key: "consumerid",
        ...this.getColumnSearchProps('consumerid'),
      },
      {
        title: "别名",
        dataIndex: "alias",
        key: "alias",
        ...this.getColumnSearchProps('alias'),
      },
      {
        title: "设备ID",
        dataIndex: "rid",
        key: "rid",
        ...this.getColumnSearchProps('rid'),
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
          this.getColumnSearchProps('isvisitor');
          return <span>{text}</span>;
        },
      },
      {
        title: "平台",
        dataIndex: "platform",
        key: "platform",
        ...this.getColumnSearchProps('platform'),
      },
      {
        title: "标签",
        dataIndex: "tags",
        key: "tags",
        ...this.getColumnSearchProps('tags'),
      },
    ];

    return (
      <div>
        {/* <Search style={{float: 'right', width: '35%', marginBottom: '15px'}}
                            placeholder="请输入会员ID或姓名"
                            enterButton="搜索"
                            onChange={(e) => {
                                this.setState({search: e.target.value})
                            }}
                            value={this.state.search}
                            onSearch={this.onSearch}
                    /> */}
        {this.state.user_list.length > 0 && (
          <Table
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
          />
        )}
      </div>
    );
  }
}
export default JpushUserInfo;
