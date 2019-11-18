const Schema = `
  type ArticleView {
    aid: Int
    title: String
  }

  type ArticleList {
    page: String
    pageSize: String
    list: [ArticleView]
  }
`

const Query = `
  articleList: ArticleList  
`
const Mutation = ` 
  upvotePost (
    postId: Int!
  ): ArticleView
`

module.exports = {
  Schema,
  Query,
  Mutation
}
