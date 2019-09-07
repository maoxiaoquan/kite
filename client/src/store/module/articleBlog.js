import { fetch } from '@request'

const state = () => ({
  blogs: {
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
