const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
import {
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualPlusLess,
  virtualType,
  productTypeInfo,
  isFree,
  modelType
} from '../../utils/constant'

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')
const { TimeNow, TimeDistance } = require('../../utils/time')

class Shop {
  /**
   * 购买
   * @param   {object} ctx 上下文对象
   */
  // 购买操作
  static async Buy(req: any, res: any, next: any) {
    try {
      let { product_id, product_type } = req.body
      let { user = '' } = req

      const productTypeAll = Object.keys(productTypeInfo)

      if (!~productTypeAll.indexOf(String(product_type))) {
        throw new Error('当前商品不在可购买列表')
      }

      // 获取商品信息
      const model = productTypeInfo[product_type].model
      const idKey = productTypeInfo[product_type].idKey

      const productInfo = await models[model].findOne({
        where: {
          [idKey]: product_id
        }
      })

      if (productInfo.is_free === isFree.free) {
        // 判断商品是否免费
        throw new Error('当前商品是免费无需购买！')
      }

      if (productInfo.uid === user.uid) {
        // 判断是否是自己的
        throw new Error('无法购买自己售出的！')
      }

      let oneOrder = await models.order.findOne({
        where: {
          product_id,
          product_type,
          uid: user.uid
        }
      })

      if (oneOrder) {
        throw new Error('当前商品已购买，请勿重复购买！')
      }

      let myUserInfo = await models.user_info.findOne({
        where: {
          uid: user.uid
        }
      })

      let otherUserInfo = await models.user_info.findOne({
        where: {
          uid: productInfo.uid
        }
      })

      let myVirtual = await models.virtual.findOne({
        where: {
          uid: user.uid
        },
        limit: 1,
        order: [['id', 'DESC']]
      })

      let otherVirtual = await models.virtual.findOne({
        where: {
          uid: productInfo.uid
        },
        limit: 1,
        order: [['id', 'DESC']]
      })

      let myOrShellBalance = Number(myVirtual.balance) // 我的账户余额
      let otherOrShellBalance = Number(otherVirtual.balance) // 商品用户的账户余额
      let myShellBalance = Number(myUserInfo.shell_balance) // 我的账户余额
      let otherShellBalance = Number(otherUserInfo.shell_balance) // 商品用户的账户余额
      let price = Number(productInfo.price)

      if (myShellBalance < 1) {
        throw new Error('当前账户贝壳不足')
      }
      if (myShellBalance < Number(productInfo.price)) {
        throw new Error('当前账户贝壳不足')
      }

      let myBalance = myShellBalance - price
      let myOrBalance = myOrShellBalance - price
      let otherBalance = otherShellBalance + price
      let otherOrBalance = otherOrShellBalance + price

      console.log('myBalance', myBalance)
      console.log('otherBalance', otherBalance)
      console.log('myOrBalance', myOrBalance)
      console.log('otherOrBalance', otherOrBalance)

      if (myBalance !== myOrBalance || otherBalance !== otherOrBalance) {
        throw new Error('支付出现错误，已终止')
      }

      await models.sequelize.transaction((t: any) => {
        // 在事务中执行操作
        return models.virtual
          .create(
            {
              // 用户虚拟币记录
              uid: user.uid,
              ass_uid: productInfo.uid || '',
              associate: JSON.stringify({
                [productTypeInfo[product_type].idKey]: product_id
              }),
              plus_less: virtualPlusLess.less,
              balance: myBalance,
              income: productInfo.price,
              expenses: 0,
              amount: productInfo.price,
              type: product_type,
              action: modelAction.buy,
              description: ''
            },
            { transaction: t }
          )
          .then(() => {
            return models.user_info.update(
              {
                shell_balance: myBalance
              },
              {
                where: {
                  uid: user.uid
                }
              },
              { transaction: t }
            )
          })
          .then(() => {
            return models.order.create(
              {
                // 用户虚拟币记录
                uid: user.uid,
                product_id,
                product_type,
                status: 1,
                pay_type: productInfo.pay_type,
                amount: productInfo.price,
                description: '购买小书'
              },
              { transaction: t }
            )
          })
          .then(() => {
            return models.virtual.create(
              {
                // 用户虚拟币消息记录
                uid: productInfo.uid,
                ass_uid: user.uid,
                associate: JSON.stringify({
                  [productTypeInfo[product_type].idKey]: product_id
                }),
                plus_less: virtualPlusLess.plus,
                balance: otherBalance,
                income: 0,
                expenses: productInfo.price,
                amount: productInfo.price,
                type: product_type,
                action: modelAction.sell,
                description: ''
              },
              { transaction: t }
            )
          })
          .then(() => {
            return models.user_info.update(
              {
                shell_balance: otherBalance
              },
              {
                where: {
                  uid: productInfo.uid
                }
              },
              { transaction: t }
            )
          })
      })

      await userMessage.setMessage({
        uid: productInfo.uid,
        sender_id: user.uid,
        action: userMessageAction.sell, // 动作：评论
        type: product_type, // 类型
        content: JSON.stringify({
          [productTypeInfo[product_type].idKey]: product_id
        })
      })

      resClientJson(res, {
        state: 'success',
        data: {},
        message: '购买成功'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
  /**
   * 我的订单列表
   * @param   {object} ctx 上下文对象
   */
  static async orderList(req: any, res: any, next: any) {
    let page = req.query.page || 1
    let product_type = req.query.product_type || ''
    let pageSize = Number(req.query.pageSize) || 10
    let { user = '' } = req
    let whereParams: any = {
      // 查询参数
      uid: user.uid
    }

    product_type && (whereParams['product_type'] = product_type)

    try {
      let { count, rows } = await models.order.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_date', 'DESC']]
      })
      for (let i in rows) {
        let model = productTypeInfo[rows[i].product_type].model
        let idKey = productTypeInfo[rows[i].product_type].idKey
        const productInfo = await models[model].findOne({
          where: {
            [idKey]: rows[i].product_id
          }
        })
        rows[i].setDataValue('productInfo', productInfo)
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
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

export default Shop
