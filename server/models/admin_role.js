const { ad_role } = require('../db/db')

/**
 * 查询后台角色
 * @param   {string} key 根据...key查询单个角色
 */

const findone_admin_role_model = (key) => {
  return ad_role.findOne({
    where: {
      ...key
    }
  })
}

/**
 * 创建后台角色
 * @param   {string} role_name 角色名字
 * @param   {string} role_description 角色介绍
 */

const create_admin_role_model = ({ role_name, role_description }) => {
  return ad_role.create({
    role_name,
    role_description
  })
}

/**
 * 更新后台角色
 * @param   {string} role_name 角色名字
 * @param   {string} role_description 角色介绍
 */

const update_admin_role_model = ({ role_name, role_description, role_id }) => {
  return ad_role.update({
    role_name,
    role_description
  }, {
      where: {
        role_id//查询条件
      }
    })
}

/**
 * 删除后台角色
 * @param   {string} role_id 角色id
 */

const delete_admin_role_model = (role_id) => {
  return ad_role.destroy({ 'where': { role_id } })
}


/**
 * 分页查询后台角色
 * @param   {number} page 当前页
 * @param   {number} pageSize 当前页显示多少条
 */
const page_find_admin_role_model = (page = 1, pageSize = 10) => {
  return ad_role.findAndCountAll({
    attributes: ['role_id', 'role_name', 'role_description'],
    where: '',//为空，获取全部，也可以自己添加条件
    offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
    limit: Number(pageSize)//每页限制返回的数据条数
  })
}

/**
 * 查询所有后台角色
 */

const findAll_admin_role_model = () => ad_role.findAll()

module.exports = {
  findone_admin_role_model,
  create_admin_role_model,
  update_admin_role_model,
  delete_admin_role_model,
  page_find_admin_role_model,
  findAll_admin_role_model
}