import axios, { AxiosInstance } from 'axios'

class Oauth {
  static githubAuth(req: any, res: any, next: any) {
    const client_id = '0552fa82218b2a7a45ae'
    const redirect_uri =
      'http://localhost:8081/api-client/v1/oauth/github-login-oauth'
    const authUrl = 'https://github.com/login/oauth/authorize'
    let redirectUrl = `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}`

    res.redirect(redirectUrl)
  }

  static githubLoginAuth(req: any, res: any, next: any) {
    const code = req.query.code || ''
    const client_id = '0552fa82218b2a7a45ae'
    const client_secret = 'e8d7662dac58a8e9cca01904a66e25bd6e4177b2'
    const redirect_uri =
      'http://localhost:8081/api-client/v1/oauth/github-login-oauth'
    const accessTokenUrl = 'https://github.com/login/oauth/access_token'
    let accessToken = ''
    axios
      .post(accessTokenUrl, {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        redirect_uri: redirect_uri
      })
      .then(result => {
        accessToken = result.data
        axios.get(`https://api.github.com/user?${accessToken}`).then(result => {
          console.log('result111111111111', result.data)
        })
      })

    // res.redirect('http://localhost:8081')
  }
}

export default Oauth
