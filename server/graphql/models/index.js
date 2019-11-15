const { ApolloServer, gql } = require('apollo-server-koa')
const typeDefs = `
  type Query {
    hello: String
  }
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!'
  }
}

exports.typeDefs = typeDefs
exports.resolvers = resolvers
