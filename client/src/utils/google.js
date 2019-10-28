import isProduction from './isProduction'

class Google {
  // 逐入google统计
  static statisticsCode ({ route, googleCode = '', random = '' }) {
    let resourceArray = []
    if (isProduction && googleCode) {
      // 百度seo方面 连接自动推送
      resourceArray.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${googleCode}&_random=${route.name +
          random}`,
        type: 'text/javascript'
      })
    }
    return resourceArray
  }

  // 逐入google统计code
  static injectionGoogleCode (googleCode = '') {
    if (isProduction && googleCode) {
      window.dataLayer = window.dataLayer || []
      function gtag () {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', googleCode)
    }
  }
}

export default Google
