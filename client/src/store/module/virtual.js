import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  GET_VIRTUAL_LIST ({ commit, dispatch, state }, parameter) {
    // 获取用户信息
    return fetch({
      url: '/virtual/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  CHECK_IN ({ commit, dispatch, state }, parameter) {
    // 签到获取积分
    return fetch({
      url: '/virtual/check-in',
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
