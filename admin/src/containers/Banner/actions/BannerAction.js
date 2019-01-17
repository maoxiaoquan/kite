import http from '../../../utils/http'

export const get_banner_list = (data, callback) => {
  return (dispatch) => {
    http.get('/banner_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({ type: 'GET_BANNER_LIST', data: res })
    })
  }
}

export const create_banner = (data, callback) => {
  return (dispatch) => {
    http.post('/create_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const update_banner = (data, callback) => {
  return () => {
    http.post('/update_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}

export const delete_banner = (data, callback) => {
  return () => {
    http.post('/delete_banner', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}
