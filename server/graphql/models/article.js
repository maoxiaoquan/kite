// Construct a schema, using GraphQL schema language
const { ApolloServer, gql } = require('apollo-server-koa')
const typeDefs = gql`
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
