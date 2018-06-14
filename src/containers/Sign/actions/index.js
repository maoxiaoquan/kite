import http from '../../../utils/http'
import { message } from 'antd';
import axios from 'axios'
export const sign_in = (data, func) => {
  return (dispatch) => {
    axios.post('/api/sign_in', data).then((res) => {
      if (func)
      func(res.data)
    })
  }
}

export const sign_up = (data, func) => {
  return () => {
    http.post('/api/create_admin_user', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res.data)
    })
  }
}