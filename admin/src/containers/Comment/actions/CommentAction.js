import http from '../../../utils/http'

export const get_comment_list = (data, callback) => {
  return (dispatch) => {
    http.post('/get_comment_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({type: 'GET_COMMENT_LIST', data: res})
    })
  }
}


export const update_comment = (data, callback) => {
  return () => {
    http.post('/update_comment', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_comment = (data, callback) => {
  return () => {
    http.post('/delete_comment', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}
