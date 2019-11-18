// example data
const { find, filter } = require('lodash')
const models = require('../../../models')
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' }
]

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 }
]

const Query = {
  posts: () => posts,
  author: (_, { id }) => find(authors, { id }),
  articleList: async () => {
    const { page, pageSize, list } = await models.article.getIndex()
    console.log('models.article.getIndex()', list)

    return list
  }
}

const Mutation = {
  upvotePost: (_, { postId }) => {
    const post = find(posts, { id: postId })
    if (!post) {
      throw new Error(`Couldn't find post with id ${postId}`)
    }
    post.votes += 1
    return post
  }
}

const Schema = {
  Author: {
    posts: author => filter(posts, { authorId: author.id })
  },

  Post: {
    author: post => find(authors, { id: post.authorId })
  }
}

module.exports = {
  Schema,
  Query,
  Mutation
}
