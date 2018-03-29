import http from '../../../utils/http'


export const sign_in = (data, func) => {
  return () => {
    http.post('/api/user/user_list', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
    })
  }
}
