const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Picture {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {object} ctx 上下文对象
   */
  static async createPicture (req, res, next) {
    const reqData = req.body

    try {
      let onePicture = await models.picture.findOne({
        where: { picture_title: reqData.picture_title }
      })
      if (onePicture) {
        throw new ErrorMessage('图片标题名已存在!')
      }
      if (!reqData.picture_url) {
        throw new ErrorMessage('请上传图片!')
      }

      await models.picture.create({
        picture_title: reqData.picture_title,
        picture_url: reqData.picture_url
          ? reqData.picture_url[0].response.data.filename
          : '',
        description: reqData.description,
        enable: reqData.enable
      })
      resAdminJson(res, {
        state: 'success',
        message: '图片创建成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取标签列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getPictureList (req, res, next) {
    const { page = 1, pageSize = 10 } = req.query
    try {
      let { count, rows } = await models.picture.findAndCountAll({
        attributes: [
          'picture_id',
          'picture_title',
          'picture_url',
          'description',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新标签
   * @param   {object} ctx 上下文对象
   */
  static async updatePicture (req, res, next) {
    const reqData = req.body
    try {
      await models.picture.update(
        {
          picture_title: reqData.picture_title,
          picture_url: reqData.picture_url[0].response
            ? reqData.picture_url[0].response.data.filename
            : reqData.picture_url,
          description: reqData.description,
          enable: reqData.enable
        },
        {
          where: {
            picture_id: reqData.picture_id // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新图片成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除标签
   */
  static async deletePicture (req, res, next) {
    const { picture_id } = req.body
    try {
      await models.picture.destroy({ where: { picture_id } })
      resAdminJson(res, {
        state: 'success',
        message: '删除图片成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Picture
