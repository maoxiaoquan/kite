import { fetch } from '@request'

export default {
  PERSONAL_INFO ({ commit, dispatch, state }, parameter = {}) { // 注册
    return fetch({
      url: '/personal/info',
      method: 'post',
      parameter: {
        accessToken: parameter.accessToken
      }
    })
      .then(res => {
        commit('SET_PERSONAL_INFO', res.data)
      })
  },
  GET_ARTICLE_COLUMN ({ commit, dispatch, state }) { // 获取文章专栏
    return fetch({
      url: '/article/column',
      method: 'get',
      parameter: ''
    })
      .then(res => {
        commit('SET_ARTICLE_COLUMN', res.data)
      })
  },
  GET_HOME_BANNER ({ commit, dispatch, state }) { // 获取HOME BANNER
    return fetch({
      url: '/banner/home',
      method: 'get',
      parameter: ''
    })
      .then(res => {
        commit('SET_HOME_BANNER', res.data)
      })
  },
  GET_ARTICLE_TAG ({ commit, dispatch, state }) { // 获取全部文章标签
    return fetch({
      url: '/article/tag',
      method: 'get',
      parameter: ''
    })
      .then(res => {
        commit('SET_ARTICLE_TAG', res.data)
      })
  },
  GET_INDEX_ARTICLE_LIST ({ commit, dispatch, state }) { // 获取首页 专栏页 文章列表
    return fetch({
      url: '/article/tag',
      method: 'get',
      parameter: ''
    })
      .then(res => {
        commit('SET_INDEX_ARTICLE_LIST', res.data)
      })
  }
}
