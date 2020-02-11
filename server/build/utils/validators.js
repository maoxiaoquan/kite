"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
module.exports = {
    validateWords(str) {
        const pattern = new RegExp('[<>#$%^*+*]');
        let newParams = '';
        for (let i = 0; i < str.length; i++) {
            newParams += str.substr(i, 1).replace(pattern, '');
        }
        return newParams;
    },
    // 校验用户名
    checkUserName(str) {
        return /^[a-zA-Z][a-zA-Z0-9_]{4,21}$/.test(str);
    },
    // 校验中文GBK
    checkName(str, min = 2, max = 6) {
        return (str && validator_1.default.isLength(str, { min, max }) && /[\u4e00-\u9fa5]/.test(str));
    },
    // 校验密码
    checkPwd(str, min = 5, max = 32) {
        return (str &&
            validator_1.default.isLength(str, { min, max }) &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/.test(str));
    },
    // 校验邮箱
    checkEmail(str) {
        return str && validator_1.default.isEmail(str);
    },
    // 校验手机号
    checkPhoneNum(str) {
        return str && validator_1.default.isMobilePhone(str.toString(), 'zh-CN');
    },
    // 校验QQ号
    checkQqNum(str) {
        return RegExp(/^[1-9][0-9]{4,9}$/).test(str);
    },
    checkUrl(str) {
        return str && validator_1.default.isURL(str);
    }
};
