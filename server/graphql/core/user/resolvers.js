// example data

const models = require('../../models')

const Query = {
  async userInfo (_, { uid }) {
    const userInfo = await models.user.userInfo(uid)
    return userInfo
  },
  async userUnreadCount (_, { uid }, { islogin, user }) {
    if (islogin) {
      const Count = await models.user.userUnreadCount(user.uid)
      return Count
    } else {
      return {
        messageCount: 0,
        attentionCount: 0
      }
    }
  },
  async userUnreadList (_, { page, pageSize }, { islogin, user }) {
    if (islogin) {
      const AttentionMsg = await models.user.unreadAttentionMsg({
        page,
        pageSize,
        uid: user.uid
      })
      return AttentionMsg
    } else {
      return {
        count: 0,
        list: [],
        page: 0,
        pageSize: 0
      }
    }
  }
}

const Mutation = {}

const Schema = {}

module.exports = {
  Schema,
  Query,
  Mutation
}
