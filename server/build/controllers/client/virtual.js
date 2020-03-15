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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../db/mysqldb/index');
const moment_1 = __importDefault(require("moment"));
const { resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const sequelize = require('sequelize');
const cheerio = require('cheerio');
const clientWhere = require('../../utils/clientWhere');
const xss = require('xss');
const config = require('../../../../config');
const lowdb = require('../../../../db/lowdb/index');
const { TimeNow, TimeDistance } = require('../../utils/time');
const constant_1 = require("../../utils/constant");
const modelNameNum = Object.values(constant_1.modelName);
const userVirtual_1 = __importDefault(require("../../common/userVirtual"));
class Virtual {
    // 签到
    static checkIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { user = '' } = req;
                let date = new Date();
                let getTime = date.setHours(date.getHours());
                let startTime = new Date(new Date(getTime).setHours(0, 0, 0, 0)); // 当天0点
                let endTime = new Date(new Date(getTime).setHours(23, 59, 59, 999));
                let oneVirtual = yield models.virtual.count({
                    where: {
                        uid: user.uid,
                        type: constant_1.modelName.system,
                        action: constant_1.modelAction.check_in,
                        create_date: {
                            [Op.gt]: startTime,
                            [Op.lt]: endTime //  <
                        }
                    }
                });
                if (oneVirtual > 0) {
                    throw new Error('当天已签到');
                }
                else {
                    yield userVirtual_1.default.setVirtual({
                        uid: user.uid,
                        type: constant_1.modelName.system,
                        action: constant_1.modelAction.check_in
                    });
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '签到成功'
                });
            }
            catch (err) {
                console.log('err', err);
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 获取消费列表
     * @param   {object} ctx 上下文对象
     */
    static getVirtualList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let { user = '' } = req;
            try {
                let { count, rows } = yield models.virtual.findAndCountAll({
                    where: {
                        uid: user.uid
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_date', 'DESC']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date).format('YYYY-MM-DD'));
                    rows[i].setDataValue('ass_user', yield models.user.findOne({
                        where: { uid: rows[i].ass_uid },
                        attributes: ['uid', 'avatar', 'nickname']
                    }));
                    rows[i].setDataValue('actionText', constant_1.modelActionText[rows[i].action]);
                    rows[i].setDataValue('typeText', constant_1.modelInfo[rows[i].type].name);
                    if (rows[i].associate &&
                        rows[i].type !== constant_1.modelName.user &&
                        ~modelNameNum.indexOf(rows[i].type)) {
                        // 排除关注用户
                        rows[i].setDataValue(constant_1.modelInfo[rows[i].type].model, yield models[constant_1.modelInfo[rows[i].type].model].findOne({
                            where: { [constant_1.modelInfo[rows[i].type].idKey]: rows[i].associate }
                        }));
                    }
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '数据返回成功',
                    data: {
                        count,
                        list: rows,
                        page,
                        pageSize
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
exports.default = Virtual;
