import http from '../../../utils/http'

export const getDynamicList = (data, callback) => {
  return dispatch => {
    http.post('/dynamic/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_DYNAMIC_LIST',
        data: res
      })
    })
  }
}

export const editDynamic = (data, callback) => {
  return () => {
    http.post('/dynamic/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteDynamic = (data, callback) => {
  return () => {
    http.post('/dynamic/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const getDynamicTopicAll = (data, callback) => {
  return () => {
    http.get('/dynamic-topic/all', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
