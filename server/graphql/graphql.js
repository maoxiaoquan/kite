// Provide resolver functions for your schema fields
const article = require('./core/article')
const user = require('./core/user')

const typeDefs = `

  ${article.typeDefs.Schema}
  ${user.typeDefs.Schema}

  # the schema allows the following query:
  type Query {
    _: Boolean
     ${article.typeDefs.Query}
     ${user.typeDefs.Query}
  }

  # this schema allows the following mutation:
  type Mutation {
    _: Boolean
    ${article.typeDefs.Mutation}
    ${user.typeDefs.Mutation}
  }

  schema {
    mutation: Mutation
    query: Query
  }
`

const resolvers = {
  ...article.resolvers.Schema,
  Query: {
    ...article.resolvers.Query,
    ...user.resolvers.Query
  },
  Mutation: {
    ...article.resolvers.Mutation,
    ...user.resolvers.Mutation
  }
}

exports.typeDefs = typeDefs
exports.resolvers = resolvers
