// 通过webpack 打包时判断客户端请求和服务端请求的不同
// requestClient 客户端会打包这个 中url为空所以不会添加url前缀
// requestServer 服务端会打包这个 中url --
// process.env.NODE_ENV === 'production' 添加开发时的url client_dev 端口前缀
// 或者 生产环境的 product 端口前缀

/* 所有请求必须调用这里 此处的请求对服务端和客户端的请求做了处理 */

import { requestConfig } from 'request-config'
import axios from 'axios'

const api = requestConfig()

const logRequests =
  process.env.NODE_ENV === 'development' || !!process.env.DEBUG_API

const service = axios.create({
  baseURL: api.url,
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

// 可缓存请求
export function Cachefetch ({ url, method, parameter, moreConfig = {} }) {
  logRequests && console.log(`fetching ${url}...`)
  const cache = api.cachedItems
  if (cache && cache.has(url)) {
    logRequests && console.log(`cache hit for ${url}.`)
    return Promise.resolve(cache.get(url))
  } else {
    return new Promise((resolve, reject) => {
      service[method](url, parameter, moreConfig)
        .then(res => {
          const val = res.data
          if (val) val.__lastUpdated = Date.now()
          cache && cache.set(url, val)
          logRequests && console.log(`fetched ${url}.`)
          resolve(val)
        }, reject)
        .catch(reject)
    })
  }
}

// 不缓存请求
export function fetch ({ url, method, parameter, moreConfig = {} }) {
  logRequests && console.log(`fetching ${url}...`)
  return new Promise((resolve, reject) => {
    service[method](url, parameter, moreConfig)
      .then(res => {
        const val = res.data
        logRequests && console.log(`fetched ${url}.`)
        resolve(val)
      }, reject)
      .catch(reject)
  })
}
