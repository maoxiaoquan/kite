"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Provide resolver functions for your schema fields
const article = __importStar(require("./core/article"));
const user = __importStar(require("./core/user"));
exports.typeDefs = `

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
`;
exports.resolvers = Object.assign(Object.assign({}, article.resolvers.Schema), { Query: Object.assign(Object.assign({}, article.resolvers.Query), user.resolvers.Query), Mutation: Object.assign(Object.assign({}, article.resolvers.Mutation), user.resolvers.Mutation) });
