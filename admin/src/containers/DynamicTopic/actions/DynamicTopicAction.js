import http from '../../../utils/http'

export const getDynamicTopicList = (data, callback) => {
  return dispatch => {
    http.get('/dynamic-topic/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_DYNAMIC_TOPICS_LIST',
        data: res
      })
    })
  }
}

export const createDynamicTopic = (data, callback) => {
  return dispatch => {
    http.post('/dynamic-topic/create', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const updateDynamicTopic = (data, callback) => {
  return () => {
    http.post('/dynamic-topic/update', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteDynamicTopic = (data, callback) => {
  return () => {
    http.post('/dynamic-topic/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
