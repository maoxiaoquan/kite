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
const Op = require('sequelize').Op;
const { TimeNow, TimeDistance } = require('../../utils/time');
const clientWhere = require('../../utils/clientWhere');
class Article {
    static getIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let pageSize = 25;
            let sort = 'newest';
            let order = []; // 排序参数
            let where = []; // 排序参数
            try {
                // where
                let { count, rows } = yield models.article.findAndCountAll({
                    where: where,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: order
                });
                return {
                    count,
                    page,
                    pageSize,
                    list: JSON.parse(JSON.stringify(rows))
                };
            }
            catch (err) {
                return {
                    count: 0,
                    page: 1,
                    pageSize,
                    list: []
                };
            }
        });
    }
    // 推荐动态
    static recommendArticle() {
        return __awaiter(this, void 0, void 0, function* () {
            let whereParams = {}; // 查询参数
            let orderParams = [
                ['create_date', 'DESC'],
                ['comment_count', 'DESC']
            ]; // 排序参数
            try {
                // sort
                // hottest 全部热门:
                whereParams = {
                    status: {
                        [Op.or]: [2, 4]
                    },
                    create_date: {
                        [Op.between]: [
                            new Date(TimeNow.showMonthFirstDay()),
                            new Date(TimeNow.showMonthLastDay())
                        ]
                    }
                };
                let allDynamic = yield models.article.findAll({
                    where: whereParams,
                    limit: 3,
                    order: orderParams
                });
                return JSON.parse(JSON.stringify(allDynamic));
            }
            catch (err) {
                return [];
            }
        });
    }
}
exports.default = Article;
