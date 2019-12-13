const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { typeDefs, resolvers } = require('./graphql')
const jwt = require('jsonwebtoken')
const isProd = process.env.NODE_ENV === 'production'
const models = require('../../db/mysqldb')
/**
 * 中间件
 * 1 自定义context 可以传入ctx对象
 * 2 增加resolve执行的信息
 * 3 自定义日志输出
 * 4 错误处理统一处理
 * @param app
 */
function graphql (app) {
  const server = new ApolloServer({
    introspection: !isProd,
    playground: !isProd,
    debug: !isProd,
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    }),
    context: async ({ req, res }) => {
      // console.log(req.body.query.indexOf('mutation{'));
      // 如果header中，包含access token，那么判断是否有效，无效则拒绝请求
      let user = null
      let islogin = false
      let token =
        req.body.accessToken ||
        req.query.accessToken ||
        req.headers['access-token'] ||
        req.cookies.accessToken
      // 存在token，解析token

      if (token) {
        await jwt.verify(token, 'client', async (err, decoded) => {
          if (err) {
            islogin = false
            user = {}
          } else {
            let userInfo = await models.user.findOne({
              where: { uid: decoded.uid }
            })
            if (userInfo) {
              islogin = true
              user = await models.user.findOne({
                where: { uid: decoded.uid }
              })
            } else {
              islogin = false
              user = {}
            }
          }
        })
      }
      // 获取客户端请求ip
      let ip
      if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].toString().split(',')[0]
      } else {
        ip = req.connection.remoteAddress
      }

      return {
        token,
        user,
        islogin,
        ip,
        req,
        res
      }
    },
    formatError: error => ({
      code: error.extensions.code,
      message: error.message
    })
  })

  server.applyMiddleware({ app, path: '/graphql' })
}

module.exports = graphql
