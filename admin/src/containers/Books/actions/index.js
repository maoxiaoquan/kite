import http from '../../../utils/http'

export const getBooksList = (data, callback) => {
  return dispatch => {
    http.post('/books/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_BOOKS_LIST',
        data: res
      })
    })
  }
}

export const updateBooks = (data, callback) => {
  return () => {
    http.post('/books/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteBooks = (data, callback) => {
  return () => {
    http.post('/books/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
