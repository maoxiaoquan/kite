const moment = require('moment')
// eslint-disable-next-line
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

exports.timestampFormat = function (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  return new Date(timestamp * 1000).Format(fmt)
}

exports.timestampFormat2 = function (timestamp, fmt = 'yyyy-MM-dd') {
  return new Date(timestamp * 1000).Format(fmt)
}

exports.TimeNow = {
  time () {
    let date = new Date()
    return moment(date.setHours(date.getHours())).format()
  },
  timestamp () {
    let date = new Date()
    return moment(date.setHours(date.getHours())).format('X')
  }
}
