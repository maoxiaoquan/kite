const Op = require('sequelize').Op

module.exports = {
  article: {
    otherList: {
      [Op.or]: [{ status: 2 }, { status: 6 }] // 状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除,6无需审核
    },
    otherView: {
      [Op.or]: [{ status: 1 }, { status: 2 }, { status: 6 }] // 状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除,6无需审核
    },
    me: {
      [Op.or]: [
        { status: 0 },
        { status: 1 },
        { status: 2 },
        { status: 3 },
        { status: 6 }
      ] // 状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除，6无需审核
    }
  },
  comment: {
    [Op.or]: [{ status: 1 }, { status: 2 }, { status: 3 }, { status: 5 }]
    // 状态(1:审核中;2:审核通过;3:审核失败;4:回收站，5:无需审核)
  }
}
