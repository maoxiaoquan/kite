const moment = require('moment')
const Seq = require('sequelize')
// eslint-disable-next-line

let date = new Date()

exports.create_date = {
  create_date: {
    // 创建时间
    type: Seq.DATE,
    comment: '创建时间',
    field: 'create_date',
    defaultValue: Seq.NOW /*时间*/
  },
  create_date_timestamp: {
    // 创建时间戳
    type: Seq.BIGINT(30),
    comment: '创建时间戳',
    field: 'create_date_timestamp',
    defaultValue: moment(date.setHours(date.getHours())).format('X') /*时间戳 */
  }
}
