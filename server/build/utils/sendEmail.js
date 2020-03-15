"use strict";
/**
 *
 * @Description 邮件发送
 *
 */
const lowdb = require('../../../db/lowdb/index');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const lowdbRead = lowdb.read();
if (lowdbRead.value().email.type === 'company') {
    // 公司邮箱
    smtpTransport = nodemailer.createTransport(smtpTransport({
        host: lowdbRead.value().email.host,
        secureConnection: true,
        port: Number(lowdbRead.value().email.port),
        auth: {
            user: lowdbRead.value().email.user,
            pass: lowdbRead.value().email.pass
        }
    }));
}
else if (lowdbRead.value().email.type === 'personal') {
    // 个人邮箱
    smtpTransport = nodemailer.createTransport(smtpTransport({
        service: lowdbRead.value().email.service,
        auth: {
            user: lowdbRead.value().email.user,
            pass: lowdbRead.value().email.pass
        }
    }));
}
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
const sendMail = function (recipient, subject, html) {
    smtpTransport.sendMail({
        from: lowdbRead.value().email.user,
        to: recipient,
        subject: subject,
        html: html
    }, function (error, response) {
        if (error) {
            console.log(error);
        }
        console.log('发送成功');
    });
};
const sendVerifyCodeMail = function (recipient, subject, code) {
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail({
            from: lowdbRead.value().email.user,
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
                    <div class="header__slogan" style="font-size: 14px;line-height: 40px;height: 40px;">${lowdbRead.value().website.website_name}</div>
                </div>
                <div class="content" style="
                    line-height: 25px;
                    padding: 40px 60px;
                ">
                    <div style="font-weight:bold">HI:${recipient}</div>
                    <div>
                        <h2 style="color:#333">${code} </h2>
                    </div>
                     <div>验证码有效期为30分钟</div>
                </div>
        </div>
        `
        }, function (error, response) {
            if (error) {
                reject({
                    state: 'error',
                    message: error.response
                });
            }
            resolve({
                state: 'success',
                message: '发送成功'
            });
        });
    });
};
const sendNotification = (recipient, subject, data) => {
    // 消息通知
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail({
            from: lowdbRead.value().email.user,
            to: recipient,
            subject: data.date + ' ' + subject,
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
                    <div class="header__slogan" style="font-size: 14px;line-height: 40px;height: 40px;">${lowdbRead.value().website.website_name}</div>
                </div>
                <div class="content" style="
                    line-height: 25px;
                    padding: 40px 60px;
                ">
                    <div style="font-weight:bold">${data.date} 新的消息通知: <a href="${lowdbRead.value().website.website_name}/user/${data.uid}/message">${data.msg}</a></div>
                    <div style="font-weight:bold">大于${data.noMsgNum}条未读消息时，将采用邮件推送，可前往用户通知中修改</div>
                </div>
        </div>
        `
        }, function (error, response) {
            if (error) {
                reject({
                    state: 'error',
                    message: error.response
                });
            }
            resolve({
                state: 'success',
                message: '发送成功'
            });
        });
    });
};
module.exports = {
    sendMail,
    sendNotification,
    sendVerifyCodeMail
};
