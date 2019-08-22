const config = require('../../../../server/config')
module.exports = [
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
