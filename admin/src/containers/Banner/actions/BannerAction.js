import http from '../../../utils/http'

export const get_banner_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/banner_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_BANNER_LIST', data: res })
    })
  }
}

export const create_banner = (data, callback) => {
  return (dispatch) => {
    http.post('/api/create_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_banner = (data, callback) => {
  return () => {
    http.post('/api/update_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_banner = (data, callback) => {
  return () => {
    http.post('/api/delete_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}
