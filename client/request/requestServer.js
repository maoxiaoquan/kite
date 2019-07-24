import LRU from 'lru-cache'

const ports = require('../../kite.config')
let baseURL = `http://localhost:${
  process.env.NODE_ENV === 'production' ? ports.server.port : ports.client.port
}/api-client/v1`

export function requestConfig () {
  let _c = {}
  _c.onServer = true
  _c.cachedItems = new LRU({
    max: 1000,
    maxAge: 1000 * 60 * 2 // 2 min cache
  })
  _c.url = baseURL
  return _c
}
