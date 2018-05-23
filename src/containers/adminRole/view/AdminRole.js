import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Table } from 'antd';
import { Link } from 'react-router-dom'

import './AdminRole.scss'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '年龄',
  dataIndex: 'age',
  key: 'age'
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address'
}];

class adminRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '刷66666666666新'
    };
  }
  componentWillMount() {
    // console.log(this.props.dispatch(sign_in()))
    // this.props.dispath(sign_in())
  }

  render() {
    const { title } = this.props;
    return (
      <div className="box-card">
        <div className="box-card-header">
          <h2><strong>角色管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);" >
                <Icon type="ellipsis" />
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <p>{this.props.match.url}</p>
          <p>{this.props.match.params.id}</p>
          <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    );
  }
}


export default connect((title) => {
  console.log('title', title.title.title);
  return {
    title
  };
})(adminRole);

