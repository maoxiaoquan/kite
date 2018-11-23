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
  Tag,
  Upload
} from 'antd'
import { Link } from 'react-router-dom'

import './Picture.scss'
import {
  get_picture_list,
  create_picture,
  update_picture,
  delete_picture
} from '../actions/PictureAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = Input

class Picture extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'picture_id',
          dataIndex: 'picture_id',
          key: 'picture_id'
        },
        {
          title: '图片标题',
          dataIndex: 'picture_title',
          key: 'picture_title'
        },
        {
          title: '图片类型',
          dataIndex: 'picture_type',
          key: 'picture_type',
          render: (value, record) => {
            return (
              <span>{this.state.menu_text[record.picture_type]}</span>
            )
          }
        },
        {
          title: '图片地址',
          dataIndex: 'picture_url',
          key: 'picture_url'
        },
        {
          title: '是否可用',
          dataIndex: 'enable',
          key: 'enable',
          render: (value, record) => {
            return (
              <div className="table-is-login">
                {
                  value ? (<Icon type="check-circle"/>) : (<Icon type="close-circle"/>)
                }
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                <Button onClick={() => { this._edit(record) }} size="small"
                        type="primary"
                >修改</Button>
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
      confirmDirty: false,
      modal_visible_edit: false,
      modal_visible_authority: false,
      is_create: true,
      menu_text: ['', '首页轮播图', '首页广告'],
      upload_prop: {
        name: 'file',
        action: '/api/upload_picture',
        headers: {
          'x-access-token': localStorage.box_tokens
        },
        onChange: this.handleChange,
        listType: 'picture-card'
      },
      fileList: []

    }
  }

  componentDidMount () {
    this.fetch_picture_list()
  }

  _edit = (data) => {/*修改图片*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({type: 'SET_PICTURE_INFO', data: data})
    this.props.form.setFieldsValue({
      picture_title: data.picture_title,
      picture_type: data.picture_type,
      picture_url: data.picture_url,
      enable: data.enable
    })
    let fileList = [{
      uid: -1,
      status: 'done',
      url: data.picture_url
    }]
    this.setState({
      fileList
    })
  }

  _delete = (value) => {
    this.props.dispatch({type: 'SET_PICTURE_INFO', data: value})
    confirm({
      title: '确认要删除此标签吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_picture({picture_id: this.props.state_picture.current_info.picture_id})
        /*删除标签*/
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  handleChange = (info) => {
    let fileList = info.fileList

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1)

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.filename
      }
      return file
    })

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.state === 'success'
      }
      return true
    })

    this.setState({fileList})
  }

  TablePageChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_picture_list(pages)
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modal_visible_edit: true,
      is_create: true,
      fileList: []
    })
    /*this.props.form.setFieldsValue({
      authority_parent_title: '11'
    })*/
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {is_create} = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (is_create) {
          this.fetch_create_picture(values)
        } else {
          this.fetch_update_picture(values)
        }
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true})
    }
    callback()
  }

  fetch_create_picture = (values) => {  /*创建图片*/
    this.props.dispatch(create_picture(values, (res) => {
      alert.message_success('创建图片成功')
      this.fetch_picture_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_update_picture = (values) => { /*修改图片*/
    this.props.dispatch(update_picture({picture_id: this.props.state_picture.current_info.picture_id, ...values}, (res) => {
      alert.message_success('修改图片成功')
      this.fetch_picture_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_delete_picture = (values) => { /*删除图片*/
    this.props.dispatch(delete_picture(values, (res) => {
      alert.message_success('删除图片成功')
      this.fetch_picture_list()
    }))
  }

  fetch_picture_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_picture_list({params: {page: current}}, (res) => {
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
    const {state_picture} = this.props
    const {loading, is_create} = this.state
    const {getFieldDecorator} = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 19}
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 5
        }
      }
    }

    return (

      <div className="layout-main">

        <div className="layout-main-title">
          <Icon type="user"/> <em>标签管理</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="article-tag-user-create-btn layout-btn"
            icon="plus" type="primary"
            onClick={() => this.showModal(0)}
          >创建图片</Button>
        </div>


        <div className="picture-view">


          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="填写内容"
            visible={this.state.modal_visible_edit}
          >
            <Form
              className="from-view"
              onSubmit={this.handleSubmit}
            >

              <FormItem
                {...formItemLayout}
                label="图片标题"
              >
                {getFieldDecorator('picture_title', {
                  rules: [{required: true, message: '请输入图片标题！', whitespace: true}]
                })(
                  <Input placeholder="图片标题"/>
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                hasFeedback
                label="图片类型"
              >
                {getFieldDecorator('picture_type', {
                  rules: [
                    {required: true, message: '请选择图片类型！'}
                  ]
                })(
                  <Select placeholder="图片类型！">
                    <Option value="1">首页轮播图</Option>
                    <Option value="2">首页广告</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Upload"
              >
                {getFieldDecorator('picture_url', {
                  getValueFromEvent: this.normFile
                })(
                  <Upload {...this.state.upload_prop} fileList={this.state.fileList}>
                    <div>
                      <Icon type="plus"/>
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  </Upload>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="是否有效"
              >
                {getFieldDecorator('enable', {valuePropName: 'checked'})(
                  <Switch/>
                )}
              </FormItem>


              <FormItem
                {...tailFormItemLayout}
              >
                <Button
                  className="register-btn"
                  htmlType="submit"
                  type="primary"
                >
                  {
                    is_create ? '创建标签' : '更新'
                  }
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <div className="layout-table">
            <Table
              columns={this.state.columns}
              dataSource={state_picture.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="picture_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const PictureForm = Form.create()(Picture)

export default connect(({state_picture}) => {
  return {
    state_picture
  }
})(PictureForm)

