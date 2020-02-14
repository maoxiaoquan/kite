const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'user_info' /* 表名 */,
  TABLE: {
    /* 表结构 */
    uid: {
      // 权限ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      comment: 'uid',
      field: 'uid'
    },
    profession: {
      // 职业
      type: Seq.STRING(50),
      comment: '职业',
      field: 'profession'
    },
    home_page: {
      // 个人主页
      type: Seq.STRING(100),
      comment: '个人主页地址',
      field: 'home_page'
    },
    avatar_review: {
      // 审核头像的地址
      type: Seq.STRING(200),
      comment: '审核头像的地址',
      field: 'avatar_review'
    },
    avatar_review_status: {
      // 审核头像的地址
      type: Seq.INTEGER(10),
      comment: '审核头像的地址的状态：1：审核中，2：审核成功，3：审核失败',
      field: 'avatar_review_status'
    },
    company: {
      // 公司
      type: Seq.STRING(50),
      comment: '公司',
      field: 'company'
    },
    edit_type: {
      // 编辑器类型
      type: Seq.STRING(50),
      comment: '编辑器类型',
      field: 'edit_type'
    },
    // 2019.11.3 新增
    shell_total_amount: {
      type: Seq.DECIMAL(10, 2),
      comment: '贝壳总额',
      field: 'shell_total_amount'
    },
    shell_balance: {
      type: Seq.DECIMAL(10, 2),
      comment: '贝壳余额',
      field: 'shell_balance'
    },
    experience: {
      type: Seq.BIGINT(20),
      comment: '经验总值',
      field: 'experience'
    },
    is_msg_push: {
      type: Seq.INTEGER(5),
      comment: '是否开启消息推送 1:开启;2:关闭',
      field: 'is_msg_push',
      defaultValue: 2
    }
  }
}
