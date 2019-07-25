const config = require('../config')
const dfUserAuthorityList = require('./dfUserAuthorityList')
let operatingArr = []
let limitArr = [config.USER_AUTHORITY.dfArticleNoReviewId]
dfUserAuthorityList.map(item => {
  if (item.authority_type === '2' && !~limitArr.indexOf(item.authority_id)) {
    operatingArr.push(item.authority_id)
  }
})

module.exports = [
  {
    // 初始化创建默认用户角色，并且只有一个超管的角色，否则会报错
    user_role_id: config.USER_ROLE.dfId,
    user_role_name: '默认用户',
    user_role_description: '默认用户，拥有默认用户的权限',
    user_authority_ids: operatingArr.join(','),
    user_role_type: 1,
    is_show: false,
    enable: true
  },
  {
    // 初始化创建默认用户角色，此角色是定制角色,定制角色id 都都以commission_ 开头
    user_role_id: config.USER_ROLE.dfLegalizeId,
    user_role_name: '认证作者',
    user_role_description: '认证作者发布文章时，默认对所有人可见',
    user_authority_ids: config.USER_AUTHORITY.dfArticleNoReviewId,
    user_role_type: 1,
    is_show: true,
    enable: true
  },
  {
    // 初始化创建默认用户角色，并且只有一个超管的角色，否则会报错
    user_role_id: config.USER_ROLE.management_team,
    user_role_name: '官方管理团队',
    user_role_description:
      '官方管理团队，特殊角色拥有某些特殊的权限，网站管理者团队才会拥有',
    user_authority_ids: '',
    user_role_type: 2,
    is_show: false,
    enable: true
  }
]
