import axios from 'axios'
import qs from 'qs'
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
    config.data = qs.stringify(data)
  }
  return config
})

http.interceptors.response.use(function (response) {
  const data = response.data
  console.log('接口:', response.config.url, data)
  return data
}, function (error) {
  console.log(error)
  alert('服务器正忙，请稍后重试!')
  return Promise.reject(new Error('服务器正忙!'))
})

export default http
