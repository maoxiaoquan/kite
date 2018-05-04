const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'article', /*表名*/
  TABLE: {
    /*表结构*/
    aid: { // 文章id
      type: Seq.STRING(20),
      primaryKey: true, // 定义主键
      comment: '文章id',
      field: 'aid',
      defaultValue: shortid.generate
    },
    user_id: { // 作者id
      type: Seq.STRING(50),
      comment: '作者id',
      field: 'user_id'
    },
    author: { // 作者
      type: Seq.STRING(20),
      comment: '作者',
      field: 'author'
    },
    create_date: { // 创建时间
      type: Seq.BIGINT(50),
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
    type: { // 类型 （1文章 2说说 3视频 4公告 ）
      type: Seq.STRING(20),
      comment: '类型 （1:文章; 2:说说 ;3:视频;4: 公告 ）',
      field: 'type'
    },
    category: { // 类别
      type: Seq.STRING(20),
      comment: '类别',
      field: 'category'
    },
    read_count: { // 阅读数
      type: Seq.BIGINT(20),
      comment: '阅读数',
      field: 'read_count',
      defaultValue: 0
    },
    comment_count: { // 评论数
      type: Seq.BIGINT(20),
      comment: '评论数',
      field: 'comment_count',
      defaultValue: 0
    }
  }
}