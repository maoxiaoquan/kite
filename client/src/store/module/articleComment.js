import { fetch } from '@request'

const state = () => ({
  article_comment: {
    comment_list: [],
    count: 0,
    page: 1,
    pageSize: 10
  }
})

const mutations = {
  SET_ARTICLE_COMMENT_UNSHIFT (state, data) {
    // 追加评论
    state.article_comment.comment_list.unshift(data)
  },
  SET_ARTICLE_COMMENT_LIST (state, data) {
    // 设置评论列表
    state.article_comment = data
  },
  SET_ARTICLE_COMMENT_COUNT_ADD (state, data) {
    // 追加评论
    state.article_comment.count = state.article_comment.count + 1
  }
}

const actions = {
  ARTICLE_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取文章评论列表
    return fetch({
      url: '/article/comment-list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_COMMENT_LIST', result.data || [])
      return result
    })
  },
  ARTICLE_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
    // 获取文章评论列表
    return fetch({
      url: '/article/comment-create',
      method: 'post',
      parameter: parameter
    })
  },
  ARTICLE_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
    // 获取文章评论列表
    return fetch({
      url: '/article/comment-delete',
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
