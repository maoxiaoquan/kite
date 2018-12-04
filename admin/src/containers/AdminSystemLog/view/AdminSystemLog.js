import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Tag
} from 'antd'
import { Link } from 'react-router-dom'

import './AdminSystemLog.scss'
import {
  get_admin_system_log_list,
  delete_admin_system_log
} from '../actions/AdminSystemLogAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = Input

class AdminSystemLog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '操作时间',
          dataIndex: 'create_date',
          key: 'create_date'
        },
        {
          title: '管理员',
          dataIndex: 'admin_user',
          key: 'admin_user',
          render: (text, record) => {
            return (
              record.admin_user.nickname
            )
          }
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">{this.state.type[record.type]}</Tag>)
        },
        {
          title: '内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                <Button className="box-btn-red"
                        onClick={() => {
                          this._delete(record)
                        }}
                        size="small"
                >删除</Button>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false,
      modal_visible_edit: false,
      type: ['类型', '创建', '修改', '删除', '登录']
    }
  }

  componentDidMount () {
    this.fetch_admin_system_log_list()
  }

  _delete = (value) => {
    this.props.dispatch({type: 'SET_ADMIN_SYSTEM_LOG_INFO', data: value})
    confirm({
      title: '确认要删除此系统日志吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_admin_system_log({id: this.props.state_admin_system_log.current_info.id})
        /*删除系统日志*/
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  TablePageChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_admin_system_log_list(pages)
  }

  fetch_delete_admin_system_log = (values) => { /*删除系统日志*/
    this.props.dispatch(delete_admin_system_log(values, (res) => {
      alert.message_success('删除系统日志成功')
      this.fetch_admin_system_log_list()
    }))
  }

  fetch_admin_system_log_list = () => {  /*获取系统日志带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_admin_system_log_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  render () {
    const {state_admin_system_log} = this.props
    const {loading} = this.state

    return (
      <div className="layout-main">

        <div className="layout-main-title">
          <Icon type="user"/> <em>权限菜单</em>
        </div>

        <div className="admin-system-tag">

          <div className="layout-table">
            <Table
              columns={this.state.columns}
              dataSource={state_admin_system_log.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const AdminSystemLogForm = Form.create()(AdminSystemLog)

export default connect(({state_admin_system_log}) => {
  return {
    state_admin_system_log
  }
})(AdminSystemLogForm)

