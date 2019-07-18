import http from '../../../utils/http'

export const GetOptionsList = (data, callback) => {
  return dispatch => {
    http.get('/options/list', { params: { ...data } }).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type:
          data.option_key === 'advertise'
            ? 'SET_WEBSITE_CONFIG_ADVERTISE'
            : 'SET_WEBSITE_CONFIG_NOTICE',
        data: res
      })
    })
  }
}

export const CreateOptions = (data, callback) => {
  return dispatch => {
    http.post('/options/create', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const UpdateOptions = (data, callback) => {
  return dispatch => {
    http.post('/options/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const DeleteOptions = (data, callback) => {
  return dispatch => {
    http.post('/options/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
