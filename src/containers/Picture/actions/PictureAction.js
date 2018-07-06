import http from '../../../utils/http'

export const get_picture_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_picture_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_PICTURE_LIST', data: res })
    })
  }
}

export const create_picture = (data, callback) => {
  return (dispatch) => {
    http.post('/api/create_picture', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_picture = (data, callback) => {
  return () => {
    http.post('/api/update_picture', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_picture = (data, callback) => {
  return () => {
    http.post('/api/delete_picture', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}