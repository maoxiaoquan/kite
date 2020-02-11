import validator from 'validator'

module.exports = {
  validateWords(str: string) {
    const pattern = new RegExp('[<>#$%^*+*]')
    let newParams = ''
    for (let i = 0; i < str.length; i++) {
      newParams += str.substr(i, 1).replace(pattern, '')
    }
    return newParams
  },
  // 校验用户名
  checkUserName(str: string) {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,21}$/.test(str)
  },
  // 校验中文GBK
  checkName(str: string, min = 2, max = 6) {
    return (
      str && validator.isLength(str, { min, max }) && /[\u4e00-\u9fa5]/.test(str)
    )
  },
  // 校验密码
  checkPwd(str: string, min = 5, max = 32) {
    return (
      str &&
      validator.isLength(str, { min, max }) &&
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/.test(str)
    )
  },
  // 校验邮箱
  checkEmail(str: string) {
    return str && validator.isEmail(str)
  },
  // 校验手机号
  checkPhoneNum(str: string) {
    return str && validator.isMobilePhone(str.toString(), 'zh-CN')
  },
  // 校验QQ号
  checkQqNum(str: string) {
    return RegExp(/^[1-9][0-9]{4,9}$/).test(str)
  },
  checkUrl(str: string) {
    return str && validator.isURL(str)
  }
}
