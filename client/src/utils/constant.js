export const statusList = {
  // 所有内容的审核状态
  pendingReview: 1, // 待审核
  reviewSuccess: 2, // 审核成功
  reviewFail: 3, // 审核失败
  freeReview: 4, // 免审核
  deleted: 5 // 已删除
}
export const statusListText = {
  // 所有内容的审核状态文字
  [statusList.pendingReview]: '待审核', // 待审核
  [statusList.reviewSuccess]: '审核成功', // 审核成功
  [statusList.reviewFail]: '审核失败', // 审核失败
  [statusList.freeReview]: '免审核', // 免审核
  [statusList.deleted]: '已删除' // 已删除
}

export const articleType = {
  // 文章的类型
  article: 1, // 文章
  note: 2, // 笔记
  draft: 3 // 草稿
}

export const articleTypeText = {
  // 文章的类型
  [articleType.article]: '文章', // 文章
  [articleType.note]: '笔记', // 笔记
  [articleType.draft]: '草稿' // 草稿
}

export const dynamicType = {
  // 文章的类型
  dynamic: 1, // 默认动态
  img: 2, // 图片
  link: 3, // 链接
  video: 4 // 视频
}

export const dynamicTypeText = {
  // 文章的类型
  [dynamicType.dynamic]: '默认动态', // 文章
  [dynamicType.img]: '图片', // 笔记
  [dynamicType.link]: '链接', // 草稿
  [dynamicType.video]: '视频' // 草稿
}

export const userMessageAction = {
  system: 1, // 系统消息
  like: 2, // 喜欢
  collect: 3, // 收藏
  attention: 4, // 关注
  comment: 5, // 评论
  reply: 6, // 回复
  thumb: 7, // 赞
  buy: 8, // 购买
  sell: 9 // 卖出
}

export const modelType = {
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
  thumb: 11, // 点赞表
  like: 12, // 喜欢表
  collect: 13, // 收藏表
  attention: 14, // 关注表
  article_tag: 15, // 文章标签
  dynamic_topic: 16 // 动态专题
}

export const userMessageTypeText = {
  // 文章的类型
  [modelType.user]: {
    [userMessageAction.attention]: '关注了你' // 用户1
  },
  [modelType.article]: {
    [userMessageAction.comment]: '评论了你的文章' // 文章2
  },
  [modelType.article_blog]: {
    [userMessageAction.collect]: '收藏了你的专栏' // 文章个人专栏3
  },
  [modelType.article_comment]: {
    [userMessageAction.reply]: '文章中回复你的' // 文章评论4
  },
  [modelType.book]: {
    [userMessageAction.comment]: '评论了你的小书章节' // 小书章节5
  },
  [modelType.book_comment]: {
    [userMessageAction.reply]: '小书章节中回复你的' // 小书章节评论6
  },
  [modelType.books]: {
    [userMessageAction.comment]: '评论了你的小书', // 小书7
    [userMessageAction.sell]: '卖出小书' // 小书7
  },
  [modelType.books_comment]: {
    [userMessageAction.reply]: '小书中回复你的' // 小书评论8
  },
  [modelType.dynamic]: {
    [userMessageAction.comment]: '评论了你片刻' // 片刻9
  },
  [modelType.dynamic_comment]: {
    [userMessageAction.comment]: '片刻中回复你的' // 片刻评论10
  },
  [modelType.thumb]: {
    [userMessageAction.thumb]: '点赞你的' // 点赞了你的片刻
  },
  [modelType.like]: {
    [userMessageAction.like]: '喜欢了你的文章' // 喜欢了你的文章
  },
  [modelType.collect]: {
    [userMessageAction.collect]: '收藏你的' // 收藏你的专栏
  }
}

export const userMessageActionText = {
  [userMessageAction.system]: '新的系统消息',
  [userMessageAction.like]: '新的喜欢',
  [userMessageAction.collect]: '新的收藏',
  [userMessageAction.attention]: '新的关注',
  [userMessageAction.comment]: '新的评论',
  [userMessageAction.reply]: '新的回复',
  [userMessageAction.thumb]: '新的回复',
  [userMessageAction.buy]: '新的购买',
  [userMessageAction.sell]: '新的卖出'
}

export const virtualPlusLess = {
  // 虚拟币动作
  plus: 1, // 加
  less: 2 // 减
}

export const virtualPlusLessText = {
  [virtualPlusLess.plus]: '+', // 加
  [virtualPlusLess.less]: '-' // 减
}

export const virtualType = {
  // 关联模块
  other: 1, // 其他
  user: 2, // 用户
  article: 3, // 文章
  article_blog: 4, // 文章个人专栏
  book: 5, // 小书章节
  books: 6, // 小书
  dynamic: 7, // 片刻
  system: 8, // 系统
  chat_message: 20 // 私聊消息
}

export const payType = {
  // 支付类型
  shell: 1 // 贝壳
}

export const payTypeText = {
  // 支付类型文案
  [payType.shell]: '贝壳' // 贝壳
}

export const isFree = {
  free: 1, // 免费
  pay: 2 // 付费
}

export const isFreeText = {
  [isFree.free]: '免费', // 免费
  [isFree.pay]: '付费' // 付费
}

export const productType = {
  // 商品类型
  other: 1, // 其他
  user: 2, // 用户
  article: 3, // 文章
  article_blog: 4, // 文章个人专栏
  book: 5, // 小书章节
  books: 6, // 小书
  dynamic: 7, // 片刻
  system: 8 // 系统
}

export const productTypeInfo = {
  // 商品类型
  [productType.other]: {
    model: 'other',
    name: '其他',
    isUse: false,
    idKey: ''
  }, // 其他
  [productType.user]: {
    model: 'user',
    name: '用户',
    isUse: false,
    idKey: 'uid'
  }, // 用户
  [productType.article]: {
    model: 'article',
    name: '文章',
    isUse: false,
    idKey: 'aid'
  }, // 文章
  [productType.article_blog]: {
    model: 'article_blog',
    name: '文章专栏',
    isUse: false,
    idKey: 'blog_id'
  }, // 文章个人专栏
  [productType.book]: {
    model: 'book',
    name: '小书章节',
    isUse: false,
    idKey: 'book_id'
  }, // 小书章节
  [productType.books]: {
    model: 'books',
    name: '小书',
    isUse: true,
    idKey: 'books_id'
  }, // 小书
  [productType.dynamic]: {
    model: 'dynamic',
    name: '片刻',
    isUse: false,
    idKey: 'id'
  }, // 片刻
  [productType.system]: {
    model: 'system',
    isUse: false,
    idKey: ''
  } // 系统
}

export const trialRead = {
  yes: 1, // 可以
  no: 2 // 不可以
}

export const trialReadText = {
  [trialRead.yes]: '开启', // 可以
  [trialRead.no]: '关闭' // 不可以
}

export const userLevel = {
  // 用户等级，和上方经验挂钩
  one: 500,
  two: 1500,
  three: 3500,
  four: 7000,
  five: 10000
}
