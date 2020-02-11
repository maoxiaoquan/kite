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
const { resAdminJson } = require('../../utils/resData');
const { createAdminSystemLog } = require('./adminSystemLog');
class dynamicTopic {
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建专题
     * @param   {object} ctx 上下文对象
     */
    static createDynamicTopic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let oneDynamicTopicName = yield models.dynamic_topic.findOne({
                    where: { name: reqData.name }
                });
                if (oneDynamicTopicName) {
                    throw new Error('专题名已存在!');
                }
                let onedynamicTopicEnName = yield models.dynamic_topic.findOne({
                    where: { en_name: reqData.en_name }
                });
                if (onedynamicTopicEnName) {
                    throw new Error('专题名英文已存在!');
                }
                yield models.dynamic_topic.create({
                    name: reqData.name,
                    en_name: reqData.en_name,
                    icon: reqData.icon || '/default/img/tag.webp',
                    description: reqData.description,
                    enable: reqData.enable,
                    sort: reqData.sort,
                    is_show: reqData.is_show,
                    is_push: reqData.is_push
                });
                yield createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功创建了‘${reqData.name}’动态专题`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '专题创建成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 获取专题列表操作
     * @param   {object} ctx 上下文对象
     */
    static getDynamicTopicList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.dynamic_topic.findAndCountAll({
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: [
                        ['sort', 'ASC'] // asc
                    ]
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        list: rows
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 获取所有专题操作
     * @param   {object} ctx 上下文对象
     */
    static getDynamicTopicAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allDynamicTopic = yield models.dynamic_topic.findAll({
                    where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        all: allDynamicTopic
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 更新专题
     * @param   {object} ctx 上下文对象
     */
    static updateDynamicTopic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.dynamic_topic.update({
                    name: reqData.name,
                    en_name: reqData.en_name,
                    icon: reqData.icon || '/default/img/tag.webp',
                    description: reqData.description,
                    sort: reqData.sort,
                    is_show: reqData.is_show,
                    is_push: reqData.is_push,
                    enable: reqData.enable
                }, {
                    where: {
                        topic_id: reqData.topic_id // 查询条件
                    }
                });
                yield createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功更新了id为‘${reqData.topic_id}’的动态专题名字为‘${reqData.name}’`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新专题成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 删除专题
     */
    static deleteDynamicTopic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { topic_id } = req.body;
            try {
                let oneDynamicTopic = yield models.dynamic_topic.findOne({
                    where: { topic_id }
                });
                yield models.dynamic_topic.destroy({ where: { topic_id } });
                yield createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功删除了‘${oneDynamicTopic.name}’动态专题`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除用户成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = dynamicTopic;
