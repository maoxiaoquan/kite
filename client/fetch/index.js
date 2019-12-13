// 通过webpack 打包时判断客户端请求和服务端请求的不同
// requestClient 客户端会打包这个 中url为空所以不会添加url前缀
// requestServer 服务端会打包这个 中url --
// process.env.NODE_ENV === 'production' 添加开发时的url client_dev 端口前缀
// 或者 生产环境的 product 端口前缀

/* 所有请求必须调用这里 此处的请求对服务端和客户端的请求做了处理 */

import { fetchConfig } from 'fetch-config'
import axios from 'axios'

const api = fetchConfig()

const logRequests =
  process.env.NODE_ENV === 'development' || !!process.env.DEBUG_API

const service = axios.create({
  headers: {
    'access-token': api.accessToken || ''
  }
})

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer) {
  warmCache()
}

function warmCache () {
  // fetchItems((api.cachedIds.top || []).slice(0, 30))
  setTimeout(warmCache, 1000 * 60 * 15)
}

// 不缓存请求
export function gqlfetch ({ parameter }) {
  const params = {
    'query': parameter,
    'operationName': '',
    'variables': {},
    'access-token': ''
  }

  return new Promise((resolve, reject) => {
    service
      .post(api.url, params)
      .then(res => {
        const val = res.data
        resolve(val)
      }, reject)
      .catch(reject)
  })
}
