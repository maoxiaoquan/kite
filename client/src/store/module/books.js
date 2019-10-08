import { fetch } from '@request'

const state = () => ({
  popular_article_tag: []
})

const mutations = {
  SET_POPULAR_ARTICLE_TAG (state, data) {
    // 设置热门文章标签
    state.popular_article_tag = data
  }
}

const actions = {
  UPLOAD_BOOKS_COVER_IMG ({ commit, dispatch, state }, parameter) {
    // 上传小书封面图片
    return fetch({
      url: '/book/upload-books-picture',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_BOOKS: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/books/create',
      method: 'post',
      parameter: data
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
