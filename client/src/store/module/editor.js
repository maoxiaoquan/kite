import { fetch } from '@request'

const state = () => ({})

const mutations = {}

const actions = {
  GET_USER_BLOG: ({ commit, dispatch, state }, { uid }) => {
    // 获取文章专题
    return fetch({
      url: '/user/blog-all',
      method: 'get',
      parameter: { params: { uid } }
    })
  },
  CREATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/personal/create-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  UPLOAD_ARTICLE_PICTURE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/article/upload-article-picture',
      method: 'post',
      parameter: data
    })
  },
  SAVE_ARTICLE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/article/create',
      method: 'post',
      parameter: data
    })
  },
  GET_USER_ARTICLE ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/user-article',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  UPDATE_ARTICLE: ({ commit, dispatch, state }, data) => {
    return fetch({
      url: '/article/update',
      method: 'put',
      parameter: data
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
