const Op = require('sequelize').Op
import { statusList } from './constant'
module.exports = {
  article: {
    otherList: {
      [Op.or]: [
        { status: statusList.reviewSuccess }, // 审核成功
        { status: statusList.freeReview } // 免审核
      ]
    },
    otherView: {
      [Op.or]: [
        { status: statusList.pendingReview }, // 待审核
        { status: statusList.reviewSuccess }, // 审核成功
        { status: statusList.freeReview } // 免审核
      ]
    },
    me: {
      [Op.or]: [
        { status: statusList.pendingReview }, // 待审核
        { status: statusList.reviewSuccess }, // 审核成功
        { status: statusList.freeReview }, // 免审核
        { status: statusList.reviewFail } // 审核失败
      ]
    },
    isPublic: true
  },
  comment: {
    [Op.or]: [
      { status: statusList.pendingReview }, // 待审核
      { status: statusList.reviewSuccess }, // 审核成功
      { status: statusList.freeReview }, // 免审核
      { status: statusList.reviewFail } // 审核失败
    ]
  },
  dynamic: {
    myQuery: {
      status: {
        [Op.or]: [
          statusList.reviewSuccess,
          statusList.freeReview,
          statusList.pendingReview,
          statusList.reviewFail
        ]
      }
    }
  }
}
