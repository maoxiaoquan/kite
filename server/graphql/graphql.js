// Provide resolver functions for your schema fields
const article = require('./core/article')

const typeDefs = `

  ${article.typeDefs.Schema}

  # the schema allows the following query:
  type Query {
    _: Boolean
     ${article.typeDefs.Query}
  }

  # this schema allows the following mutation:
  type Mutation {
    _: Boolean
    ${article.typeDefs.Mutation}
  }

  schema {
    mutation: Mutation
    query: Query
  }
`

const resolvers = {
  ...article.resolvers.Schema,
  Query: {
    ...article.resolvers.Query
  },
  Mutation: {
    ...article.resolvers.Mutation
  }
}

exports.typeDefs = typeDefs
exports.resolvers = resolvers
