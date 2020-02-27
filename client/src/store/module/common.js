import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  SET_ATTENTION({ commit, dispatch, state }, parameter) {
    // 设置关注
    return fetch({
      url: '/common/attention',
      method: 'post',
      parameter: parameter
    })
  },
  SET_LIKE({ commit, dispatch, state }, parameter) {
    // 设置喜欢
    return fetch({
      url: '/common/like',
      method: 'post',
      parameter: parameter
    })
  },
  SET_COLLECT({ commit, dispatch, state }, parameter) {
    // 设置收藏
    return fetch({
      url: '/common/collect',
      method: 'post',
      parameter: parameter
    })
  },
  SET_THUMB({ commit, dispatch, state }, parameter) {
    // 设置点赞
    return fetch({
      url: '/common/thumb',
      method: 'post',
      parameter: parameter
    })
  },
  GET_EXPERIENCE_LIST({ commit, dispatch, state }, parameter) {
    // 获取经验列表
    return fetch({
      url: '/experience/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GITHUB_OAUTN({ commit, dispatch, state }, parameter) {
    // 获取经验列表
    return fetch({
      url: '/oauth/github-login-oauth',
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
