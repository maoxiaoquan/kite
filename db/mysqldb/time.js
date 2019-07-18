const moment = require('moment')
const Seq = require('sequelize')
// eslint-disable-next-line
exports.create_date = {
  create_date: {
    // 创建时间
    type: Seq.DATE,
    comment: '创建时间',
    field: 'create_date',
    defaultValue: Seq.NOW /* 时间 */
  },
  create_timestamp: {
    // 创建时间戳
    type: Seq.BIGINT(50),
    comment: '创建时间戳',
    field: 'create_timestamp',
    defaultValue: () => {
      return moment(new Date().setHours(new Date().getHours())).format('X')
    } /* 时间戳 */
  }
}
