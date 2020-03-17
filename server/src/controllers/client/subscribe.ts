const { resClientJson } = require('../../utils/resData')
import moment from 'moment'
const models = require('../../../../db/mysqldb/index')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
import { userMessageAction, modelAction, modelName } from '../../utils/constant'

const userVirtual = require('../../common/userVirtual')

class Subscribe {
  static async getArticleTagList(req: any, res: any, next: any) {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 24
    let tag_name = req.query.tag_name
    let whereParams: any = {
      enable: 1
    }
    try {
      tag_name &&
        (whereParams['name'] = {
          [Op.like]: `%${tag_name}%`
        })

      let { count, rows } = await models.article_tag.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [
          ['attention_count', 'DESC'] // ASC
        ]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'subscribe_count',
          await models.attention.count({
            where: {
              associate_id: rows[i].id || '',
              is_associate: true,
              type: modelName.article_tag
            }
          })
        )
        rows[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              tag_ids: {
                [Op.like]: `%${rows[i].tag_id}%`
              },
              ...clientWhere.article.otherList
            }
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: 'subscribe',
        data: {
          page,
          count,
          pageSize,
          tag_name,
          article_tag_list: rows
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async getArticleTagListMy(req: any, res: any, next: any) {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 25
    let { user = '' } = req
    let whereParams: any = {
      enable: true
    }

    try {
      let allSubscribeArticleTag = await models.attention.findAll({
        where: {
          uid: user.uid,
          type: modelName.article_tag,
          is_associate: true
        }
      })

      console.log(
        '---------------------allSubscribeArticleTag',
        allSubscribeArticleTag
      )

      if (allSubscribeArticleTag.length > 0) {
        let myArticleTag = allSubscribeArticleTag.map((result: any) => {
          return result.associate_id
        })

        console.log('myArticleTag', myArticleTag)

        myArticleTag &&
          (whereParams['id'] = {
            [Op.or]: myArticleTag
          })

        let { count, rows } = await models.article_tag.findAndCountAll({
          where: whereParams, // 为空，获取全部，也可以自己添加条件
          offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
          limit: pageSize, // 每页限制返回的数据条数
          order: [
            ['attention_count', 'DESC'] // ASC
          ]
        })

        for (let i in rows) {
          rows[i].setDataValue(
            'subscribe_count',
            await models.attention.count({
              where: {
                associate_id: rows[i].id || '',
                is_associate: true,
                type: modelName.article_tag
              }
            })
          )
          rows[i].setDataValue(
            'article_count',
            await models.article.count({
              where: {
                tag_ids: {
                  [Op.like]: `%${rows[i].tag_id}%`
                },
                ...clientWhere.article.otherList
              }
            })
          )
        }

        await resClientJson(res, {
          state: 'success',
          message: 'subscribe',
          data: {
            page,
            count,
            pageSize,
            article_tag_list: rows
          }
        })
      } else {
        await resClientJson(res, {
          state: 'success',
          message: 'subscribe',
          data: {
            page: 1,
            count: 0,
            pageSize: 25,
            article_tag_list: []
          }
        })
      }
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取当前用户订阅的标签成功
   * @param   {object} ctx 上下文对象
   */

  static async getSubscribeTagMyAll(req: any, res: any, next: any) {
    let { user = '', islogin } = req
    try {
      if (!islogin) {
        resClientJson(res, {
          state: 'success',
          message: '获取当前用户订阅的标签成功',
          data: {
            subscribe_article_tag: []
          }
        })
      }
      let allSubscribeArticleTag = await models.attention.findAll({
        where: {
          uid: user.uid,
          type: modelName.article_tag,
          is_associate: true
        }
      })
      resClientJson(res, {
        state: 'success',
        message: '获取当前用户订阅的标签成功',
        data: {
          subscribe_article_tag: allSubscribeArticleTag
        }
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

export default Subscribe
