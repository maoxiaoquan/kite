import http from '../../../utils/http'

export const create_admin_role = (data, func) => {
  return (dispatch) => {
    http.post('/api/create_admin_role', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
    })
  }
}

export const get_admin_role_list = (data, func) => {
  return (dispatch) => {
    http.get('/api/get_admin_role_list', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
      return dispatch({type: 'GET_ADMIN_ROLE_LIST', data: res})
    })
  }
}