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
const models = require('../../../db/mysqldb/index');
const constant_1 = require("../utils/constant");
const lowdb = require('../../../db/lowdb/index');
const config = lowdb.read().value();
const Op = require('sequelize').Op;
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == '') {
        return false;
    }
    else {
        return true;
    }
}
class useExperience {
    // 用户经验
    /**
     * 目前获取经验的方法
     * 阅读文章、阅读动态、文章被点赞、动态被点赞、发表评论
     * @param   {object} type 上下文对象
     */
    static setExperience(params) {
        // 用户经验
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = yield models.user_info.findOne({
                    where: {
                        uid: params.uid
                    }
                });
                let date = new Date();
                let getTime = date.setHours(date.getHours());
                let startTime = new Date(new Date(getTime).setHours(0, 0, 0, 0)); // 当天0点
                let endTime = new Date(new Date(getTime).setHours(23, 59, 59, 999));
                const countTodayExperience = yield models.experience.count({
                    // 当前类型的当天的数量
                    where: {
                        uid: params.uid,
                        ass_uid: params.ass_uid,
                        type: params.type,
                        action: params.action,
                        create_date: {
                            [Op.gt]: startTime,
                            [Op.lt]: endTime //  <
                        }
                    }
                });
                const currTodayExperience = yield models.experience.count({
                    // 当前类型的对象当天的数量
                    where: {
                        uid: params.uid,
                        ass_uid: params.ass_uid,
                        type: params.type,
                        action: params.action,
                        associate: params.associate,
                        create_date: {
                            [Op.gt]: startTime,
                            [Op.lt]: endTime //  <
                        }
                    }
                });
                let value = constant_1.experienceInfo[params.action];
                let experience = Number(userInfo.experience);
                const total = experience + value;
                function newAddExperience() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield models.sequelize.transaction((t) => {
                            // 在事务中执行操作
                            return models.experience
                                .create(Object.assign({ total,
                                value }, params), { transaction: t })
                                .then(() => {
                                return models.user_info.update({
                                    experience: total
                                }, {
                                    where: {
                                        uid: params.uid
                                    }
                                }, { transaction: t });
                            });
                        });
                    });
                }
                if (params.action === constant_1.modelAction.readOther) {
                    // 属于阅读的时候
                    if (countTodayExperience < 5 && currTodayExperience === 0) {
                        // 阅读试通一个类型，一天可以获得5次经验 对象不可重复
                        // 当天可获取的经验类型
                        yield newAddExperience();
                    }
                }
                else if (params.action === constant_1.modelAction.obtain_thumb) {
                    // 属于点赞的时候一天可获得的经验为无数次
                    yield newAddExperience();
                }
                resolve({ status: 'success' }); // 这里不管是正确还是失败，都返回resolve
            }
            catch (err) {
                console.log('err', err);
                resolve({ status: 'error' });
            }
        }));
    }
}
exports.default = useExperience;
