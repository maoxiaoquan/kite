import LRU from 'lru-cache'

const config = require('../../config')
let baseURL = `http://localhost:${process.env.NODE_ENV === 'production' ? config.port.product : config.port.client_dev}`

export function requestConfig() {
  let _c = {}
  _c.onServer = true
  _c.cachedItems = new LRU({
    max: 1000,
    maxAge: 1000 * 60 * 2 // 2 min cache
  })
  _c.url = baseURL
  return _c
}
