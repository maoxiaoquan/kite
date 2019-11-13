import { fetch } from '@request'
import { gqlfetch } from '@fetch'
import gql from 'graphql-tag'

const state = () => ({
  article: {},
  test: {}
})

const mutations = {
  SET_ARTICLE (state, data) {
    // 设置文章
    state.article = data
  },
  GET_TEST (state, data) {
    state.test = data
  }
}

const actions = {
  GET_ARTICLE ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/article',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE', result.data.article)
      return result
    })
  },
  GET_TEST ({ commit, dispatch, state }, parameter) {
    console.log(111111111111111111)
    return gqlfetch({
      parameter: `
        query {
          hello
        }
        `
    }).then(result => {
      commit('GET_TEST', result.data)
      return result
    })
  },
  GET_USER_INFO_ALL ({ commit, dispatch, state }, parameter) {
    // 获取用户信息
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
