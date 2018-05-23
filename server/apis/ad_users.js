const {format_data} = require('../utils/res_data')
const db = require('../db/db')
const tokens = require('../utils/tokens')

class ad_users {
  constructor () {
    // super()
  }

  /**
   * 获取用户操作
   * @param   {obejct} ctx 上下文对象
   */
  async ad_get_users (ctx) {
    const res_data = ctx.query
    let page = res_data.page || 1
    let pageSize = res_data.pageSize || 10

    let ad_user_findAndCountAll = await db.ad_user.findAndCountAll({
      attributes: ['uid','account', 'nickname', 'email', 'phone', 'reg_time', 'last_sign_time', 'reg_ip', 'enable'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: ad_user_findAndCountAll.count,
        admin_user_list: ad_user_findAndCountAll.rows
      }
    }, true)

  }

}

module.exports = new ad_users()