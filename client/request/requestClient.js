import { cookie } from '../src/utils/cookie'

export function requestConfig () {
  return {
    url: '/api-client/v1',
    accessToken: cookie.get('accessToken')
  }
}
