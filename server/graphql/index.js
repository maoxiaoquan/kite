// const { ApolloServer, gql } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./models')
// const server = new ApolloServer({ typeDefs: gql(typeDefs), resolvers })
// module.exports = server

/**
 * 自定义异常类
 */
class RequestException extends Error {
  constructor () {
    super()
    this.name = 'RequestException'
    this.code = null
    this.message = null
    this.serverName = null
    this.methodName = null
    this.fullMessage = null
  }
}

const reIpv4 = '.*:.*:.*:(.*)'
/**
 * 中间件
 * 1 自定义context 可以传入ctx对象
 * 2 增加resolve执行的信息
 * 3 自定义日志输出
 * 4 错误处理统一处理
 * @param options
 * @return {function(*=, *)}
 */
function graphql (options) {
  const { graphqlKoa, gql } = require('apollo-server-koa')
  const logger = options.log && 'info' in options.log ? options.log : console
  return async (ctx, next) => {
    await graphqlKoa({
      typeDefs: gql(typeDefs),
      resolvers,
      context: {
        // 传入ctx  也可以增加其他值  如用户信息等
        ctx: ctx
      },
      tracing: true,
      formatError (error) {
        if (typeof error === 'object') {
          if (
            typeof error.originalError === 'object' &&
            error.originalError.name === 'RequestException'
          ) {
            // 自定义的请求异常 则进行拦截
            error.message = 'thrift error' // 返回到前端message
            return error
          }
        }
        return error
      },
      formatResponse (data, all) {
        // data 为返回到前端的全部数据  all为执行resolve相关的信息 类似ctx
        let ipv4 = ctx.ip.match(reIpv4)
        if (ipv4 instanceof Array && ipv4.length === 2) ipv4 = ipv4[1]
        else if (ipv4 === null) ipv4 = ctx.ip
        else ctx.ipv4 = ipv4 // 找到ip
        if (ctx.method !== 'OPTIONS') {
          logger.info(
            ipv4,
            `${data.extensions.tracing.duration / 1000}ms`,
            '\n============query=======\n',
            all.query,
            '\n============variables=======\n',
            all.variables
          )
        }
        delete data.extensions // 前端不需要 则删除
        return data
      }
    })(ctx)
  }
}

module.exports = graphql
