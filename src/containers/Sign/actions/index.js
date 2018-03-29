import http from '../../../utils/http'


export const sign_in = (data, func) => {
  return () => {
    http.post('/api/user/sign_in', data).then((res) => {
      console.log('res', res)
      if (res.state) {
        console.log('res.token', res.token)
        localStorage.box_tokens = res.token;
      }
      if (func)
        func(res)
    })
  }
}

export const sign_up = (data, func) => {
  return () => {
    http.post('/api/user/sign_up', data).then((res) => {
      console.log('res', res)
      if (func)
        func(res)
    })
  }
}