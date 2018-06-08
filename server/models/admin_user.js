const { ad_user } = require('../db/db')
const { tools: { encrypt } } = require('../utils')
const config = require('../../config')
const moment = require('moment')

/**
 * 分页查询后台用户
 * @param   {number} page 当前页
 * @param   {number} pageSize 当前页显示多少条
 */
const page_find_admin_user_model = (page = 1, pageSize = 10) => {
  return ad_user.findAndCountAll({
    attributes: ['uid', 'account', 'nickname', 'email', 'phone', 'reg_time', 'last_sign_time', 'reg_ip', 'enable'],
    where: '',//为空，获取全部，也可以自己添加条件
    offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
    limit: Number(pageSize)//每页限制返回的数据条数
  })
}

/**
 * 删除后台用户
 * @param   {number} key 需要删除的用户id
 * @param   {object} transaction 预留事务参数
 */
const delete_admin_user_model = (key, transaction = {}) => { /* 分页查询后台用户 */
  return ad_user.destroy({ 'where': { ...key } }, { ...transaction })
}

/**
 * 更新后台用户
 * @param   {number} uid 需要更新的用户id
 * @param   {string} account 需要更新的用户账户
 * @param   {string} password 需要更新的用户密码
 * @param   {string} email 需要更新的用户邮箱
 * @param   {number} phone 需要更新的用户手机号码
 * @param   {boolean} enable 需要更新的用户是否可以登录
 */

const update_admin_user_model = ({ uid, account, nickname, password, email, phone, enable }) => {
  return ad_user.update({
    account,
    nickname,
    password: encrypt(password, config.encrypt_key),
    email,
    phone,
    enable: enable || false
  }, {
      where: {
        uid: uid//查询条件
      }
    })
}

/**
 * 创建后台用户
 * @param   {string} account 需要创建的用户账户
 * @param   {string} password 需要创建的用户密码
 * @param   {string} email 需要创建的用户邮箱
 * @param   {number} phone 需要创建的用户手机号码
 * @param   {boolean} enable 需要创建的用户是否可以登录
 * @param   {string} ip 需要创建的用户是否可以登录
 */
const create_admin_user_model = ({ account, nickname, password, email, phone, enable, ip }) => {
  return ad_user.create({
    account,
    nickname,
    password: encrypt(password, config.encrypt_key),
    email,
    phone,
    reg_time: moment().utc().utcOffset(+8).format('X'),
    reg_ip: ip,
    enable: enable || false
  })
}

/**
 * 查询后台用户
 * @param   {string} key 根据...key查询单个用户
 */

const findone_admin_user_model = (key) => {
  return ad_user.findOne({
    where: {
      ...key
    }
  })
}

module.exports = {
  page_find_admin_user_model,
  delete_admin_user_model,
  update_admin_user_model,
  create_admin_user_model,
  findone_admin_user_model
}
