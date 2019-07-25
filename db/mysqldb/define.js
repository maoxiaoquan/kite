/**
 * 前台表
 */

/* 前台用户表 */
const SEQ_PARAMETER = {
  timestamps: false,
  freezeTableName: true
}

module.exports = sequelize => {
  const user = sequelize.define(
    /* 前台用户表 */
    require('./models_type/db_user').NAME,
    require('./models_type/db_user').TABLE,
    {
      ...SEQ_PARAMETER,
      initialAutoIncrement: 10000
    }
  )
  const userAttention = sequelize.define(
    /* 前台用户关注用户表 */
    require('./models_type/db_user_attention').NAME,
    require('./models_type/db_user_attention').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户关注文章标签表 */
  const subscribeArticleTag = sequelize.define(
    require('./models_type/db_subscribe_article_tag').NAME,
    require('./models_type/db_subscribe_article_tag').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户喜欢文章表 */
  const userLikeArticle = sequelize.define(
    require('./models_type/db_user_like_article').NAME,
    require('./models_type/db_user_like_article').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户信息表 */
  const userInfo = sequelize.define(
    require('./models_type/db_user_info').NAME,
    require('./models_type/db_user_info').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户注册验证码 */
  const verifyCode = sequelize.define(
    require('./models_type/db_verify_code').NAME,
    require('./models_type/db_verify_code').TABLE,
    SEQ_PARAMETER
  )

  /* 前台文章表 */
  const article = sequelize.define(
    require('./models_type/db_article').NAME,
    require('./models_type/db_article').TABLE,
    {
      ...SEQ_PARAMETER,
      initialAutoIncrement: 10000
    }
  )
  /* 前台文章官方标签表 */
  const articleTag = sequelize.define(
    require('./models_type/db_article_tag').NAME,
    require('./models_type/db_article_tag').TABLE,
    SEQ_PARAMETER
  )
  /* 前台文章官方专栏 */
  const articleColumn = sequelize.define(
    require('./models_type/db_article_column').NAME,
    require('./models_type/db_article_column').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户文章专题表 */
  const userArticleTopic = sequelize.define(
    require('./models_type/db_user_article_topic').NAME,
    require('./models_type/db_user_article_topic').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户角色表 */
  const userRole = sequelize.define(
    require('./models_type/db_user_role').NAME,
    require('./models_type/db_user_role').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户权限表 */
  const userAuthority = sequelize.define(
    require('./models_type/db_user_authority').NAME,
    require('./models_type/db_user_authority').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户评论表 */
  const comment = sequelize.define(
    require('./models_type/db_comment').NAME,
    require('./models_type/db_comment').TABLE,
    SEQ_PARAMETER
  )
  /* 用户消息表 */
  const userMessage = sequelize.define(
    require('./models_type/db_user_message').NAME,
    require('./models_type/db_user_message').TABLE,
    SEQ_PARAMETER
  )
  /**
   * 后台表
   */

  /* 后台用管理员表 */
  const adminUser = sequelize.define(
    require('./models_type/db_admin_user').NAME,
    require('./models_type/db_admin_user').TABLE,
    SEQ_PARAMETER
  )
  /* 后台角色表 */
  const adminRole = sequelize.define(
    require('./models_type/db_admin_role').NAME,
    require('./models_type/db_admin_role').TABLE,
    SEQ_PARAMETER
  )
  /* 权限表 */
  const adminAuthority = sequelize.define(
    require('./models_type/db_admin_authority').NAME,
    require('./models_type/db_admin_authority').TABLE,
    SEQ_PARAMETER
  )
  /* 后台操作日志表 */
  const adminSystemLog = sequelize.define(
    require('./models_type/db_admin_system_log').NAME,
    require('./models_type/db_admin_system_log').TABLE,
    SEQ_PARAMETER
  )

  /**
   * 公共表
   */

  /* 图片表 */
  const picture = sequelize.define(
    require('./models_type/db_picture').NAME,
    require('./models_type/db_picture').TABLE,
    SEQ_PARAMETER
  )

  /* 图片表 */
  const options = sequelize.define(
    require('./models_type/db_options').NAME,
    require('./models_type/db_options').TABLE,
    SEQ_PARAMETER
  )

  const _define = {
    user,
    userAttention,
    subscribeArticleTag,
    userLikeArticle,
    userInfo,
    verifyCode,
    article,
    articleTag,
    articleColumn,
    userArticleTopic,
    userRole,
    userAuthority,
    comment,
    userMessage,
    adminUser,
    adminRole,
    adminAuthority,
    adminSystemLog,
    picture,
    options
  }

  return {
    ..._define,
    sequelize
  }
}
