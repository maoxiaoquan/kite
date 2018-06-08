const { ad_user_role } = require('../db/db')

/**
 * 查询角色用户表
 * @param   {string} key 根据...key查询单个角色用户表信息
 */

const findone_admin_user_role_model = (key) => {
  return ad_user_role.findOne({
    where: {
      ...key
    }
  })
}


/**
 * 删除角色用户信息
 * @param   {string} key 根据...key查询角色用户表信息
 * @param   {object} transaction 预留事务参数
 */

const delete_admin_user_role_model = (key, transaction = {}) => {
  return ad_user_role.destroy({ where: { ...key } }, { ...transaction })
}

module.exports = {
  findone_admin_user_role_model,
  delete_admin_user_role_model
}