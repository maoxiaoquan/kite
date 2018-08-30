const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_dynamic', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    uid: { // 用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    type: { // 类型 1 喜欢文章  2 关注标签 3 关注用户 4 评论回复
      type: Seq.INTEGER(10),
      comment: 'type',
      field: 'type'
    },
    type_description: { // 类型描述
      type: Seq.STRING(20),
      comment: 'type_description',
      field: 'type_description'
    },
    aid: { // 文章id
      type: Seq.STRING(20),
      comment: '文章id',
      field: 'aid'
    },
    like_uid: { // like 用户ID
      type: Seq.INTEGER(10),
      comment: 'like_uid',
      field: 'like_uid'
    },
    article_tag_id: { //标签ID
      type: Seq.INTEGER(10),
      comment: 'article_tag_id 主键，自增',
      field: 'article_tag_id'
    },
    comment_id: { //评论 ID
      type: Seq.INTEGER(10),
      comment: 'comment_id',
      field: 'comment_id'
    },
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date'
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp'
    },
    is_read: { // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read'
    }
  }
}