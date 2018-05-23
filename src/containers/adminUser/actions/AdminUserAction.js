import http from '../../../utils/http'

export const get_admin_user = (data, func) => {
  return (dispatch) => {
    http.get('/api/get_user', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
      return dispatch({type: 'GET_ADMIN_USER_LIST', data: res})
    })
  }
}
