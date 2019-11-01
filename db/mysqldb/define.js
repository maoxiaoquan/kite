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
  const attention_user = sequelize.define(
    /* 前台用户关注用户表 */
    require('./models_type/db_attention_user').NAME,
    require('./models_type/db_attention_user').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户关注文章标签表 */
  const attention_tag = sequelize.define(
    require('./models_type/db_attention_tag').NAME,
    require('./models_type/db_attention_tag').TABLE,
    SEQ_PARAMETER
  )

  /* 前台用户喜欢文章表 */
  const like_article = sequelize.define(
    require('./models_type/db_like_article').NAME,
    require('./models_type/db_like_article').TABLE,
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

  const like_dynamic = sequelize.define(
    require('./models_type/db_like_dynamic').NAME,
    require('./models_type/db_like_dynamic').TABLE,
    SEQ_PARAMETER
  )

  const attention_topic = sequelize.define(
    require('./models_type/db_attention_topic').NAME,
    require('./models_type/db_attention_topic').TABLE,
    SEQ_PARAMETER
  )

  const collect_blog = sequelize.define(
    require('./models_type/db_collect_blog').NAME,
    require('./models_type/db_collect_blog').TABLE,
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

  const collect_books = sequelize.define(
    // 收藏------书
    require('./models_type/db_collect_books').NAME,
    require('./models_type/db_collect_books').TABLE,
    SEQ_PARAMETER
  )

  const _define = {
    user,
    user_info,
    attention_user,
    user_role,
    user_authority,
    user_message,
    attention_tag,
    verify_code,
    article,
    article_tag,
    article_column,
    article_blog,
    like_article,
    article_comment,
    collect_blog,
    dynamic,
    dynamic_topic,
    dynamic_comment,
    like_dynamic,
    attention_topic,
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
    collect_books
  }

  return {
    ..._define,
    sequelize
  }
}
