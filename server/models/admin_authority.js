const { ad_authority } = require('../db/db')

/**
 * 查询后台权限
 * @param   {string} key 根据...key查询单个权限
 */

const findone_admin_authority_model = (key) => {
  return ad_authority.findOne({
    where: {
      ...key
    }
  })
}

/**
 * 查询后台权限
 * @param   {string} key 根据...key查询单个权限
 */

const create_admin_authority_model = (key) => {
  return ad_authority.findOne({
    where: {
      ...key
    }
  })
}

/**
 * 删除后台权限
 * @param   {Array} authority_id_arr 根据多个authority_id_arr删除权限
 */

const delete_admin_authority_model = (authority_id_arr, transaction = {}) => {
  return ad_authority.destroy({ 'where': { 'authority_id': { in: authority_id_arr } } }, { ...transaction })
}

module.exports = {
  findone_admin_authority_model,
  delete_admin_authority_model
}