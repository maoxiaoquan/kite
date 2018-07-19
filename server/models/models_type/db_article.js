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
    uid: { // 作者id
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    author: { // 作者
      type: Seq.STRING(20),
      comment: '作者',
      field: 'author'
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
    content: { // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'content'
    },
    origin_content: { // 原内容
      type: Seq.TEXT('long'),
      comment: '原内容',
      field: 'origin_content'
    },
    source: {// 来源 （1原创 2转载）
      type: Seq.STRING(20),
      comment: '来源 （1原创 2转载）',
      field: 'source'
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
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date'
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.DATE,
      comment: '创建时间戳',
      field: 'create_date_timestamp'
    },
    cover_img: {
      type: Seq.STRING(20),
      comment: '封面图片',
      field: 'cover_img'
    },
    read_count: { // 阅读数
      type: Seq.BIGINT(20),
      comment: '阅读数',
      field: 'read_count',
      defaultValue: 0
    },
    topic_ids: {
      /* 文章所属的用户专栏id 可多个*/
      type: Seq.STRING(100),
      comment: '文章所属的用户专栏id',
      field: 'article_topic_ids'
    },
    tag_ids: {
      /* 文章所属的标签名字 可多个*/
      type: Seq.STRING(100),
      comment: '文章所属的标签id',
      field: 'article_tag_ids'
    }
  }
}