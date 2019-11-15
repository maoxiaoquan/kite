const { ApolloServer, gql } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./models')
const server = new ApolloServer({ typeDefs: gql(typeDefs), resolvers })
module.exports = server
