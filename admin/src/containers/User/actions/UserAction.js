import http from '../../../utils/http'

export const get_user_list = (data, callback) => {
  return dispatch => {
    http.get('/user/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_USER_LIST',
        data: res
      })
    })
  }
}

export const edit_user = (data, callback) => {
  return () => {
    http.post('/user/edit', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const delete_user = (data, callback) => {
  return () => {
    http.post('/user/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const banUser = (data, callback) => {
  // 禁言用户
  return () => {
    http.post('/user/ban', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
