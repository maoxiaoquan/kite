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
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../db/mysqldb/index');
const { resClientJson } = require('../../utils/resData');
const lowdb = require('../../../../db/lowdb/index');
class Website {
    /**
     * 获取所有文章标签get
     * @param   {object} ctx 上下文对象
     */
    static getWebsiteInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                const { on_login, on_register, on_comment, googleCode, isBaiduAuthPush } = lowdb
                    .read()
                    .get('config')
                    .value();
                const noticeAll = yield models.options.findAll({
                    where: {
                        option_key: 'notice' // 查询条件
                    }
                });
                const advertiseAll = yield models.options.findAll({
                    where: {
                        option_key: 'advertise' // 查询条件
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '获取网站信息成功',
                    data: {
                        website,
                        config: {
                            on_login,
                            on_register,
                            on_comment,
                            googleCode,
                            isBaiduAuthPush
                        },
                        notice: noticeAll,
                        advertise: advertiseAll
                    }
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = Website;
