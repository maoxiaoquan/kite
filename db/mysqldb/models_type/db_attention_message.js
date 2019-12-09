const Seq = require('sequelize')
const time = require('../time')
module.exports = {
  NAME: 'attention_message' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 关系ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    receive_uid: {
      // 接受UID
      type: Seq.BIGINT(20),
      comment: '接受UID',
      field: 'receive_uid'
    },
    sender_uid: {
      // 发送者UID
      type: Seq.BIGINT(20),
      comment: '发送者UID',
      field: 'sender_uid'
    },
    type: {
      // 类型  1:用户 2:文章  3:文章个人专栏 4:文章评论 5:小书章节 6:小书章节评论 7:小书 8:小书评论 9:片刻 10:片刻评论
      type: Seq.INTEGER(10),
      comment:
        '1:用户2:文章3:文章专栏4:文章评论5:小书章节6:小书章节评论7:小书8:小书评论9:片刻10:片刻评论',
      field: 'type'
    },
    action: {
      // 消息动作  1:系统消息,2:喜欢,3:收藏 ,4:关注 ,5:评论,6:回复,7:赞
      type: Seq.INTEGER(10),
      comment: '1:系统消息,2:喜欢,3:收藏 ,4:关注 ,5:评论,6:回复,7:赞',
      field: 'action'
    },
    associate_id: {
      // 关联id
      type: Seq.STRING(50),
      comment: '关联id',
      field: 'associate_id'
    },
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    },
    ...time.create_date
  }
}
