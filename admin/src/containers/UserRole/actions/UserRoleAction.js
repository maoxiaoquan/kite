import http from '../../../utils/http'

export const get_user_role_list = (data, callback) => {
  return (dispatch) => {
    http.get('/user-role/list', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
        return dispatch({
          type: 'GET_USER_ROLE_LIST',
          data: res
        })
      })
  }
}

export const get_user_role_all = (data, callback) => {
  return (dispatch) => {
    http.get('/user-role/all', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const create_user_role = (data, callback) => {
  return (dispatch) => {
    http.post('/user-role/create', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const update_user_role = (data, callback) => {
  return () => {
    http.post('/user-role/update', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const delete_user_role = (data, callback) => {
  return () => {
    http.post('/user-role/delete', data)
      .then((res) => {
        if (callback) {
          callback(res)
        }
      })
  }
}

export const set_user_role_authority = (data, func) => {
  return (dispatch) => {
    http.post('/user-role-authority/set', data)
      .then((res) => {
        if (func) {
          func(res)
        }
      })
  }
}
