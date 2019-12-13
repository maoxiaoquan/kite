// example data

const models = require('../../models')

const Query = {
  articleList: async () => {
    const { page, pageSize, list } = await models.article.getIndex()
    return {
      page,
      pageSize,
      list
    }
  },
  recommendArticle () {
    return models.article.recommendArticle()
  }
}

const Mutation = {}

const Schema = {}

module.exports = {
  Schema,
  Query,
  Mutation
}
