import http from '../../../utils/http'

export const getBookList = (data, callback) => {
  return dispatch => {
    http.post('/book/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_BOOK_LIST',
        data: res
      })
    })
  }
}

export const updateBook = (data, callback) => {
  return () => {
    http.post('/book/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteBook = (data, callback) => {
  return () => {
    http.post('/book/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
