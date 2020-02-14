import { cookie } from '../src/utils/cookie'

export function fetchConfig () {
  return {
    url: '/graphql',
    accessToken: cookie.get('accessToken')
  }
}
