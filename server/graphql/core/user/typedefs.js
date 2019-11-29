const Schema = `
  type UserInfo {
    uid: Int
    avatar: String
    nickname: String
    user_role_ids: String
    home_page: String
    company: String
    shell_balance: Int
  }
`

const Query = `
  userInfo(uid: Int!): UserInfo
`

const Mutation = ` 
  
`

module.exports = {
  Schema,
  Query,
  Mutation
}
