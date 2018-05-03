const db = require('../db/db')
const de = require('../utils/data_example')

class index {
  constructor (state) {
    this.state = {
      title: '333'
    }
  }

  async get_index (ctx) {

    let page = 1
    let pageSize = 10
    const title = 'home'

    let sql_article_list = await db.article.findAndCountAll({
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize//每页限制返回的数据条数
    })

    console.log('sql_article_list', sql_article_list)

    await de.render(ctx, {
      title: title,
      view_url: 'default/index',
      state: 'success',
      message: 'home',
      data: {
        count: sql_article_list.count,
        article_list: sql_article_list.rows
      }
    })
  }
}

module.exports = new index()
