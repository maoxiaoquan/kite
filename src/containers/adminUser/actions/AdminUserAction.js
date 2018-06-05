import http from '../../../utils/http'
import axios from 'axios'

export const get_admin_user_list = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_admin_user_list', data).then((res) => {
      if (callback)
        callback(res)
      return dispatch({type: 'GET_ADMIN_USER_LIST', data: res})
    })
  }
}

export const create_admin_user = (data, callback) => {
  return () => {
    axios.post('/api/create_admin_user', data).then((res) => {
      if (callback)
        callback(res.data)
    })
  }
}

export const edit_admin_user = (data, callback) => {
  return () => {
    http.post('/api/edit_admin_user', data).then((res) => {
      if (callback)
        callback(res.data)
    })
  }
}

export const delete_admin_user = (data, callback) => {
  return () => {
    http.post('/api/delete_admin_user', data).then((res) => {
      if (callback)
        callback(res.data)
    })
  }
}

export const get_admin_role_all = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_admin_role_all', data).then((res) => {
      if (callback)
        callback(res.data)
      return dispatch({type: 'SET_ADMIN_ROlE_ALL', data: res})
    })
  }
}

export const create_admin_user_role = (data, callback) => {
  return (dispatch) => {
    http.post('/api/create_admin_user_role', data).then((res) => {
      if (callback)
        callback(res.data)
    })
  }
}

export const get_admin_user_role_all = (data, callback) => {
  return (dispatch) => {
    http.get('/api/get_admin_user_role_all', data).then((res) => {
      if (callback)
        callback(res.data)
      return dispatch({type: 'SET_ADMIN_USER_ROlE_ALL', data: res})
    })
  }
}

export const delete_admin_user_role = (data, callback) => {
  return () => {
    http.post('/api/delete_admin_user_role', data).then((res) => {
      if (callback)
        callback(res.data)
    })
  }
}