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


const sendMail = function (recipient, subject, html) {

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

const send_verify_code_mail = function (recipient, subject, code) {

  smtpTransport.sendMail({

    from: config.email.user,
    to: recipient,
    subject: subject,
    html: `
        <div class="juejin-reset" style="
            width: 600px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
            font-size: 14px;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
        ">
                <div class="header" style="
                    height: 60px;
                    padding: 10px 60px;
                    border-bottom: 1px solid #eaeaea;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                ">
                    <a style="height: 40px;width: 100px;background: url() no-repeat 0 0;background-size: contain;" target="_blank" href="" class="home-link">
                    </a>
                    <div class="header__slogan" style="font-size: 14px;color: #007fff;line-height: 40px;height: 40px;">每天都开心</div>
                </div>
                <div class="content" style="
                    line-height: 25px;
                    padding: 40px 60px;
                ">
                    <div style="font-weight:bold">HI:${recipient}</div>
                        <div>这是此次注册的验证码，有效期为30分钟，请在30分钟内输入</div>
                    <div>
                        <h2 style="color:#333">${code} </h2>
                    </div>
                    <div class="hint" style="
                        margin-top: 20px;
                    ">
                        请复制验证码到输入框内
                    </div>
                    <div class="hint" style="
                        margin-top: 20px;
                    ">FateCMS团队</div>
                </div>
        </div>
        <p style="max-width: 600px;
          margin-top: 30px;
          margin-bottom: 100px;
          margin-left: auto;
          margin-right: auto;
          color: #a1a1a1;
          text-align: center;
          font-size: 12px;
          line-height: 20px;"
        >希望您来到这里可以得到你想要</p>
        `

  }, function (error, response) {
    if (error) {
      console.log(error)
    }
    console.log('发送成功')
  })
}

module.exports = {
  sendMail,
  send_verify_code_mail
}