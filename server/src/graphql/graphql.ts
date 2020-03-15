// Provide resolver functions for your schema fields
import * as  article from './core/article'
import * as  user from './core/user'

export const typeDefs = `

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

export const resolvers = {
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

