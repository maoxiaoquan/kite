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
const userVirtual = require('../../common/userVirtual');
class Experience {
    /**
     * 获取消费列表
     * @param   {object} ctx 上下文对象
     */
    static getExperienceList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let { user = '' } = req;
            try {
                let { count, rows } = yield models.experience.findAndCountAll({
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
                    const oneModelInfo = yield models[constant_1.modelInfo[rows[i].type].model].findOne({
                        where: {
                            [constant_1.modelInfo[rows[i].type].idKey]: rows[i].associate
                        }
                    });
                    rows[i].setDataValue('content', oneModelInfo);
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
exports.default = Experience;
