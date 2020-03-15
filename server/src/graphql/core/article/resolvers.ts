// example data

const models = require('../../models')

export const Query = {
  articleList: async () => {
    const { page, pageSize, list } = await models.article.getIndex()
    return {
      page,
      pageSize,
      list
    }
  },
  recommendArticle() {
    return models.article.recommendArticle()
  }
}

export const Mutation = {}

export const Schema = {}

