import { cookie } from '../../server/utils/cookie'

export function fetchConfig () {
  return {
    url: '/graphql',
    accessToken: cookie.get('accessToken')
  }
}
