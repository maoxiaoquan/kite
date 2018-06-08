const {
  page_find_admin_user_model,
  delete_admin_user_model,
  update_admin_user_model,
  create_admin_user_model,
  findone_admin_user_model
} = require('./admin_user')
const {
  findone_admin_role_model,
  create_admin_role_model,
  update_admin_role_model,
  delete_admin_role_model,
  page_find_admin_role_model,
  findAll_admin_role_model
} = require('./admin_role')

const {
  findone_admin_authority_model,
  delete_admin_authority_model
} = require('./admin_authority')

const {
  findone_admin_user_role_model,
  delete_admin_user_role_model
} = require('./admin_user_role')

const {
  find_admin_role_authority_model,
  delete_admin_role_authority_model
} = require('./admin_role_authority')

module.exports = {
  /* admin_user */
  page_find_admin_user_model,     /* 分页查询后台管理员列表 */
  delete_admin_user_model,        /* 根据单个字段删除后台用户 */
  update_admin_user_model,        /* 更新后台用户 */
  create_admin_user_model,        /* 创建后台用户 */
  findone_admin_user_model,       /* 根据单个字段查询单个用户 */
  /* admin_role */
  findone_admin_role_model,       /* 根据单个字段查询单个角色  */
  create_admin_role_model,        /* 创建后台角色  */
  update_admin_role_model,        /* 更新后台角色  */
  delete_admin_role_model,        /* 删除后台角色  */
  page_find_admin_role_model,     /* 分页查询后台角色列表 */
  findAll_admin_role_model,       /* 查询所有后台角色列表 */
  /*  admin_authority*/
  findone_admin_authority_model,  /* 根据单个字段查询单个权限 */
  delete_admin_authority_model,   /* 删除后台权限  */
  /*  admin_user_role*/
  findone_admin_user_role_model,  /* 根据单个字段查询用户角色表 */
  delete_admin_user_role_model,    /* 根据单个字段删除用户角色表 */
  /* role_authority */
  find_admin_role_authority_model, /* 根据单个字段或多个字段查询后台角色权限表关联 */
  delete_admin_role_authority_model /* 根据多个authority_id_arr数组删除角色权限表的权限角色关联 */
}