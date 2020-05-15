"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Format {
    /**
     * 登录信息数据的返回，附带token
     * @param  {object} res res
     * @param  {Boolean} state 状态，必填,判断数据是否返回正确 success正常、error错误
     * @param  {String} message 信息，必填,返回的弹窗信息
     * @param  {String} token token
     * @param  {object} date 返回的数据
     * @param  {Boolean} is_login  是否登录
     */
    resSignJson(res, { state, message, data = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                state,
                message,
                data
            });
        });
    }
    /**
     * 后台数据的返回,不附带token
     * @param  {object} res res,必填
     * @param  {number} state 状态，必填,判断数据是否返回正确 success正常、error错误
     * @param  {String} message 信息，必填,返回的弹窗信息
     * @param  {object} data 返回的数据
     * @param  {Boolean} is_login  是否登录
     */
    resAdminJson(res, { state, message, data = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({
                state,
                message,
                data
            });
        });
    }
    /**
     * 前台页面数据返回
     */
    resClientJson(res, { state, message, data = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield res.json({
                state,
                message,
                data
            });
        });
    }
    render(res, { title, view_url, state, message, data = {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('view_url', view_url);
            yield res.render(view_url, {
                title,
                state,
                message,
                data,
                user_info: {
                    islogin: res.session.islogin,
                    uid: res.session.uid,
                    avatar: res.session.avatar
                }
            });
        });
    }
}
module.exports = new Format();
