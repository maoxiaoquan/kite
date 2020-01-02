import { fetch } from '@request'

const state = () => ({
  article: {
    article_list: [],
    column_en_name: '',
    count: 0,
    page: 0
  },
  popular_article_tag: []
})

const mutations = {
  SET_INIT_INDEX_ARTICLE_LIST (state, data) {
    // 初始化首页 专栏页 文章列表
    state.article = {
      article_list: [],
      column_en_name: '',
      count: 0,
      page: 0
    }
  },
  SET_INDEX_ARTICLE_LIST (state, { article_list, column_en_name, count, page }) {
    let _list = state.article.article_list
    // 首页 专栏页 文章列表
    state.article = { column_en_name, count, page }
    state.article.article_list = [..._list, ...article_list]
  },
  SET_POPULAR_ARTICLE_TAG (state, data) {
    // 设置热门文章标签
    state.popular_article_tag = data
  }
}

const actions = {
  GET_INDEX_ARTICLE_LIST ({ commit, dispatch, state }, parameter = {}) {
    // 获取首页 文章列表
    return fetch({
      url: '/article/index',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_INDEX_ARTICLE_LIST', result.data)
      return result
    })
  },
  GET_INDEX_COLUMN_ARTICLE_LIST ({ commit, dispatch, state }, parameter = {}) {
    // 获取首页 专栏页 文章列表
    return fetch({
      url: '/article/index-column',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_INDEX_ARTICLE_LIST', result.data)
      return result
    })
  },
  GET_POPULAR_ARTICLE_TAG ({ commit, dispatch, state }, parameter = {}) {
    // 获取热门文章标签
    return fetch({
      url: '/article-tag/popular-list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_POPULAR_ARTICLE_TAG', result.data.list)
      return result
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
