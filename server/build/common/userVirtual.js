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
const { virtualInfo, virtualPlusLess } = require('../utils/constant');
const lowdb = require('../../../db/lowdb/index');
const config = lowdb.read().value();
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == '') {
        return false;
    }
    else {
        return true;
    }
}
class userVirtual {
    // 是否可以进行操作
    static isVirtual(vrData) {
        let virtualData = vrData;
        // 订阅消息
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let user_info = yield models.user_info.findOne({
                where: {
                    uid: virtualData.uid
                }
            });
            let isPlus = virtualInfo[virtualData.action].plusLess === virtualPlusLess.plus;
            let amount = virtualInfo[virtualData.action][virtualData.type];
            let shell_balance = Number(user_info.shell_balance);
            if (!isPlus) {
                if (shell_balance < amount) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }
            else {
                resolve(true);
            }
        }));
    }
    // 用户消费积分
    static setVirtual(vrData) {
        let virtualData = vrData;
        // 消费
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user_info = yield models.user_info.findOne({
                    where: {
                        uid: virtualData.uid
                    }
                });
                let isPlus = virtualInfo[virtualData.action].plusLess === virtualPlusLess.plus;
                let amount = virtualInfo[virtualData.action][virtualData.type];
                let shell_balance = Number(user_info.shell_balance);
                let balance = isPlus ? shell_balance + amount : shell_balance - amount;
                if (!isDigit(balance)) {
                    throw new Error('贝壳支付出现错误');
                }
                if (!isPlus) {
                    if (shell_balance < amount) {
                        throw new Error('积分余额不足');
                    }
                }
                yield models.sequelize.transaction((t) => {
                    // 在事务中执行操作
                    return models.virtual
                        .create(Object.assign({ 
                        // 用户虚拟币消息记录
                        plus_less: virtualInfo[virtualData.action].plusLess, balance, income: isPlus
                            ? virtualInfo[virtualData.action][virtualData.type]
                            : 0, expenses: isPlus
                            ? 0
                            : virtualInfo[virtualData.action][virtualData.type], amount: virtualInfo[virtualData.action][virtualData.type] }, virtualData), { transaction: t })
                        .then((user) => {
                        return models.user_info.update({
                            shell_balance: balance
                        }, {
                            where: {
                                uid: virtualData.uid
                            }
                        }, { transaction: t });
                    });
                });
                resolve({ status: 'success' });
            }
            catch (err) {
                console.log('err', err);
                reject('虚拟币消费出现错误:' + err.message);
            }
        }));
    }
}
exports.default = userVirtual;
