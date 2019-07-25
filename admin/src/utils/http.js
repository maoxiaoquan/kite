import axios from 'axios'
import qs from 'qs'
import alerts from './alert'
// import store from '../store'
// const CSRFToken = getCSRFToken() /sdf www.xilongx.com/sdf

const http = axios.create({
  baseURL: '/api-admin/v1',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})

/* 稳定背后的代价，是我们在消耗自己未来的可能性。 */

http.interceptors.request.use(config => {
  if (localStorage.box_tokens) {
    config.headers['x-access-token'] = localStorage.box_tokens
  }
  /* if (config.method === 'post') {
    const data = config.data || {}
    config.data = qs.stringify(data)
  } */
  return config
})

http.interceptors.response.use(
  response => {
    const data = response.data
    if (response.config.direct) {
      // 直接返回 data，不进行后续处理
      return data
    }

    if (!data.is_login) {
      alerts.message_warning(data.message)
      location.replace('#/sign_in')
      return false
    }

    if (data.state === 'error') {
      alerts.message_warning(data.message)
      return Promise.reject(new Error(data.message))
    } else {
      return data.data
    }
  },
  function (error) {
    console.warn(error)
    alerts.message_warning('服务器正忙，请稍后重试!')
    return Promise.reject(new Error('服务器正忙!'))
  }
)

export default http
