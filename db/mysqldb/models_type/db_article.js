const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article' /* 表名 */,
  TABLE: {
    /* 表结构 */
    aid: {
      // 用户ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'aid 主键，自增',
      field: 'aid' //  相应的字段名称
    },
    uid: {
      // 作者id
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    title: {
      // 标题
      type: Seq.TEXT,
      comment: '标题',
      field: 'title'
    },
    excerpt: {
      // 摘记
      type: Seq.TEXT,
      comment: '摘记',
      field: 'excerpt'
    },
    content: {
      // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'content'
    },
    origin_content: {
      // 原内容
      type: Seq.TEXT('long'),
      comment: '原内容',
      field: 'origin_content'
    },
    source: {
      // 来源 （1原创 2转载）
      type: Seq.STRING(20),
      comment: '来源 （0原创 1转载）',
      field: 'source'
    },
    status: {
      // 状态
      type: Seq.INTEGER(5),
      comment: '状态(0:草稿;1:审核中;2:审核通过;3:回收站)',
      field: 'status'
    },
    type: {
      // 类型 （1文章 2说说 3视频 4公告 ）
      type: Seq.STRING(20),
      comment: '类型 （0:提问 ；1:文章; ）',
      field: 'type'
    },
    cover_img: {
      type: Seq.STRING(150),
      comment: '封面图片',
      field: 'cover_img'
    },
    read_count: {
      // 阅读数
      type: Seq.BIGINT(20),
      comment: '阅读数',
      field: 'read_count',
      defaultValue: 0
    },
    like_count: {
      // 喜欢数
      type: Seq.BIGINT(20),
      comment: '喜欢数',
      field: 'like_count',
      defaultValue: 0
    },
    comment_count: {
      // 评论数
      type: Seq.BIGINT(20),
      comment: '评论数',
      field: 'comment_count',
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
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date',
    },
    update_date_timestamp: {
      // 更新时间戳
      type: Seq.BIGINT(30),
      comment: '更新时间戳',
      field: 'update_date_timestamp',
    },
    ...time.create_date
  }
}
