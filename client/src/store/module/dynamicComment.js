import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  DYNAMIC_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取动态评论列表
    return fetch({
      url: '/dynamic-comment/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  DYNAMIC_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
    // 获取动态评论列表
    return fetch({
      url: '/dynamic-comment/create',
      method: 'post',
      parameter: parameter
    })
  },
  DYNAMIC_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
    // 获取动态评论列表
    return fetch({
      url: '/dynamic-comment/delete',
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
