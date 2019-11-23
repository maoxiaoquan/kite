import http from '../../../utils/http'

export const getDynamicCommentList = (data, callback) => {
  return dispatch => {
    http.post('/dynamic-comment/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_DYNAMIC_COMMENT_LIST',
        data: res
      })
    })
  }
}

export const updateDynamicComment = (data, callback) => {
  return () => {
    http.post('/dynamic-comment/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteDynamicComment = (data, callback) => {
  return () => {
    http.post('/dynamic-comment/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
