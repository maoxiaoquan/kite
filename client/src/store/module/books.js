import { fetch } from '@request'

const state = () => ({
  booksList: {
    // blog 信息列表
    count: 0,
    list: [],
    page: 1,
    pageSize: 25
  },
  booksInfo: {
    cover_img: ''
  }, // 小书的信息
  booksBookAll: [] // 小书的所有章节
})

const mutations = {
  SET_BOOKS_LIST (state, data) {
    // 设置小书列表
    state.booksList = data
  },
  SET_BOOKS_INFO (state, data) {
    // 设置小书列表
    state.booksInfo = data
  },
  SET_BOOKS_BOOK_ALL (state, data) {
    // 设置小书所有的章节
    state.booksBookAll = data
  }
}

const actions = {
  GET_BOOKS_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书
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
      url: '/books/upload-books-picture',
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
      url: '/user-books/info',
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
  },
  GET_BOOKS_INFO: ({ commit, dispatch, state }, parameter) => {
    // 获取小书
    return fetch({
      url: '/books/info',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_BOOKS_INFO', result.data.books)
      return result
    })
  },
  GET_BOOKS_BOOK_ALL: ({ commit, dispatch, state }, parameter) => {
    // 获取小书的所有章节列表
    return fetch({
      url: '/books/book-all',
      method: 'get',
      parameter: { params: parameter }
    }).then(result => {
      commit('SET_BOOKS_BOOK_ALL', result.data.list)
      return result
    })
  },
  // 小书评论开始
  BOOKS_COMMENT_LIST ({ commit, dispatch, state }, parameter) {
    // 获取小书评论列表
    return fetch({
      url: '/books-comment/list',
      method: 'get',
      parameter: { params: parameter }
    })
  },
  BOOKS_COMMENT_CREATE ({ commit, dispatch, state }, parameter) {
    // 获取小书评论列表
    return fetch({
      url: '/books-comment/create',
      method: 'post',
      parameter: parameter
    })
  },
  BOOKS_COMMENT_DELETE ({ commit, dispatch, state }, parameter) {
    // 删除小书评论
    return fetch({
      url: '/books-comment/delete',
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
