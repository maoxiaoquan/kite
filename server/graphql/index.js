const { ApolloServer } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { typeDefs, resolvers } = require('./graphql')
const isProd = process.env.NODE_ENV === 'production'
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
    formatError: error => ({
      code: error.extensions.code,
      message: error.message
    })
  })

  server.applyMiddleware({ app, path: '/graphql' })
}

module.exports = graphql
