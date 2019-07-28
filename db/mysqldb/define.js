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
  const user_attention = sequelize.define(
    /* 前台用户关注用户表 */
    require('./models_type/db_user_attention').NAME,
    require('./models_type/db_user_attention').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户关注文章标签表 */
  const subscribe_tag = sequelize.define(
    require('./models_type/db_subscribe_tag').NAME,
    require('./models_type/db_subscribe_tag').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户喜欢文章表 */
  const user_like = sequelize.define(
    require('./models_type/db_user_like').NAME,
    require('./models_type/db_user_like').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户信息表 */
  const user_info = sequelize.define(
    require('./models_type/db_user_info').NAME,
    require('./models_type/db_user_info').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户注册验证码 */
  const verify_code = sequelize.define(
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
  const article_tag = sequelize.define(
    require('./models_type/db_article_tag').NAME,
    require('./models_type/db_article_tag').TABLE,
    SEQ_PARAMETER
  )
  /* 前台文章官方专栏 */
  const article_column = sequelize.define(
    require('./models_type/db_article_column').NAME,
    require('./models_type/db_article_column').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户文章专题表 */
  const article_topic = sequelize.define(
    require('./models_type/db_article_topic').NAME,
    require('./models_type/db_article_topic').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户角色表 */
  const user_role = sequelize.define(
    require('./models_type/db_user_role').NAME,
    require('./models_type/db_user_role').TABLE,
    SEQ_PARAMETER
  )
  /* 前台用户权限表 */
  const user_authority = sequelize.define(
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
  const user_message = sequelize.define(
    require('./models_type/db_user_message').NAME,
    require('./models_type/db_user_message').TABLE,
    SEQ_PARAMETER
  )
  /**
   * 后台表
   */

  /* 后台用管理员表 */
  const admin_user = sequelize.define(
    require('./models_type/db_admin_user').NAME,
    require('./models_type/db_admin_user').TABLE,
    SEQ_PARAMETER
  )
  /* 后台角色表 */
  const admin_role = sequelize.define(
    require('./models_type/db_admin_role').NAME,
    require('./models_type/db_admin_role').TABLE,
    SEQ_PARAMETER
  )
  /* 权限表 */
  const admin_authority = sequelize.define(
    require('./models_type/db_admin_authority').NAME,
    require('./models_type/db_admin_authority').TABLE,
    SEQ_PARAMETER
  )
  /* 后台操作日志表 */
  const system_log = sequelize.define(
    require('./models_type/db_system_log').NAME,
    require('./models_type/db_system_log').TABLE,
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
    user_attention,
    subscribe_tag,
    user_like,
    user_info,
    verify_code,
    article,
    article_tag,
    article_column,
    article_topic,
    user_role,
    user_authority,
    comment,
    user_message,
    admin_user,
    admin_role,
    admin_authority,
    system_log,
    picture,
    options
  }

  return {
    ..._define,
    sequelize
  }
}
