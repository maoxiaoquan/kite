import { fetch } from '@request'

const state = () => ({
  article_tag_all: [],
  user_article_tag: [],
  subscribe: {
    article_tag_list: [],
    count: 0,
    page: 1,
    tag_name: '',
    pageSize: 25
  },
  tag: {
    article_tag: {},
    article_list: []
  }
})

const mutations = {
  SET_ARTICLE_TAG_ALL (state, data) { // 设置获取的文章tag 全部
    state.article_tag_all = data
  },
  SET_ARTICLE_TAG_LIST (state, data) { // 设置获取的文章tag 全部
    state.subscribe = data
  },
  SET_ARTICLE_TAG_SUBSCRIBE (state, data) { // 设置获取的文章tag 当前用户订阅的
    state.article_tag_list = data
  },
  SET_ARTICLE_TAG (state, data) { // 设置获取的文章tag
    state.tag = data
  },
  SET_MY_SUBSCRIBE_TAG_LIST (state, data) { // 设置获取当前用户订阅的
    state.user_article_tag = data
  }
}

const actions = {
  GET_ARTICLE_TAG_ALL ({ commit, dispatch, state }) { // 获取全部文章标签
    return fetch({
      url: '/article/tag/all',
      method: 'get',
      parameter: ''
    })
      .then(res => {
        commit('SET_ARTICLE_TAG_ALL', res.data.list)
      })
  },
  GET_ARTICLE_TAG_LIST: ({ commit, dispatch, state }, parameter) => { //  获取文章标签list
    return fetch({
      url: '/article/tag/list',
      method: 'get',
      parameter: { params: parameter }
    })
      .then(res => {
        commit('SET_ARTICLE_TAG_LIST', res.data)
      })
  },
  GET_ARTICLE_TAG: ({ commit, dispatch, state }, parameter) => { // 获取文章标签内容
    return fetch({
      url: '/article/tag',
      method: 'get',
      parameter: { params: parameter }
    })
      .then(res => {
        commit('SET_ARTICLE_TAG', res.data)
      })
  },
  SUBSCRIBE_TAG: ({ commit, dispatch, state }, parameter) => { // 获取文章标签内容
    return fetch({
      url: '/subscribe/tag',
      method: 'post',
      parameter: parameter
    })
  },
  MY_SUBSCRIBE_TAG_LIST: ({ commit, dispatch, state }, parameter) => { // 获取当前用户已订阅的标签
    return fetch({
      url: '/subscribe/tag/my',
      method: 'get',
      parameter: parameter
    })
      .then(res => {
        commit('SET_MY_SUBSCRIBE_TAG_LIST', res.data.subscribe_article_tag || [])
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
