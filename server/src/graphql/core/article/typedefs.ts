export const Schema = `
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

export const Query = `
  articleList: ArticleList
  recommendArticle: [ArticleView] 
`
export const Mutation = ` 
  
`

