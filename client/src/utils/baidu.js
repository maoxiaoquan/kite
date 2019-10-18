import isProduction from './isProduction' // process.env.NODE_ENV === 'production'

class Baidu {
  // 百度的自动推送
  static resource ({ route, config = {}, random = '' }) {
    let resourceArray = []
    if (isProduction && config.isBaiduAuthPush === 'yes') {
      // 百度seo方面 连接自动推送
      resourceArray.push({
        src: `https://zz.bdstatic.com/linksubmit/push.js?_random=${route.name +
          random}`,
        type: 'text/javascript'
      })
    }
    return resourceArray
  }
}

export default Baidu
