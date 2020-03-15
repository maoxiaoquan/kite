const crypto = require('crypto')

module.exports = {
  encrypt: (data: string, key: string) => {
    // 密码加密
    let cipher = crypto.createCipher('bf', key)
    let newPsd = ''
    newPsd += cipher.update(data, 'utf8', 'hex')
    newPsd += cipher.final('hex')
    return newPsd
  },

  decrypt: (data: string, key: string) => {
    // 密码解密
    let decipher = crypto.createDecipher('bf', key)
    let oldPsd = ''
    oldPsd += decipher.update(data, 'hex', 'utf8')
    oldPsd += decipher.final('utf8')
    return oldPsd
  },

  isEmpty: (obj: any) => {
    var key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
}
