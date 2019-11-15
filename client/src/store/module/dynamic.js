import { fetch } from '@request'

const state = () => ({
  dynamicTopicIndex: [], // 首页侧栏导航话题
  dynamicTopicList: [], // 专题页所有话题列表
  dynamicList: {
    count: 0,
    list: [],
    page: 1,
    pageSize: 10
  }, // 动态列表
  dynamicView: {},
  recommendDynamicList: [] // 专推荐动态列表
})

const mutations = {
  SET_DYNAMIC_TOPIC_INDEX (state, data) {
    // 设置首页侧栏导航话题
    state.dynamicTopicIndex = data
  },
  SET_DYNAMIC_TOPIC_LIST (state, data) {
    // 所有话题列表
    state.dynamicTopicList = data
  },
  INIT_DYNAMIC_LIST (state, data) {
    // 重置动态列表
    state.dynamicList = { count: 0, list: [], page: 1, pageSize: 10 }
  },
  SET_DYNAMIC_LIST (state, data) {
    const { count, list, page, pageSize } = data
    let _list = state.dynamicList.list || []
    // 设置动态列表
    state.dynamicList = { count, page, pageSize }
    state.dynamicList.list = [..._list, ...list]
  },
  SET_DYNAMIC_VIEW (state, data) {
    // 设置动态内容
    state.dynamicView = data
  },
  SET_RECOMMEND_DYNAMIC_LIST (state, data) {
    // 设置推荐动态列表
    state.recommendDynamicList = data
  }
}

const actions = {
  GET_DYNAMIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取动态列表
    return fetch({
      url: '/dynamic/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      if (parameter.isCommit) {
        commit('SET_DYNAMIC_LIST', result.data)
      }
      return result
    })
  },
  GET_DYNAMIC_LIST_ME ({ commit, dispatch, state }, parameter) {
    // 获取自己动态列表
    return fetch({
      url: '/dynamic/list-my',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_LIST', result.data)
      return result
    })
  },
  CREATE_DYNAMIC ({ commit, dispatch, state }, parameter) {
    // 创建动态
    return fetch({
      url: '/dynamic/create',
      method: 'post',
      parameter
    }).then(result => {
      return result
    })
  },
  GET_DYNAMIC_VIEW ({ commit, dispatch, state }, parameter) {
    // 获取动态内容
    return fetch({
      url: '/dynamic/view',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_VIEW', result.data.dynamic)
      return result
    })
  },
  GET_RECOMMEND_DYNAMIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取推荐动态列表
    return fetch({
      url: '/dynamic/recommend-list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_RECOMMEND_DYNAMIC_LIST', result.data.list)
      return result
    })
  },
  UPLOAD_DYNAMIC_PICTURE: ({ commit, dispatch, state }, parameter) => {
    // 上传动态图片
    return fetch({
      url: '/dynamic/upload-dynamic-picture',
      method: 'post',
      parameter
    })
  },
  GET_DYNAMIC_TOPIC_INDEX ({ commit, dispatch, state }, parameter) {
    // 获取首页侧栏导航话题
    return fetch({
      url: '/dynamic-topic/index',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_INDEX', result.data.list)
      return result
    })
  },
  GET_DYNAMIC_TOPIC_LIST ({ commit, dispatch, state }, parameter) {
    // 获取首页全部话题
    return fetch({
      url: '/dynamic-topic/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_DYNAMIC_TOPIC_LIST', result.data.list)
      return result
    })
  },
  DELETE_DYNAMIC ({ commit, dispatch, state }, parameter) {
    // 动态
    return fetch({
      url: '/dynamic/delete',
      method: 'delete',
      parameter: { params: parameter }
    })
  },
  GET_DYNAMIC_TOPIC_INFO ({ commit, dispatch, state }, parameter) {
    // 动态
    return fetch({
      url: '/dynamic-topic/info',
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
