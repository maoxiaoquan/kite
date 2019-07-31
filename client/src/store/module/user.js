import { fetch } from '@request'

const state = () => ({
  user_info: {
    // 用户的信息
    attention_uid_arr: [],
    other_user_attention_count: 0,
    subscribe_article_tag_id_arr: [],
    user_article_count: 0,
    user_attention_other_count: 0,
    user_info: {},
    user_like_aid_arr: [],
    user: {
      avatar: '',
      introduction: '',
      nickname: '',
      sex: 0,
      uid: 0,
      user_role_ids: ''
    }
  },
  user_article_blog: [], // 用户的文章专题
  my_article: {
    // 用户的文章
    article_list: [],
    count: 0,
    page: 1,
    pageSize: 10
  },
  user_attention: {
    // 用户关注用户
    any: 'me',
    count: 0,
    me_attention: [],
    other_attention: [],
    page: 1,
    pageSize: 10,
    user_list: []
  },
  user_like_article: {
    // 用户like文章
    article_list: [],
    count: 1,
    page: 1,
    pageSize: 10
  },
  user_message: {
    // 用户消息
    user_message_list: [],
    count: 1,
    page: 1,
    pageSize: 10
  },
  user_aside: {
    // 侧栏
    user_role_all: []
  },
  unread_message_count: 0 // 用户未读
})

const mutations = {
  SET_USER_INFO_ALL (state, data) {
    // 获取用户的全部信息
    state.user_info = data
  },
  SET_USER_ARTICLE_BLOG (state, data) {
    // 设置获取的文章专题
    state.user_article_blog = data.list
  },
  SET_MY_ARTICLE_LIST (state, data) {
    // 设置获取用户的文章
    state.my_article = data
  },
  SET_USER_ATTENTION_LIST (state, data) {
    // 用户关注用户
    state.user_attention = data
  },
  SET_USER_LIKE_ARTICLE_LIST (state, data) {
    // 用户like文章
    state.user_like_article = data
  },
  SET_USER_MESSAGE (state, data) {
    // 用户消息
    state.user_message = data
  },
  SET_USER_ROLE_ALL (state, data) {
    // 用户标签全部
    state.user_aside.user_role_all = data.user_role_all
  },
  SET_UNREAD_MESSAGE_COUNT (state, data) {
    // 用户消息数量
    state.unread_message_count = data
  }
}

const actions = {
  USER_ATTENTION ({ commit, dispatch, state }, parameter) {
    // 用户关注用户
    return fetch({
      url: '/user/attention',
      method: 'post',
      parameter: parameter
    })
  },
  USER_LIKE_ARTICLE ({ commit, dispatch, state }, parameter) {
    // 用户喜欢文章
    return fetch({
      url: '/user/like-article',
      method: 'post',
      parameter: parameter
    })
  },
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
  GET_USER_ARTICLE_BLOG: ({ commit, dispatch, state }, { uid }) => {
    // 获取文章专题 all
    return fetch({
      url: '/user/blog-all',
      method: 'get',
      parameter: { params: { uid } }
    }).then(result => {
      commit('SET_USER_ARTICLE_BLOG', result.data)
      return result
    })
  },
  CREATE_ARTICLE_BLOG: ({ commit, dispatch, state }, data) => {
    // 创建用户个人文章专题
    return fetch({
      url: '/personal/create_article_blog',
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
    }).then(result => {
      commit('SET_MY_ARTICLE_LIST', result.data)
      return result
    })
  },
  GET_USER_ATTENTION_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户关注
    return fetch({
      url: '/user/attention-list',
      method: 'get',
      parameter: { params: data }
    }).then(result => {
      commit('SET_USER_ATTENTION_LIST', result.data)
      return result
    })
  },
  GET_USER_LIKE_ARTICLE_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户like
    return fetch({
      url: '/user/like-article-list',
      method: 'get',
      parameter: { params: data }
    }).then(result => {
      commit('SET_USER_LIKE_ARTICLE_LIST', result.data)
      return result
    })
  },
  GET_USER_MESSAGE_LIST: ({ commit, dispatch, state }, data) => {
    // 获取用户消息
    return fetch({
      url: '/personal/message-list',
      method: 'get',
      parameter: { params: data }
    }).then(result => {
      commit('SET_USER_MESSAGE', result.data)
      return result
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
