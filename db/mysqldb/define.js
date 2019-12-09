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
  const article_blog = sequelize.define(
    require('./models_type/db_article_blog').NAME,
    require('./models_type/db_article_blog').TABLE,
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
  const article_comment = sequelize.define(
    require('./models_type/db_article_comment').NAME,
    require('./models_type/db_article_comment').TABLE,
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

  // 内部显示为动态模块

  const dynamic = sequelize.define(
    require('./models_type/db_dynamic').NAME,
    require('./models_type/db_dynamic').TABLE,
    {
      ...SEQ_PARAMETER,
      initialAutoIncrement: 10000
    }
  )

  const dynamic_topic = sequelize.define(
    require('./models_type/db_dynamic_topic').NAME,
    require('./models_type/db_dynamic_topic').TABLE,
    SEQ_PARAMETER
  )

  const dynamic_comment = sequelize.define(
    require('./models_type/db_dynamic_comment').NAME,
    require('./models_type/db_dynamic_comment').TABLE,
    SEQ_PARAMETER
  )
  // book
  const book = sequelize.define(
    require('./models_type/db_book').NAME,
    require('./models_type/db_book').TABLE,
    SEQ_PARAMETER
  )

  const books = sequelize.define(
    require('./models_type/db_books').NAME,
    require('./models_type/db_books').TABLE,
    SEQ_PARAMETER
  )

  const book_comment = sequelize.define(
    require('./models_type/db_book_comment').NAME,
    require('./models_type/db_book_comment').TABLE,
    SEQ_PARAMETER
  )

  const books_comment = sequelize.define(
    require('./models_type/db_books_comment').NAME,
    require('./models_type/db_books_comment').TABLE,
    SEQ_PARAMETER
  )
  // 2019.11.4 0:49

  const virtual = sequelize.define(
    // 暂定定为虚拟币
    require('./models_type/db_virtual').NAME,
    require('./models_type/db_virtual').TABLE,
    SEQ_PARAMETER
  )

  // 2019.11.6 23:29
  const order = sequelize.define(
    // 暂定定为虚拟币
    require('./models_type/db_order').NAME,
    require('./models_type/db_order').TABLE,
    SEQ_PARAMETER
  )

  // 2019.11.13 10:46
  const collect = sequelize.define(
    // 收藏
    require('./models_type/db_collect').NAME,
    require('./models_type/db_collect').TABLE,
    SEQ_PARAMETER
  )

  const attention = sequelize.define(
    // 关注
    require('./models_type/db_attention').NAME,
    require('./models_type/db_attention').TABLE,
    SEQ_PARAMETER
  )

  const like = sequelize.define(
    // 喜欢
    require('./models_type/db_like').NAME,
    require('./models_type/db_like').TABLE,
    SEQ_PARAMETER
  )

  const thumb = sequelize.define(
    // 点赞
    require('./models_type/db_thumb').NAME,
    require('./models_type/db_thumb').TABLE,
    SEQ_PARAMETER
  )

  const attention_message = sequelize.define(
    // 关注
    require('./models_type/db_attention_message').NAME,
    require('./models_type/db_attention_message').TABLE,
    SEQ_PARAMETER
  )

  const _define = {
    user,
    user_info,
    user_role,
    user_authority,
    user_message,
    verify_code,
    article,
    article_tag,
    article_column,
    article_blog,
    article_comment,
    dynamic,
    dynamic_topic,
    dynamic_comment,
    admin_user,
    admin_role,
    admin_authority,
    system_log,
    book,
    books,
    book_comment,
    books_comment,
    picture,
    options,
    virtual,
    order,
    collect,
    attention,
    attention_message,
    like,
    thumb
  }

  return {
    ..._define,
    sequelize
  }
}
