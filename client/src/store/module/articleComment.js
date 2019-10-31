import { fetch } from '@request'

const state = () => ({})

const actions = {
  ARTICLE_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取文章评论列表
    return fetch({
      url: '/article/comment-list',
      method: 'get',
      parameter: { params: parameter }
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
    // 删除文章评论
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
  actions,
  getters
}
