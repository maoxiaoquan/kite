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
    article_list: [],
    tag_id: '',
    count: 0,
    page: 1,
    pageSize: 25,
    subscribe_count: 0,
    tag_all: []
  }
})

const mutations = {
  SET_ARTICLE_TAG_ALL (state, data) {
    // 设置获取的文章tag 全部
    state.article_tag_all = data
  },
  SET_ARTICLE_TAG_LIST (state, data) {
    // 设置获取的文章tag 全部
    state.subscribe = data
  },
  SET_ARTICLE_TAG_SUBSCRIBE (state, data) {
    // 设置获取的文章tag 当前用户订阅的
    state.article_tag_list = data
  },
  SET_ARTICLE_TAG (state, data) {
    // 设置获取的文章tag
    state.tag = data
  },
  SET_MY_SUBSCRIBE_TAG_LIST (state, data) {
    // 设置获取当前用户订阅的
    state.user_article_tag = data
  }
}

const actions = {
  GET_ARTICLE_TAG_ALL ({ commit, dispatch, state }) {
    // 获取全部文章标签
    return fetch({
      url: '/article-tag/all',
      method: 'get',
      parameter: ''
    }).then(result => {
      commit('SET_ARTICLE_TAG_ALL', result.data.list)
      return result
    })
  },
  GET_ARTICLE_TAG_LIST: ({ commit, dispatch, state }, parameter) => {
    //  获取文章标签list
    let url =
      parameter.tag_type === 'all'
        ? '/article-tag/list'
        : '/article-tag/list-my'
    return fetch({
      url,
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_TAG_LIST', result.data)
      return result
    })
  },
  GET_ARTICLE_TAG: ({ commit, dispatch, state }, parameter) => {
    // 获取文章标签内容
    return fetch({
      url: '/article-tag',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_TAG', result.data)
      return result
    })
  },
  MY_SUBSCRIBE_TAG_LIST: ({ commit, dispatch, state }, parameter) => {
    // 获取当前用户已订阅的标签
    return fetch({
      url: '/subscribe/tag-my',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit(
        'SET_MY_SUBSCRIBE_TAG_LIST',
        result.data.subscribe_article_tag || []
      )
      return result
    })
  }
}

const getters = {
  userArticleTag: state => {
    return state.user_article_tag
      ? state.user_article_tag.map(result => {
        return result.associate_id
      })
      : []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
