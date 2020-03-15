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
const { render, resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const clientWhere = require('../../utils/clientWhere');
const constant_1 = require("../../utils/constant");
const userMessage = require('../../utils/userMessage');
const userVirtual = require('../../common/userVirtual');
const { TimeNow, TimeDistance } = require('../../utils/time');
class Shop {
    /**
     * 购买
     * @param   {object} ctx 上下文对象
     */
    // 购买操作
    static Buy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { product_id, product_type } = req.body;
                let { user = '' } = req;
                const productTypeAll = Object.keys(constant_1.productTypeInfo);
                if (!~productTypeAll.indexOf(String(product_type))) {
                    throw new Error('当前商品不在可购买列表');
                }
                // 获取商品信息
                const model = constant_1.productTypeInfo[product_type].model;
                const idKey = constant_1.productTypeInfo[product_type].idKey;
                const productInfo = yield models[model].findOne({
                    where: {
                        [idKey]: product_id
                    }
                });
                if (productInfo.is_free === constant_1.isFree.free) {
                    // 判断商品是否免费
                    throw new Error('当前商品是免费无需购买！');
                }
                if (productInfo.uid === user.uid) {
                    // 判断是否是自己的
                    throw new Error('无法购买自己售出的！');
                }
                let oneOrder = yield models.order.findOne({
                    where: {
                        product_id,
                        product_type,
                        uid: user.uid
                    }
                });
                if (oneOrder) {
                    throw new Error('当前商品已购买，请勿重复购买！');
                }
                let myUserInfo = yield models.user_info.findOne({
                    where: {
                        uid: user.uid
                    }
                });
                let otherUserInfo = yield models.user_info.findOne({
                    where: {
                        uid: productInfo.uid
                    }
                });
                let myVirtual = yield models.virtual.findOne({
                    where: {
                        uid: user.uid
                    },
                    limit: 1,
                    order: [['id', 'DESC']]
                });
                let otherVirtual = yield models.virtual.findOne({
                    where: {
                        uid: productInfo.uid
                    },
                    limit: 1,
                    order: [['id', 'DESC']]
                });
                let myOrShellBalance = Number(myVirtual.balance); // 我的账户余额
                let otherOrShellBalance = Number(otherVirtual.balance); // 商品用户的账户余额
                let myShellBalance = Number(myUserInfo.shell_balance); // 我的账户余额
                let otherShellBalance = Number(otherUserInfo.shell_balance); // 商品用户的账户余额
                let price = Number(productInfo.price);
                if (myShellBalance < 1) {
                    throw new Error('当前账户贝壳不足');
                }
                if (myShellBalance < Number(productInfo.price)) {
                    throw new Error('当前账户贝壳不足');
                }
                let myBalance = myShellBalance - price;
                let myOrBalance = myOrShellBalance - price;
                let otherBalance = otherShellBalance + price;
                let otherOrBalance = otherOrShellBalance + price;
                if (myBalance !== myOrBalance || otherBalance !== otherOrBalance) {
                    throw new Error('支付出现错误，已终止');
                }
                yield models.sequelize.transaction((t) => {
                    // 在事务中执行操作
                    return models.virtual
                        .create({
                        // 用户虚拟币记录
                        uid: user.uid,
                        ass_uid: productInfo.uid || '',
                        associate: product_id,
                        plus_less: constant_1.virtualPlusLess.less,
                        balance: myBalance,
                        income: productInfo.price,
                        expenses: 0,
                        amount: productInfo.price,
                        type: product_type,
                        action: constant_1.modelAction.buy,
                        description: ''
                    }, { transaction: t })
                        .then(() => {
                        return models.user_info.update({
                            shell_balance: myBalance
                        }, {
                            where: {
                                uid: user.uid
                            }
                        }, { transaction: t });
                    })
                        .then(() => {
                        return models.order.create({
                            // 用户虚拟币记录
                            uid: user.uid,
                            product_id,
                            product_type,
                            status: 1,
                            pay_type: productInfo.pay_type,
                            amount: productInfo.price,
                            description: ''
                        }, { transaction: t });
                    })
                        .then(() => {
                        return models.virtual.create({
                            // 用户虚拟币消息记录
                            uid: productInfo.uid,
                            ass_uid: user.uid,
                            associate: product_id,
                            plus_less: constant_1.virtualPlusLess.plus,
                            balance: otherBalance,
                            income: 0,
                            expenses: productInfo.price,
                            amount: productInfo.price,
                            type: product_type,
                            action: constant_1.modelAction.sell,
                            description: ''
                        }, { transaction: t });
                    })
                        .then(() => {
                        return models.user_info.update({
                            shell_balance: otherBalance
                        }, {
                            where: {
                                uid: productInfo.uid
                            }
                        }, { transaction: t });
                    });
                });
                yield userMessage.setMessage({
                    uid: productInfo.uid,
                    sender_id: user.uid,
                    action: constant_1.userMessageAction.sell,
                    type: product_type,
                    content: product_id
                });
                resClientJson(res, {
                    state: 'success',
                    data: {},
                    message: '购买成功'
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
    /**
     * 我的订单列表
     * @param   {object} ctx 上下文对象
     */
    static orderList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let product_type = req.query.product_type || '';
            let pageSize = Number(req.query.pageSize) || 10;
            let { user = '' } = req;
            let whereParams = {
                // 查询参数
                uid: user.uid
            };
            product_type && (whereParams['product_type'] = product_type);
            try {
                let { count, rows } = yield models.order.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_date', 'DESC']]
                });
                for (let i in rows) {
                    let model = constant_1.productTypeInfo[rows[i].product_type].model;
                    let idKey = constant_1.productTypeInfo[rows[i].product_type].idKey;
                    const productInfo = yield models[model].findOne({
                        where: {
                            [idKey]: rows[i].product_id
                        }
                    });
                    rows[i].setDataValue('productInfo', productInfo);
                }
                resClientJson(res, {
                    state: 'success',
                    data: {
                        count,
                        list: rows,
                        page,
                        pageSize
                    },
                    message: '获取订单信息成功'
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
exports.default = Shop;
