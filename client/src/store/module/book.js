import { fetch } from '@request'

const state = () => ({
  bookInfo: {} // 小书章节信息
})

const mutations = {
  SET_BOOK_INFO (state, data) {
    // 设置小书列表
    state.bookInfo = data
  }
}

const actions = {
  UPLOAD_BOOK_IMG ({ commit, dispatch, state }, parameter) {
    // 上传小书封面图片
    return fetch({
      url: '/book/upload-book-picture',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_BOOK: ({ commit, dispatch, state }, parameter) => {
    // 创建小书章节
    return fetch({
      url: '/book/create',
      method: 'post',
      parameter: parameter
    })
  },
  GET_USER_BOOK_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取用户自己的小书章节
    return fetch({
      url: '/user-book/info',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  GET_BOOK_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取小书章节
    return fetch({
      url: '/book/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_BOOK_INFO', result.data.book)
      return result
    })
  },
  UPDATE_BOOK: ({ commit, dispatch, state }, parameter) => {
    // 更新小书章节
    return fetch({
      url: '/book/update',
      method: 'post',
      parameter: parameter
    })
  },
  DELETE_BOOK: ({ commit, dispatch, state }, parameter) => {
    // 删除小书章节
    return fetch({
      url: '/book/delete',
      method: 'post',
      parameter: parameter
    })
  },
  // 小书章节评论开始
  BOOK_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书章节评论列表
    return fetch({
      url: '/book-comment/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  BOOK_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
    // 获取小书章节评论列表
    return fetch({
      url: '/book-comment/create',
      method: 'post',
      parameter: parameter
    })
  },
  BOOK_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
    // 删除小书章节评论
    return fetch({
      url: '/book-comment/delete',
      method: 'post',
      parameter: parameter
    })
  },
  BOOK_NEXT_PREV ({ commit, dispatch, state }, parameter) {
    // 获取小书章节的上一篇，下一篇
    return fetch({
      url: '/book/next-prev',
      method: 'post',
      parameter: parameter
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
