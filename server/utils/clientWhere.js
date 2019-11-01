const Op = require('sequelize').Op
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail },
  articleType: { article, note }
} = require('./constant')
module.exports = {
  article: {
    otherList: {
      [Op.or]: [
        { status: reviewSuccess }, // 审核成功
        { status: freeReview } // 免审核
      ]
    },
    otherView: {
      [Op.or]: [
        { status: pendingReview }, // 待审核
        { status: reviewSuccess }, // 审核成功
        { status: freeReview } // 免审核
      ]
    },
    me: {
      [Op.or]: [
        { status: pendingReview }, // 待审核
        { status: reviewSuccess }, // 审核成功
        { status: freeReview }, // 免审核
        { status: reviewFail } // 审核失败
      ]
    },
    type: {
      [Op.or]: [article, note]
    },
    isPublic: true
  },
  comment: {
    [Op.or]: [
      { status: pendingReview }, // 待审核
      { status: reviewSuccess }, // 审核成功
      { status: freeReview }, // 免审核
      { status: reviewFail } // 审核失败
    ]
  },
  dynamic: {
    myQuery: {
      status: {
        [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
      }
    }
  }
}
