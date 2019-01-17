import http from '../../../utils/http'

export const get_user_tag_list = (data, callback) => {
  return (dispatch) => {
    http.get('/get_user_tag_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({type: 'GET_USER_TAG_LIST', data: res})
    })
  }
}

export const get_user_tag_all = (data, callback) => {
  return (dispatch) => {
    http.get('/get_user_tag_all', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const create_user_tag = (data, callback) => {
  return (dispatch) => {
    http.post('/create_user_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_user_tag = (data, callback) => {
  return () => {
    http.post('/update_user_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_user_tag = (data, callback) => {
  return () => {
    http.post('/delete_user_tag', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}
