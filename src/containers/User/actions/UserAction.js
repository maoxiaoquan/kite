import http from '../../../utils/http'

export const get_user_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_user_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_USER_LIST', data: res })
    })
  }
}

export const edit_user = (data, callback) => {
  return () => {
    http.post('/api/edit_user', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}