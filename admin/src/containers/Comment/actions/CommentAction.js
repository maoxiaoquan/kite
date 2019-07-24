import http from '../../../utils/http'

export const getCommentList = (data, callback) => {
  return (dispatch) => {
    http.post('/comment/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_COMMENT_LIST',
          data: res
        })
      })
  }
}

export const updateComment = (data, callback) => {
  return () => {
    http.post('/comment/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const deleteComment = (data, callback) => {
  return () => {
    http.post('/comment/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
