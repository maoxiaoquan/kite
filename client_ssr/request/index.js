// this is aliased in webpack config based on server/client build
// 通过webpack 打包时判断客户端请求和服务端请求的不同
// request_client 客户端会打包这个 中url为空所以不会添加url前缀
// request_server 服务端会打包这个 中url --
// process.env.NODE_ENV === 'production' 添加开发时的url client_dev 端口前缀
// 或者 生产环境的 product 端口前缀
import { requestConfig } from 'request-config'
import axios from 'axios'

let axios_config = {}

const api = requestConfig()

console.log('api', api)

axios_config.baseURL = api.url

const logRequests = true || !!process.env.DEBUG_API

const service = axios.create(axios_config)

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer) {
  warmCache()
}

function warmCache() {
  // fetchItems((api.cachedIds.top || []).slice(0, 30))
  setTimeout(warmCache, 1000 * 60 * 15)
}

export function fetch({ url, method, data }) {
  logRequests && console.log(`fetching ${url}...`)
  const cache = api.cachedItems
  if (cache && cache.has(url)) {
    logRequests && console.log(`cache hit for ${url}.`)
    return Promise.resolve(cache.get(url))
  } else {
    return new Promise((resolve, reject) => {
      service[method](url, data)
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

