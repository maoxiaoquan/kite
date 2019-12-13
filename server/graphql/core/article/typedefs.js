const Schema = `
  type ArticleView {
    aid: Int
    title: String
    thumb_count: Int
    comment_count: Int
  }

  type ArticleList {
    page: String
    pageSize: String
    list: [ArticleView]
  }
`

const Query = `
  articleList: ArticleList
  recommendArticle: [ArticleView] 
`
const Mutation = ` 
  
`

module.exports = {
  Schema,
  Query,
  Mutation
}
