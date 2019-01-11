import { cookie } from '../../server/utils/cookie'

export function requestConfig() {
  return {
    url: '',
    accessToken: cookie.get('accessToken')
  }
}
