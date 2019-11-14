import { fetch } from '@request'

const state = () => ({
  otherUserAttentionCount: 0,
  userArticleCount: 0,
  userAttentionCount: 0,
  dynamicCount: 0,
  allLikeDymaicId: [], // 关注的所有动态ID
  allRssDynamicTopicId: [], // 订阅的所有动态话题ID
  user_info: {},
  user: {},
  user_article_blog: [], // 用户的文章专题
  user_aside: {
    // 侧栏
    user_role_all: []
  },
  messageCount: 0 // 用户未读
})

const mutations = {
  SET_USER_INFO_ALL (state, data) {
    // 获取用户的全部信息
    state.otherUserAttentionCount = data.otherUserAttentionCount
    state.userArticleCount = data.userArticleCount
    state.userAttentionCount = data.userAttentionCount
    state.dynamicCount = data.dynamicCount
    state.allLikeDymaicId = data.allLikeDymaicId // 关注的所有动态ID
    state.allRssDynamicTopicId = data.allRssDynamicTopicId // 订阅的所有动态话题ID
    state.user_info = data.user_info
    state.user = data.user
  },
  SET_USER_ARTICLE_BLOG_ALL (state, data) {
    // 设置获取的全部的个人文章专栏
    state.user_article_blog = data.list
  },
  SET_USER_ROLE_ALL (state, data) {
    // 用户标签全部
    state.user_aside.user_role_all = data.user_role_all
  },
  SET_UNREAD_MESSAGE_COUNT (state, data) {
    // 用户消息数量
    state.messageCount = data
  }
}

const actions = {
  GET_USER_INFO_ALL ({ commit, dispatch, state }, parameter) {
    // 获取用户信息
    return fetch({
      url: '/user/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_USER_INFO_ALL', result.data)
      return result
    })
  },
  GET_USER_ARTICLE_BLOG_ALL: ({ commit, dispatch, state }, { uid }) => {
    // 获取文章专题 all
    return fetch({
      url: '/user/blog-all',
      method: 'get',
      parameter: { params: { uid } }
    }).then(result => {
      commit('SET_USER_ARTICLE_BLOG_ALL', result.data)
      return result
    })
  },
  CREATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 创建用户个人文章专题
    return fetch({
      url: '/personal/create-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  UPDATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 更新用户个人文章专题
    return fetch({
      url: '/personal/update-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  DELETE_ARTICLE: ({ commit, dispatch, state }, data) => {
    // 删除用户个人文章专题
    return fetch({
      url: '/article/delete',
      method: 'delete',
      parameter: { params: data }
    })
  },
  DELETE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 删除用户个人文章专题
    return fetch({
      url: '/personal/delete-article-blog',
      method: 'post',
      parameter: { ...data }
    })
  },
  USER_MY_ARTICLE: ({ commit, dispatch, state }, data) => {
    // 获取用户自己的文章
    return fetch({
      url: '/user/my-article',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_USER_ATTENTION_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户关注
    return fetch({
      url: '/user/attention-list',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_USER_LIKE_ARTICLE_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户like
    return fetch({
      url: '/user/like-article-list',
      method: 'get',
      parameter: { params: data }
    })
  },
  GET_USER_MESSAGE_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户消息
    return fetch({
      url: '/personal/message-list',
      method: 'get',
      parameter: { params: data }
    })
  },
  DELETE_USER_MESSAGE: ({ commit, dispatch, state }, data) => {
    // 删除用户消息
    return fetch({
      url: '/personal/message-delete',
      method: 'delete',
      parameter: { params: data }
    })
  },
  GET_USER_ROLE_ALL: ({ commit, dispatch, state }, data) => {
    // 获取所有用户标签
    return fetch({
      url: '/user/role-all',
      method: 'get',
      parameter: { params: data }
    }).then(result => {
      commit('SET_USER_ROLE_ALL', result.data)
      return result
    })
  },
  GET_UNREAD_MESSAGE_COUNT: ({ commit, dispatch, state }, data) => {
    // 获取用户未读消息数量
    return fetch({
      url: '/personal/unread-message-count',
      method: 'get',
      parameter: { params: data }
    }).then(result => {
      commit('SET_UNREAD_MESSAGE_COUNT', result.data)
      return result
    })
  },
  GET_PERSONAL_DYNAMIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取动态列表
    return fetch({
      url: '/personal/dynamic-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_USER_ARTICLE_BLOG_LIST ({ commit, dispatch, state }, parameter) {
    // 获取用户的个人专栏列表
    return fetch({
      url: '/personal/article-blog-list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_BOOKS_LIST ({ commit, dispatch, state }, parameter) {
    // 获取用户的个人专栏列表
    return fetch({
      url: '/personal/books-list',
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
