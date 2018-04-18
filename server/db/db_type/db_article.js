const Seq = require('sequelize')
const shortid = require('shortid');
module.exports = {
  NAME: 'article', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 自增ID
      type: Seq.BIGINT(20),
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    aid: { // 文章id
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      comment: '文章id',
      field: 'aid',
      defaultValue:shortid.generate
    },
    user_id: { // 作者id
      type: Seq.BIGINT(20),
      comment: '作者id',
      field: 'user_id'
    },
    author: { // 作者
      type: Seq.STRING(20),
      comment: '作者',
      field: 'author'
    },
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date'
    },
    content: { // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'content'
    },
    title: { // 标题
      type: Seq.TEXT,
      comment: '标题',
      field: 'title'
    },
    excerpt: { // 摘记
      type: Seq.TEXT,
      comment: '摘记',
      field: 'excerpt'
    },
    status: { // 状态
      type: Seq.INTEGER(5),
      comment: '状态(0:草稿;1:审核中;2:审核通过;3:回收站)',
      field: 'status'
    },
    type: { // 类型
      type: Seq.STRING(20),
      comment: '类型',
      field: 'type'
    },
    read_count: { // 阅读数
      type: Seq.BIGINT(20),
      comment: '阅读数',
      field: 'read_count'
    },
    comment_count: { // 评论数
      type: Seq.BIGINT(20),
      comment: '评论数',
      field: 'comment_count'
    }
  }
}