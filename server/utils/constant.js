const statusList = {
  // 所有内容的审核状态
  pendingReview: 1, // 待审核
  reviewSuccess: 2, // 审核成功
  reviewFail: 3, // 审核失败
  freeReview: 4, // 免审核
  deleted: 5 // 已删除
}
const statusListText = {
  // 所有内容的审核状态文字
  [statusList.pendingReview]: '待审核', // 待审核
  [statusList.reviewSuccess]: '审核成功', // 审核成功
  [statusList.reviewFail]: '审核失败', // 审核失败
  [statusList.freeReview]: '免审核', // 免审核
  [statusList.deleted]: '已删除' // 已删除
}

const articleType = {
  // 文章的类型
  article: 1, // 文章
  note: 2, // 笔记
  draft: 3 // 草稿
}

const articleTypeText = {
  // 文章的类型
  [articleType.article]: '文章', // 文章
  [articleType.note]: '笔记', // 笔记
  [articleType.draft]: '草稿' // 草稿
}

const dynamicType = {
  // 文章的类型
  dynamic: 1, // 默认动态
  img: 2, // 图片
  link: 3, // 链接
  video: 4 // 视频
}

const dynamicTypeText = {
  // 文章的类型
  [dynamicType.dynamic]: '默认动态', // 文章
  [dynamicType.img]: '图片', // 笔记
  [dynamicType.link]: '链接', // 草稿
  [dynamicType.video]: '视频' // 草稿
}

const userMessageType = {
  // 文章的类型
  user: 1, // 用户
  article: 2, // 文章
  article_blog: 3, // 文章个人专栏
  article_comment: 4, // 文章评论
  book: 5, // 小书章节
  book_comment: 6, // 小书章节评论
  books: 7, // 小书
  books_comment: 8, // 小书评论
  dynamic: 9, // 片刻
  dynamic_comment: 10, // 片刻评论
  thumb_dynamic: 11, // 片刻评论
  like_article: 12, // 片刻评论
  collect_blog: 13, // 片刻评论
  collect_books: 14 // 片刻评论
}

const userMessageAction = {
  system: 1, // 系统消息
  like: 2, // 喜欢
  collect: 3, // 收藏
  attention: 4, // 关注
  comment: 5, // 评论
  reply: 6, // 回复
  thumb: 7, // 赞
  buy: 8 // 购买
}

const userMessageActionText = {
  [userMessageAction.system]: '新的系统消息',
  [userMessageAction.like]: '新的喜欢',
  [userMessageAction.collect]: '新的收藏',
  [userMessageAction.attention]: '新的关注',
  [userMessageAction.comment]: '新的评论',
  [userMessageAction.reply]: '新的赞',
  [userMessageAction.thumb]: '新的回复',
  [userMessageAction.buy]: '新的购买'
}

const userMessageIsPush = {
  open: 1, // 开启
  close: 2 // 关闭
}

// 2019.11.4 15:34

const virtualPlusLess = {
  // 虚拟币动作
  plus: 1, // 加
  less: 2 // 减
}

const virtualAction = {
  // 动作
  check_in: 1, // 签到
  create: 2, // 创建
  like: 3, // 喜欢
  collect: 4, // 收藏
  comment: 5, // 评论
  reply: 6, // 回复
  thumb: 7, // 点赞
  sell: 8, // 卖
  buy: 9, // 买
  recover: 10, // 系统回收
  obtain_like: 11, // 收到喜欢
  obtain_collect: 12, // 收到收藏
  obtain_comment: 13, // 收到评论
  obtain_reply: 14, // 收到回复
  obtain_thumb: 15, // 收到点赞
  registered: 16 // 注册
}

const virtualActionText = {
  // 动作
  [virtualAction.check_in]: '签到', // 签到
  [virtualAction.create]: '创建', // 创建
  [virtualAction.like]: '喜欢', // 喜欢
  [virtualAction.collect]: '收藏', // 收藏
  [virtualAction.comment]: '评论或者回复', // 评论
  [virtualAction.reply]: '评论或者回复', // 回复
  [virtualAction.thumb]: '点赞', // 点赞
  [virtualAction.sell]: '卖', // 卖
  [virtualAction.buy]: '买', // 买
  [virtualAction.recover]: '系统回收', // 系统回收
  [virtualAction.obtain_like]: '收到喜欢', // 收到喜欢
  [virtualAction.obtain_collect]: '收到收藏', // 收到收藏
  [virtualAction.obtain_comment]: '收到评论', // 收到评论
  [virtualAction.obtain_reply]: '收到回复', // 收到回复
  [virtualAction.obtain_thumb]: '收到点赞', // 收到点赞
  [virtualAction.registered]: '默认' // 默认
}

const virtualType = {
  // 关联模块
  other: 1, // 其他
  user: 2, // 用户
  article: 3, // 文章
  article_blog: 4, // 文章个人专栏
  book: 5, // 小书章节
  books: 6, // 小书
  dynamic: 7, // 片刻
  system: 8 // 系统
}

const virtualTypeText = {
  // 关联模块
  [virtualType.other]: '其他', // 其他
  [virtualType.user]: '用户', // 用户
  [virtualType.article]: '文章', // 文章
  [virtualType.article_blog]: '文章个人专栏', // 文章个人专栏
  [virtualType.book]: '小书章节', // 小书章节
  [virtualType.books]: '小书', // 小书
  [virtualType.dynamic]: '片刻', // 片刻
  [virtualType.system]: '系统' // 系统
}

const virtualInfo = {
  [virtualAction.check_in]: {
    // 签到+
    plusLess: virtualPlusLess.plus, // +
    [virtualType.system]: 50 // 用户每天签到:+50
  },
  [virtualAction.create]: {
    // 创建内容-
    plusLess: virtualPlusLess.less, // -
    [virtualType.article]: 20, // 创建文章：-20
    [virtualType.article_blog]: 10, // 创建个人专栏文章：-10
    [virtualType.book]: 5, // 创建小书章节：-5
    [virtualType.books]: 50, // 创建小书：-50
    [virtualType.dynamic]: 15 // 创建动态：-15
  },
  [virtualAction.like]: {
    // 喜欢
    plusLess: virtualPlusLess.less, // -
    [virtualType.article]: 5 // 喜欢文章: -5
  },
  [virtualAction.collect]: {
    // 收藏
    plusLess: virtualPlusLess.less, // -
    [virtualType.article_blog]: 5 // 收藏个人专栏: -5
  },
  [virtualAction.comment]: {
    // 创建评论-
    plusLess: virtualPlusLess.less, // -
    [virtualType.article]: 5, // 创建文章评论：-5
    [virtualType.book]: 5, // 创建小书章节评论：-5
    [virtualType.books]: 5, // 创建小书评论：-5
    [virtualType.dynamic]: 5 // 创建动态评论：-5
  },
  [virtualAction.reply]: {
    // 回复评论-
    plusLess: virtualPlusLess.less, // -
    [virtualType.article]: 5, // 创建文章回复：-5
    [virtualType.book]: 5, // 创建小书章节回复：-5
    [virtualType.books]: 5, // 创建小书回复：-5
    [virtualType.dynamic]: 5 // 创建动态回复：-5
  },
  [virtualAction.thumb]: {
    plusLess: virtualPlusLess.less, // -
    [virtualType.dynamic]: 5 // 点赞动态：-5
  },
  [virtualAction.obtain_like]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.article]: 5 // 收到喜欢文章: +5
  },
  [virtualAction.obtain_collect]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.article_blog]: 5 // 收到收藏个人专栏:  +5
  },
  [virtualAction.obtain_comment]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.article]: 5, // 收到文章评论：+5
    [virtualType.book]: 5, // 收到小书章节评论：+5
    [virtualType.books]: 5, // 收到小书评论：+5
    [virtualType.dynamic]: 5 // 收到动态评论：+5
  },
  [virtualAction.obtain_reply]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.article]: 5, // 收到文章回复：+5
    [virtualType.book]: 5, // 收到小书章节回复：+5
    [virtualType.books]: 5, // 收到小书回复：+5
    [virtualType.dynamic]: 5 // 收到动态回复：+5
  },
  [virtualAction.obtain_thumb]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.dynamic]: 5 // 收到点赞动态：+5
  },
  [virtualAction.registered]: {
    plusLess: virtualPlusLess.plus, // +
    [virtualType.system]: 3000 // 注册增加3000：+5
  }
}

// 2019.11.6 0:57
// 支付购买开始

const payType = {
  shell: 1 // 贝壳
}

const payTypeText = {
  [payType.shell]: '贝壳' // 贝壳
}

const productType = {
  // 商品类型
}

module.exports = {
  statusList,
  statusListText,
  articleType,
  articleTypeText,
  dynamicType,
  dynamicTypeText,
  userMessageType,
  userMessageAction,
  userMessageActionText,
  userMessageIsPush,
  virtualType,
  virtualPlusLess,
  virtualAction,
  virtualInfo,
  virtualActionText,
  virtualTypeText,
  payType,
  payTypeText
}
