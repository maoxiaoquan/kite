import http from '../../../utils/http'

export const get_admin_system_log_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_admin_system_log_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({type: 'GET_ADMIN_SYSTEM_LOG_LIST', data: res})
    })
  }
}


export const delete_admin_system_log = (data, callback) => {
  return () => {
    http.post('/api/delete_admin_system_log', data).then((res) => {
      if (callback)
        callback(res)
    })
  }
}