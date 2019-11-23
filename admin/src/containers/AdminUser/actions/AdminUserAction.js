import http from '../../../utils/http'
import axios from 'axios'

export const getAdminUserList = (data, callback) => {
  return dispatch => {
    http.get('/admin-user/list', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'GET_ADMIN_USER_LIST',
        data: res
      })
    })
  }
}

export const createAdminUser = (data, callback) => {
  return () => {
    http.post('/admin-user/create', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const editAdminUser = (data, callback) => {
  return () => {
    http.post('/admin-user/edit', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const deleteAdminUser = (data, callback) => {
  return () => {
    http.post('/admin-user/delete', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}

export const getAdminRoleAll = (data, callback) => {
  return dispatch => {
    http.get('/admin-role/all', data).then(res => {
      if (callback) {
        callback(res)
      }
      return dispatch({
        type: 'SET_ADMIN_ROlE_ALL',
        data: res
      })
    })
  }
}

export const createAdminUserRole = (data, callback) => {
  return dispatch => {
    http.post('/admin-user-role/create', data).then(res => {
      if (callback) {
        callback(res)
      }
    })
  }
}
