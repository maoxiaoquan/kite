// example data

const models = require('../../models')

export const Query = {
  async userInfo(_: any, { uid }: any) {
    const userInfo = await models.user.userInfo(uid)
    return userInfo
  },
  async userUnreadCount(_: any, { uid }: any, { islogin, user }: any) {
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
  async userUnreadList(_: any, { page, pageSize }: any, { islogin, user }: any) {
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

export const Mutation = {}

export const Schema = {}


