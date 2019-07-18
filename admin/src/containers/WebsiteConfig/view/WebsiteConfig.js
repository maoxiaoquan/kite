import React from 'react'
import { connect } from 'react-redux'
import { Icon, Alert } from 'antd'
import Notice from '../components/Notice'
import Advertise from '../components/Advertise'
import './WebsiteConfig.scss'

@connect(({ state_website_config }) => {
  return {
    state_website_config
  }
})
class WebsiteConfig extends React.Component {
  render() {
    return (
      <div className="layout-main" id="system-config">
        <div className="layout-main-title">
          <Icon type="setting" /> <em>网站配置</em>
        </div>
        <div className="layout-card-view">
          <Notice />
          <Advertise />
          <Alert
            message="备注"
            description="应用于网站的某些配置公告等等"
            type="warning"
            showIcon
          />
        </div>
      </div>
    )
  }
}

export default WebsiteConfig
