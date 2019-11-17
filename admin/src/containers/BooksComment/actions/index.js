import http from '../../../utils/http'

export const getCommentList = (data, callback) => {
  return dispatch => {
    http.post('/books-comment/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_BOOKS_COMMENT_LIST',
        data: res
      })
    })
  }
}

export const updateComment = (data, callback) => {
  return () => {
    http.post('/books-comment/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteComment = (data, callback) => {
  return () => {
    http.post('/books-comment/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
