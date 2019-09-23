const config = require('../../../../server/config')
module.exports = [
  {
    authority_description: '个人专栏不需要审核',
    authority_id: config.ARTICLE_BLOG.dfNoReviewArticleBlogId,
    authority_name: '个人专栏不需要审核',
    authority_parent_id: 'NZ6RFatVy',
    authority_parent_name: '文章模块',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '用户模块',
    authority_id: 'vckA5WVEG',
    authority_name: '用户模块',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_sort: 1,
    authority_type: '1',
    authority_url: '',
    enable: true
  },
  {
    authority_description: '用户修改头像不需要审核',
    authority_id: config.USER.dfUserAvatarNoReviewId,
    authority_name: '用户修改头像不需要审核',
    authority_parent_id: 'vckA5WVEG',
    authority_parent_name: '用户模块',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '',
    enable: true
  }
]
