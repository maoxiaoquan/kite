import http from '../../../utils/http'

export const getPictureList = (data, callback) => {
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

export const createPicture = (data, callback) => {
  return (dispatch) => {
    http.post('/picture/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const updatePicture = (data, callback) => {
  return () => {
    http.post('/picture/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const deletePicture = (data, callback) => {
  return () => {
    http.post('/picture/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}
