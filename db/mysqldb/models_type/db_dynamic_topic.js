const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

function uuid (len, radix) {
  var chars = '0123456789abcdefhiklmnorstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

module.exports = {
  NAME: 'dynamic_topic' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    topic_id: {
      // 话题名字
      type: Seq.STRING(100),
      defaultValue: () => {
        return uuid(24)
      },
      comment: 'topic_id',
      field: 'topic_id'
    },
    name: {
      // 话题名字
      type: Seq.STRING(50),
      comment: '话题名字',
      field: 'name'
    },
    en_name: {
      // 话题英文名字
      type: Seq.STRING(100),
      comment: '话题英文名字',
      field: 'en_name'
    },
    icon: {
      // 话题图标地址
      type: Seq.STRING(200),
      comment: '话题图标地址',
      field: 'icon'
    },
    description: {
      // 话题描述
      type: Seq.STRING(100),
      comment: '话题描述',
      field: 'description'
    },
    rss_count: {
      // 关注数统计
      type: Seq.BIGINT(20),
      comment: '关注数统计',
      field: 'rss_count',
      defaultValue: 0
    },
    sort: {
      // 排序
      type: Seq.INTEGER(10),
      comment: '排序',
      field: 'sort'
    },
    is_show: {
      // 是否在前台页面显示
      type: Seq.BOOLEAN,
      comment: '是否在前台页面显示',
      field: 'is_show'
    },
    is_push: {
      // 是否加入首页或者推荐
      type: Seq.BOOLEAN,
      comment: '是否加入首页或者推荐',
      field: 'is_push',
      defaultValue: () => {
        return false
      }
    },
    enable: {
      // 是否可用
      type: Seq.BOOLEAN,
      comment: '是否可用',
      field: 'enable'
    },
    ...time.create_date
  }
}
