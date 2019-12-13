import LRU from 'lru-cache'

const ports = require('../../kite.config')
let baseURL = `http://localhost:${
  process.env.NODE_ENV === 'production' ? ports.server.port : ports.client.port
}/graphql`

export function fetchConfig () {
  let _c = {}
  _c.onServer = true
  _c.cachedItems = new LRU({
    max: 1000,
    maxAge: 1000 * 60 * 2 // 2 min cache
  })
  _c.url = baseURL
  return _c
}
