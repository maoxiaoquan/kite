/**
 *
 * @Description 邮件发送
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 * @Author Amor
 * @Created 2016/04/26 15:10
 * 技术只是解决问题的选择,而不是解决问题的根本...
 * 我是Amor,为发骚而生!
 *
 */

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../../config')

smtpTransport = nodemailer.createTransport(smtpTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
}))

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html) {

  smtpTransport.sendMail({

    from: config.email.user,
    to: recipient,
    subject: subject,
    html: html

  }, function (error, response) {
    if (error) {
      console.log(error)
    }
    console.log('发送成功')
  })
}

module.exports = sendMail