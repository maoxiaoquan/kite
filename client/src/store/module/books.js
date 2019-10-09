import { fetch } from '@request'

const state = () => ({
  booksList: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  }
})

const mutations = {
  SET_BOOKS_LIST (state, data) {
    // 设置小书列表
    state.booksList = data
  }
}

const actions = {
  GET_BOOKS_LIST ({ commit, dispatch, state }, parameter) {
    // 获取文章
    return fetch({
      url: '/books/list',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_BOOKS_LIST', result.data)
      return result
    })
  },
  UPLOAD_BOOKS_COVER_IMG ({ commit, dispatch, state }, parameter) {
    // 上传小书封面图片
    return fetch({
      url: '/book/upload-books-picture',
      method: 'post',
      parameter: parameter
    })
  },
  CREATE_BOOKS: ({ commit, dispatch, state }, parameter) => {
    // 创建小书
    return fetch({
      url: '/books/create',
      method: 'post',
      parameter: parameter
    })
  },
  GET_USER_BOOKS_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取用户自己的小书
    return fetch({
      url: '/books/user-info',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  UPDATE_BOOKS: ({ commit, dispatch, state }, parameter) => {
    // 更新小书
    return fetch({
      url: '/books/update',
      method: 'post',
      parameter: parameter
    })
  },
  DELETE_BOOKS: ({ commit, dispatch, state }, parameter) => {
    // 删除小书
    return fetch({
      url: '/books/delete',
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
