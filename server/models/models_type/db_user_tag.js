const Seq = require('sequelize')

module.exports = {
  NAME: 'user_tag', /*表名*/
  TABLE: {
    /*表结构*/
    user_tag_id: { // 用户标签ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '用户标签ID',
      field: 'user_tag_id'
    },
    user_tag_name: { // 用户标签名字
      type: Seq.STRING(100),
      comment: '用户标签名字',
      field: 'user_tag_name'
    },
    user_tag_description: { // 用户标签描述
      type: Seq.STRING(100),
      comment: '用户标签描述',
      field: 'user_tag_description'
    },
    user_tag_icon: { // 用户标签图标
      type: Seq.STRING(20),
      comment: '用户标签图标',
      field: 'user_tag_icon'
    },
    user_tag_icon_type: { // 用户标签图标类型
      type: Seq.INTEGER(20),
      comment: '用户标签图标类型',
      field: 'user_tag_icon_type'
    },
    create_date: { // 创建时间
      type: Seq.BIGINT(50),
      comment: '创建时间',
      field: 'create_date'
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp'
    }
  }
}

