import React, { Component } from "react";
import { Table } from "antd";

class JpushTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
          columns: props.columns,
          user_list: props.dataSource,
          current_page: 1,
          page_size: 10,
          searchText: '',
          searchedColumn: '',
          rowSelection: props.rowSelection,
          scroll: props.scroll,
          onChange: props.onChange,
        };
        this.paginationChange = this.paginationChange.bind(this);
        this.pageSizeChange = this.pageSizeChange.bind(this);
      }

      componentWillReceiveProps(props) {
        this.setState({
            columns: props.columns,
            user_list: props.dataSource,
            rowSelection: props.rowSelection,
            scroll: props.scroll,
            onChange: props.onChange
        })
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

      render() {
        return (
            <div>
              {this.state.user_list && this.state.user_list.length > 0 && (
                <Table
                  dataSource={this.state.user_list}
                  columns={this.state.columns}
                  pagination={{
                    showQuickJumper: true,
                    total: this.state.total,
                    showSizeChanger: true,
                    onChange: this.paginationChange,
                    onShowSizeChange: this.pageSizeChange,
                    current: this.state.current_page,
                  }}
                  rowSelection={this.state.rowSelection}
                  scroll = {this.state.scroll}
                  onChange = {this.state.onChange}
                />
              )}
            </div>
          );
      }
}

export default JpushTable;