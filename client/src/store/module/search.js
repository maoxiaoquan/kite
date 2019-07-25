import { fetch } from '@request'

const state = () => ({
  searchArticle: {
    article_list: [],
    count: 0,
    page: 1,
    pageSize: 25,
    search: '',
    tag_all: []
  }
})

const mutations = {
  SET_ARTICLE_SEARCH (state, data) {
    // 设置搜索的文章
    state.searchArticle = data
  }
}

const actions = {
  GET_ARTICLE_SEARCH ({ commit, dispatch, state }, parameter) {
    // 获取搜索的文章
    return fetch({
      url: '/article/search',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_SEARCH', result.data)
      return result
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
