import React from 'react'
import { connect } from 'react-redux'
import { Icon, Breadcrumb, Alert } from 'antd'

import EmailBind from '../components/EmailBind'
import WebsiteInfo from '../components/WebsiteInfo'
import WebConfig from '../components/WebConfig'

import './SystemConfig.scss'

@connect(({ stateSystemConfig }) => {
  return {
    stateSystemConfig
  }
})
class SystemConfig extends React.Component {
  render() {
    return (
      <div className="layout-main" id="system-config">
        <div className="layout-main-title">
          <Breadcrumb>
            <Breadcrumb.Item href="#/manager/index">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#/manager/index">
              <span>主页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">
              <span>系统管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>系统配置</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <EmailBind></EmailBind>
        <WebsiteInfo></WebsiteInfo>
        <WebConfig></WebConfig>
        <Alert
          message="备注"
          description="由于是系统配置，修改时请谨慎，修改成功某些配置后，如果未生效或者出现错误，请务必重启服务"
          type="warning"
          showIcon
        />
      </div>
    )
  }
}

export default SystemConfig
