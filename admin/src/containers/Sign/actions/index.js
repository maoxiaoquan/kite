import http from '../../../utils/http'
import { message } from 'antd'
import axios from 'axios'

export const sign_in = (data, func) => {
  return dispatch => {
    axios.post('/api-admin/v1/sign_in', data).then(res => {
      if (func) {
        func(res.data)
      }
    })
  }
}

export const sign_up = (data, func) => {
  return dispatch => {
    http.post('/api-admin/v1/admin-user/create', data).then(res => {
      if (func) {
        func(res.data)
      }
    })
  }
}
