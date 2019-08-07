const config = require('../config')
module.exports = [
  {
    authority_id: 'NZ6RFatVy',
    authority_name: '文章模块',
    authority_type: '1',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_url: 'article',
    authority_sort: 1,
    authority_description: '文章模块',
    enable: true
  },
  {
    authority_id: 'SIFWx5VfO',
    authority_name: '文章编写',
    authority_type: '2',
    authority_parent_id: 'NZ6RFatVy',
    authority_parent_name: '文章模块',
    authority_url: '/article/create',
    authority_sort: 0,
    authority_description: '文章编写',
    enable: false
  },
  {
    authority_id: config.USER_AUTHORITY.dfNoReviewArticleId,
    authority_name: '文章不需要审核',
    authority_type: '2',
    authority_parent_id: 'NZ6RFatVy',
    authority_parent_name: '文章模块',
    authority_url: '/article/create',
    authority_sort: 1,
    authority_description: '文章是不需要审核就能被别人看到，默认是开启的',
    enable: false
  },
  {
    authority_id: '7ucZnNUAH',
    authority_name: '评论模块',
    authority_type: '1',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_url: 'comment',
    authority_sort: 2,
    authority_description: '评论模块',
    enable: true
  },
  {
    authority_id: 'rEayGSFQR',
    authority_name: '发表评论',
    authority_type: '2',
    authority_parent_id: '7ucZnNUAH',
    authority_parent_name: '评论模块',
    authority_url: '/article/comment-create',
    authority_sort: 0,
    authority_description: '发表评论',
    enable: false
  },
  {
    authority_id: config.USER_AUTHORITY.dfNoReviewCommentId,
    authority_name: '评论不需要审核',
    authority_type: '2',
    authority_parent_id: '7ucZnNUAH',
    authority_parent_name: '评论模块',
    authority_url: '/article/comment-create',
    authority_sort: 1,
    authority_description: '编写的评论是不需要审核',
    enable: false
  },
  {
    authority_description: '动态模块',
    authority_id: 'rD4g352HY',
    authority_name: '动态模块',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_sort: 2,
    authority_type: '1',
    authority_url: 'dynamic',
    enable: true
  },
  {
    authority_description: '创建动态',
    authority_id: 'eOmxmyc4D',
    authority_name: '创建动态',
    authority_parent_id: 'rD4g352HY',
    authority_parent_name: '动态模块',
    authority_sort: 0,
    authority_type: '2',
    authority_url: '/dynamic/create',
    enable: false
  },
  {
    authority_description: '动态不需要审核',
    authority_id: config.USER_AUTHORITY.dfNoReviewDynamicId,
    authority_name: '动态不需要审核',
    authority_parent_id: 'rD4g352HY',
    authority_parent_name: '动态模块',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '/dynamic/create',
    enable: false
  },
  {
    authority_description: '动态评论',
    authority_id: '8Peb-nzfz',
    authority_name: '动态评论',
    authority_parent_id: 'rD4g352HY',
    authority_parent_name: '动态模块',
    authority_sort: 2,
    authority_type: '2',
    authority_url: '/dynamic-comment/create',
    enable: false
  },
  {
    authority_description: '动态评论不需要审核',
    authority_id: config.USER_AUTHORITY.dfNoReviewDynamicCommentId,
    authority_name: '动态评论不需要审核',
    authority_parent_id: 'rD4g352HY',
    authority_parent_name: '动态模块',
    authority_sort: 3,
    authority_type: '2',
    authority_url: '/dynamic-comment/create',
    enable: false
  }
]
