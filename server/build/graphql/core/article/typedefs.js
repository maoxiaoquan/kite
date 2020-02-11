"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = `
  type ArticleView {
    aid: Int
    title: String
    thumb_count: Int
    comment_count: Int
  }

  type ArticleList {
    page: String
    pageSize: String
    list: [ArticleView]
  }
`;
exports.Query = `
  articleList: ArticleList
  recommendArticle: [ArticleView] 
`;
exports.Mutation = ` 
  
`;
