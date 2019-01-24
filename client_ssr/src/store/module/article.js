import { fetch } from '@request'

const state = () => ({
  article: {}
})

const mutations = {
  SET_ARTICLE (state, data) { // 设置文章
    state.article = data
  }
}

const actions = {
  GET_ARTICLE ({ commit, dispatch, state }, parameter) { // 获取文章
    return fetch({
      url: '/article',
      method: 'get',
      parameter: { params: parameter }
    })
      .then(res => {
        commit('SET_ARTICLE', res.data.article)
      })
  },
  GET_USER_INFO_ALL ({ commit, dispatch, state }, parameter) { // 获取文章
    return fetch({
      url: '/user/info',
      method: 'get',
      parameter: { params: parameter }
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
