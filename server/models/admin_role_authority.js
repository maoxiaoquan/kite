const { ad_role_authority } = require('../db/db')

/**
 * 查询后台角色权限表关联
 * @param   {Array} authority_id_arr 根据authority_id_arr查询与authority_id_arr数组关联的角色权限表字段
 */

const find_admin_role_authority_model = (authority_id_arr) => {
  return ad_role_authority.findAll({ 'where': { 'authority_id': { in: authority_id_arr } } })
}


/**
 * 删除后台角色权限表关联权限
 * @param   {Array} authority_id_arr 根据多个authority_id_arr数组删除角色权限表的权限角色关联
 */

const delete_admin_role_authority_model = (authority_id_arr, transaction = {}) => {
  return ad_role_authority.destroy({ 'where': { 'authority_id': { in: authority_id_arr } } }, { ...transaction })
}

module.exports = {
  find_admin_role_authority_model,
  delete_admin_role_authority_model
}