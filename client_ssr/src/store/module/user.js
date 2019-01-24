import { fetch } from '@request'

const state = () => ({
  user: {}
})

const mutations = {
  SET_ARTICLE (state, data) { // 设置文章
    state.article = data
  }
}

const actions = {
  USER_ATTENTION ({ commit, dispatch, state }, parameter) { // 获取文章
    return fetch({
      url: '/user/attention',
      method: 'post',
      parameter: parameter
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
