import { fetch } from '@request'

const state = () => ({
  blogs: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  blogInfo: {
    // blog 详细信息
  },
  blogArticleList: {
    // blog 所含有的文章列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  likeBlogArticleList: {
    // blog 所含有的文章列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  }
})

const mutations = {
  SET_ARTICLE_BLOG_LIST (state, data) {
    // 设置文章专栏列表
    state.blogs = data
  },
  SET_ARTICLE_BLOG_INFO (state, data) {
    // 设置个人专栏详细信息
    state.blogInfo = data
  },
  SET_ARTICLE_BLOG_ARTICLE_LIST (state, data) {
    // 设置个人专栏含有的文章列表
    state.blogArticleList = data
  },
  SET_LIKE_ARTICLE_BLOG_LIST (state, data) {
    // 设置个人like的个人专栏列表
    state.likeBlogArticleList = data
  }
}

const actions = {
  GET_ARTICLE_BLOG_LIST ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/article-blog/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_BLOG_LIST', result.data)
      return result
    })
  },
  UPLOAD_ARTICLE_BLOG_IMG ({ commit, dispatch, state }, parameter) {
    // 上传用户头像
    return fetch({
      url: '/article-blog/upload-img',
      method: 'post',
      parameter: parameter
    })
  },
  GET_ARTICLE_BLOG_INFO ({ commit, dispatch, state }, parameter) {
    // 获取个人专栏信息
    return fetch({
      url: '/article-blog/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_BLOG_INFO', result.data.articleBlog)
      return result
    })
  },
  GET_ARTICLE_BLOG_ARTICLE_LIST ({ commit, dispatch, state }, parameter) {
    // 获取个人专栏所含有的文章
    return fetch({
      url: '/article-blog/article-list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_ARTICLE_BLOG_ARTICLE_LIST', result.data)
      return result
    })
  },
  LIKE_ARTICLE_BLOG ({ commit, dispatch, state }, parameter) {
    // 个人专栏like
    return fetch({
      url: '/article-blog/like',
      method: 'post',
      parameter
    })
  },
  GET_LIKE_ARTICLE_BLOG_LIST ({ commit, dispatch, state }, parameter) {
    // 获取个人like的个人专栏列表
    return fetch({
      url: '/article-blog/like-list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_LIKE_ARTICLE_BLOG_LIST', result.data)
      return result
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
