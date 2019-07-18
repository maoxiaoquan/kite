import http from '../../../utils/http'

export const get_banner_list = (data, callback) => {
  return (dispatch) => {
    http.get('/banner/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_BANNER_LIST',
          data: res
        })
      })
  }
}

export const create_banner = (data, callback) => {
  return (dispatch) => {
    http.post('/banner/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const update_banner = (data, callback) => {
  return () => {
    http.post('/banner/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const delete_banner = (data, callback) => {
  return () => {
    http.post('/banner/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
