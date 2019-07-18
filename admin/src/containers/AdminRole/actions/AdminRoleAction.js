import http from '../../../utils/http'

export const create_admin_role = (data, func) => {
  return dispatch => {
    http.post('/admin-role/create', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

export const get_admin_role_list = (data, func) => {
  return dispatch => {
    http.get('/admin-role/list', data).then(res => {
      if (func) {
        func(res)
      }
      return dispatch({
        type: 'GET_ADMIN_ROLE_LIST',
        data: res
      })
    })
  }
}

export const edit_admin_role = (data, func) => {
  return dispatch => {
    http.post('/admin-role/edit', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

export const set_admin_role_authority = (data, func) => {
  return dispatch => {
    http.post('/admin-role-authority/set', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}

/* 删除角色 */
export const delete_admin_role = (data, func) => {
  return dispatch => {
    http.post('/admin-role/delete', data).then(res => {
      if (func) {
        func(res)
      }
    })
  }
}
