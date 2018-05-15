import axios from 'axios'
import qs from 'qs'
import alerts from './alert'
// import store from '../store'
// const CSRFToken = getCSRFToken() /sdf www.xilongx.com/sdf

const http = axios.create({
  baseURL: '/',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})
http.interceptors.request.use(function (config) {
  if (config.method === 'post') {
    const data = config.data || {}
    if (localStorage.box_tokens) {
      config.headers['x-access-token'] = localStorage.box_tokens
    }
    config.data = qs.stringify(data)
  }
  return config
})

http.interceptors.response.use(function (response) {
  const data = response.data

  console.log(response.config.url, data)
  if (response.config.direct) { // 直接返回 data，不进行后续处理
    return data
  }

  if (!data.is_login) {
    alerts.message_warning(data.message)
    location.replace('#/sign_in');
    return false
  }
  
  console.log('接口:', response.config.url, data)

  return data
}, function (error) {
  console.log(error)
  alerts.message_warning('服务器正忙，请稍后重试!')
  return Promise.reject(new Error('服务器正忙!'))
})

export default http
