import { cookie } from '../../server/utils/cookie'

export function requestConfig() {
  return {
    url: '/client/api/v1',
    accessToken: cookie.get('accessToken')
  }
}
