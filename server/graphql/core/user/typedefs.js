const Schema = `
  type UserInfo {
    uid: Int
    avatar: String
    nickname: String
    user_role_ids: String
    home_page: String
    company: String
    profession: String
    shell_balance: Int
    articleCount: Int
    dynamicCount: Int
  }

  type UserUnreadCount {
    messageCount:Int
    attentionCount:Int
  }

  type AttentionMsgInfo {
    receive_uid:Int
  }

  type AttentionMsg {
    count: Int
    list: [AttentionMsgInfo]
    page: Int
    pageSize: Int
  }
`

const Query = `
  userInfo(uid: Int!): UserInfo
  userUnreadCount: UserUnreadCount
  userUnreadList(page: Int!,pageSize: Int!): AttentionMsg
`

const Mutation = ` 
  
`

module.exports = {
  Schema,
  Query,
  Mutation
}
