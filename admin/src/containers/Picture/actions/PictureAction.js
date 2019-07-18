import http from '../../../utils/http'

export const get_picture_list = (data, callback) => {
  return (dispatch) => {
    http.get('/picture/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_PICTURE_LIST',
          data: res
        })
      })
  }
}

export const create_picture = (data, callback) => {
  return (dispatch) => {
    http.post('/picture/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const update_picture = (data, callback) => {
  return () => {
    http.post('/picture/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const delete_picture = (data, callback) => {
  return () => {
    http.post('/picture/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
