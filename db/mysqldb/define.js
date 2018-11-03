/**
 * 前台表
 */

/*前台用户表*/
const SEQ_PARAMETER = {
  timestamps: false,
  freezeTableName: true
}

module.exports = function define(sequelize) {
  let _define = {
    /*前台用户表*/
    user: sequelize.define(
      require('./models_type/db_user').NAME,
      require('./models_type/db_user').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户关注用户表*/
    user_attention: sequelize.define(
      require('./models_type/db_user_attention').NAME,
      require('./models_type/db_user_attention').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户关注文章标签表*/
    subscribe_article_tag: sequelize.define(
      require('./models_type/db_subscribe_article_tag').NAME,
      require('./models_type/db_subscribe_article_tag').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户喜欢文章表*/
    user_like_article: sequelize.define(
      require('./models_type/db_user_like_article').NAME,
      require('./models_type/db_user_like_article').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户信息表*/
    user_info: sequelize.define(
      require('./models_type/db_user_info').NAME,
      require('./models_type/db_user_info').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户注册验证码*/
    verify_code: sequelize.define(
      require('./models_type/db_verify_code').NAME,
      require('./models_type/db_verify_code').TABLE,
      SEQ_PARAMETER
    ),
    /*前台文章表*/
    article: sequelize.define(
      require('./models_type/db_article').NAME,
      require('./models_type/db_article').TABLE,
      SEQ_PARAMETER
    ),
    /*前台文章官方标签表*/
    article_tag: sequelize.define(
      require('./models_type/db_article_tag').NAME,
      require('./models_type/db_article_tag').TABLE,
      SEQ_PARAMETER
    ),
    /*前台文章官方专栏*/
    article_column: sequelize.define(
      require('./models_type/db_article_column').NAME,
      require('./models_type/db_article_column').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户文章专题表*/
    user_article_topic: sequelize.define(
      require('./models_type/db_user_article_topic').NAME,
      require('./models_type/db_user_article_topic').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户角色表*/
    user_tag: sequelize.define(
      require('./models_type/db_user_tag').NAME,
      require('./models_type/db_user_tag').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户评论表*/
    comment: sequelize.define(
      require('./models_type/db_comment').NAME,
      require('./models_type/db_comment').TABLE,
      SEQ_PARAMETER
    ),
    /*前台用户浏览行为表*/
    user_behavior: sequelize.define(
      require('./models_type/db_user_behavior').NAME,
      require('./models_type/db_user_behavior').TABLE,
      SEQ_PARAMETER
    ),
    /*用户消息表*/
    user_message: sequelize.define(
      require('./models_type/db_user_message').NAME,
      require('./models_type/db_user_message').TABLE,
      SEQ_PARAMETER
    ),

    /**
     * 后台表
     */

    /*后台用管理员表*/
    admin_user: sequelize.define(
      require('./models_type/db_admin_user').NAME,
      require('./models_type/db_admin_user').TABLE,
      SEQ_PARAMETER
    ),
    /*后台角色表*/
    admin_role: sequelize.define(
      require('./models_type/db_admin_role').NAME,
      require('./models_type/db_admin_role').TABLE,
      SEQ_PARAMETER
    ),
    /*用户与角色关系表*/
    admin_user_role: sequelize.define(
      require('./models_type/db_admin_user_role').NAME,
      require('./models_type/db_admin_user_role').TABLE,
      SEQ_PARAMETER
    ),
    /*权限表*/
    admin_authority: sequelize.define(
      require('./models_type/db_admin_authority').NAME,
      require('./models_type/db_admin_authority').TABLE,
      SEQ_PARAMETER
    ),
    /*角色与权限关系表*/
    admin_role_authority: sequelize.define(
      require('./models_type/db_admin_role_authority').NAME,
      require('./models_type/db_admin_role_authority').TABLE,
      SEQ_PARAMETER
    ),
    /*后台操作日志表*/
    admin_system_log: sequelize.define(
      require('./models_type/db_admin_system_log').NAME,
      require('./models_type/db_admin_system_log').TABLE,
      SEQ_PARAMETER
    ),

    /**
     * 公共表
     */

    /*图片表*/
    picture: sequelize.define(
      require('./models_type/db_picture').NAME,
      require('./models_type/db_picture').TABLE,
      SEQ_PARAMETER
    )
  }

  return { ..._define, sequelize }
}
