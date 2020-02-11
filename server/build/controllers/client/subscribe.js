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
const { resClientJson } = require('../../utils/resData');
const models = require('../../../../db/mysqldb/index');
const Op = require('sequelize').Op;
const clientWhere = require('../../utils/clientWhere');
const { statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes }, articleType, userMessageAction, modelAction, virtualType, modelType } = require('../../utils/constant');
const userVirtual = require('../../common/userVirtual');
class Subscribe {
    static getArticleTagList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 24;
            let tag_name = req.query.tag_name;
            let whereParams = {
                enable: 1
            };
            try {
                tag_name &&
                    (whereParams['name'] = {
                        [Op.like]: `%${tag_name}%`
                    });
                let { count, rows } = yield models.article_tag.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [
                        ['attention_count', 'DESC'] // ASC
                    ]
                });
                for (let i in rows) {
                    rows[i].setDataValue('subscribe_count', yield models.attention.count({
                        where: {
                            associate_id: rows[i].id || '',
                            is_associate: true,
                            type: modelType.article_tag
                        }
                    }));
                    rows[i].setDataValue('article_count', yield models.article.count({
                        where: Object.assign({ tag_ids: {
                                [Op.like]: `%${rows[i].tag_id}%`
                            } }, clientWhere.article.otherList)
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: 'subscribe',
                    data: {
                        page,
                        count,
                        pageSize,
                        tag_name,
                        article_tag_list: rows
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
    static getArticleTagListMy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            let { user = '' } = req;
            let whereParams = {
                enable: 1
            };
            try {
                let allSubscribeArticleTag = yield models.attention.findAll({
                    where: {
                        uid: user.uid
                    }
                });
                if (allSubscribeArticleTag.length > 0) {
                    let myArticleTag = allSubscribeArticleTag.map((result) => {
                        return result.tag_id;
                    });
                    myArticleTag &&
                        (whereParams['tag_id'] = {
                            [Op.regexp]: `${myArticleTag.join('|')}`
                        });
                    let { count, rows } = yield models.article_tag.findAndCountAll({
                        where: whereParams,
                        offset: (page - 1) * pageSize,
                        limit: pageSize,
                        order: [
                            ['attention_count', 'DESC'] // ASC
                        ]
                    });
                    for (let i in rows) {
                        rows[i].setDataValue('subscribe_count', yield models.attention.count({
                            where: {
                                associate_id: rows[i].id || '',
                                is_associate: true,
                                type: modelType.article_tag
                            }
                        }));
                        rows[i].setDataValue('article_count', yield models.article.count({
                            where: Object.assign({ tag_ids: {
                                    [Op.like]: `%${rows[i].tag_id}%`
                                } }, clientWhere.article.otherList)
                        }));
                    }
                    yield resClientJson(res, {
                        state: 'success',
                        message: 'subscribe',
                        data: {
                            page,
                            count,
                            pageSize,
                            article_tag_list: rows
                        }
                    });
                }
                else {
                    yield resClientJson(res, {
                        state: 'success',
                        message: 'subscribe',
                        data: {
                            page: 1,
                            count: 0,
                            pageSize: 25,
                            article_tag_list: []
                        }
                    });
                }
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
    /**
     * 获取当前用户订阅的标签成功
     * @param   {object} ctx 上下文对象
     */
    static getSubscribeTagMyAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { user = '', islogin } = req;
            try {
                if (!islogin) {
                    resClientJson(res, {
                        state: 'success',
                        message: '获取当前用户订阅的标签成功',
                        data: {
                            subscribe_article_tag: []
                        }
                    });
                }
                let allSubscribeArticleTag = yield models.attention.findAll({
                    where: {
                        uid: user.uid,
                        type: modelType.article_tag,
                        is_associate: true
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '获取当前用户订阅的标签成功',
                    data: {
                        subscribe_article_tag: allSubscribeArticleTag
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
exports.default = Subscribe;
