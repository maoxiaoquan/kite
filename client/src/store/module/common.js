import { fetch } from '@request'
import { gqlfetch } from '@fetch'

const state = () => ({})

const mutations = {}

const actions = {
  GET_TEST ({ commit, dispatch, state }, parameter) {
    return gqlfetch({
      parameter: `
          query {
            articleList { 
              list {
                aid
                title
              }
            }
          }
        `
    })
  },
  SET_ATTENTION ({ commit, dispatch, state }, parameter) {
    // 设置关注
    return fetch({
      url: '/common/attention',
      method: 'post',
      parameter: parameter
    })
  },
  SET_LIKE ({ commit, dispatch, state }, parameter) {
    // 设置喜欢
    return fetch({
      url: '/common/like',
      method: 'post',
      parameter: parameter
    })
  },
  SET_COLLECT ({ commit, dispatch, state }, parameter) {
    // 设置收藏
    return fetch({
      url: '/common/collect',
      method: 'post',
      parameter: parameter
    })
  },
  SET_THUMB ({ commit, dispatch, state }, parameter) {
    // 设置点赞
    return fetch({
      url: '/common/thumb',
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
