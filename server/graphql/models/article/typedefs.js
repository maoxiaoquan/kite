const Schema = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }

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
  posts: [Post]
  author(id: Int!): Author
  articleList: [ArticleView]  
`
const Mutation = ` 
  upvotePost (
    postId: Int!
  ): Post
`

module.exports = {
  Schema,
  Query,
  Mutation
}
