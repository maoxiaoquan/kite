const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
const config = require('../../../server/config')

module.exports = {
  NAME: 'article_blog' /* 表名 */,
  TABLE: {
    /* 表结构 */
    blog_id: {
      // 个人专栏ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '个人专栏ID',
      field: 'blog_id'
    },
    uid: {
      // uid
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    name: {
      // 个人专栏名字
      type: Seq.STRING(20),
      comment: '名字',
      field: 'name'
    },
    en_name: {
      // 个人专栏英文名字
      type: Seq.STRING(60),
      comment: '英文名字',
      field: 'en_name'
    },
    description: {
      // 个人专栏描述
      type: Seq.TEXT,
      comment: '描述',
      field: 'description'
    },
    read_count: {
      // 个人专栏阅读数量
      type: Seq.INTEGER(10),
      comment: '个人专栏阅读数量',
      field: 'read_count'
    },
    icon: {
      // 个人专栏图标
      type: Seq.STRING(200),
      comment: '图标（预留）',
      field: 'icon',
      defaultValue: () => {
        return config.DF_ICON
      }
    },
    tag_ids: {
      /* 文章所属的标签名字 可多个 */
      type: Seq.STRING(180),
      comment: '个人专栏所属的标签id',
      field: 'tag_ids'
    },
    status: {
      // 状态
      type: Seq.STRING(30),
      comment: '状态 审核成功、审核失败、待审核、免审核',
      field: 'status'
    },
    is_public: {
      // 是否公开
      type: Seq.BOOLEAN,
      comment: '是否公开',
      field: 'is_public',
      defaultValue: () => {
        return false
      }
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示（预留）',
      field: 'enable'
    },
    rejection_reason: {
      /* 驳回，或者文章审核不通过的原因 */
      type: Seq.STRING(160),
      comment: '驳回，或者文章审核不通过的原因',
      field: 'rejection_reason'
    },
    like_count: {
      // 喜欢数
      type: Seq.BIGINT(20),
      comment: '喜欢数',
      field: 'like_count',
      defaultValue: 0
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date',
      defaultValue: Seq.NOW /* 时间 */
    },
    ...time.create_date
  }
}
