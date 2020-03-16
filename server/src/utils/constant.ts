export const statusList = {
  // 所有内容的审核状态
  pendingReview: 1, // 待审核
  reviewSuccess: 2, // 审核成功
  reviewFail: 3, // 审核失败
  freeReview: 4, // 免审核
  deleted: 5, // 已删除
  draft: 6 // 草稿
}
export const statusListText = {
  // 所有内容的审核状态文字
  [statusList.pendingReview]: '待审核', // 待审核
  [statusList.reviewSuccess]: '审核成功', // 审核成功
  [statusList.reviewFail]: '审核失败', // 审核失败
  [statusList.freeReview]: '免审核', // 免审核
  [statusList.deleted]: '已删除', // 已删除
  [statusList.draft]: '草稿' // 草稿
}

export const articleType = {
  // 文章的类型
  article: 1, // 文章
  discuss: 2, // 讨论提问
  share: 3, // 分享
  recourse: 4, // 求助
  note: 5 // 笔记
}

export const articleTypeText = {
  // 文章的类型
  [articleType.article]: '文章', // 文章
  [articleType.discuss]: '讨论提问', // 提问
  [articleType.share]: '分享', // 分享
  [articleType.recourse]: '求助', // 求助
  [articleType.note]: '笔记' // 笔记
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

export const modelName = {
  // 类型
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
  dynamic_topic: 16, // 动态专题
  system: 17, // 系统 ---- 不是特别，暂时不用
  other: 18, // 其他 ---- 不是特别，暂时不用
  virtual: 19, // 虚拟币
  chat_message: 20, // 私聊消息
  article_annex: 21 // 文章附件
}

export const modelInfo = {
  // 文章的类型
  [modelName.user]: {
    model: 'user',
    name: '用户',
    idKey: 'uid'
  }, // 用户
  [modelName.article]: {
    model: 'article',
    name: '文章',
    idKey: 'aid'
  }, // 文章
  [modelName.article_blog]: {
    model: 'article_blog',
    name: '文章专栏',
    idKey: 'blog_id'
  }, // 文章个人专栏
  [modelName.article_comment]: {
    model: 'article_comment',
    name: '文章评论',
    idKey: 'id'
  }, // 文章评论
  [modelName.book]: {
    model: 'book',
    name: '小书章节',
    idKey: 'book_id'
  }, // 小书章节
  [modelName.book_comment]: {
    model: 'book_comment',
    name: '小书章节评论',
    idKey: 'id'
  }, // 小书章节评论
  [modelName.books]: {
    model: 'books',
    name: '小书',
    idKey: 'books_id'
  }, // 小书
  [modelName.books_comment]: {
    model: 'books_comment',
    name: '小书评论',
    idKey: 'id'
  }, // 小书评论
  [modelName.dynamic]: {
    model: 'dynamic',
    name: '片刻',
    idKey: 'id'
  }, // 片刻
  [modelName.dynamic_comment]: {
    model: 'dynamic_comment',
    name: '片刻评论',
    idKey: 'id'
  }, // 片刻评论
  [modelName.thumb]: {
    model: 'thumb',
    name: '赞',
    idKey: 'id'
  }, // 点赞表
  [modelName.like]: {
    model: 'like',
    name: '喜欢',
    idKey: 'id'
  }, // 喜欢表
  [modelName.collect]: {
    model: 'collect',
    name: '收藏',
    idKey: 'id'
  }, // 收藏表
  [modelName.attention]: {
    model: 'attention',
    name: '关注',
    idKey: 'id'
  }, // 关注表
  [modelName.article_tag]: {
    model: 'article_tag',
    name: '文章标签',
    idKey: 'id'
  }, // 关注表
  [modelName.dynamic_topic]: {
    model: 'dynamic_topic',
    name: '动态专题',
    idKey: 'id'
  }, // 关注表
  [modelName.virtual]: {
    model: 'virtual',
    name: '虚拟币',
    idKey: 'id'
  }, // 关注表
  [modelName.chat_message]: {
    model: 'chat_message',
    name: '私聊消息',
    idKey: 'id'
  }, // 关注表
  [modelName.article_annex]: {
    model: 'article_annex',
    name: '文章附件',
    idKey: 'id'
  }, // 文章附件表
  [modelName.system]: {
    model: '',
    name: '系统',
    idKey: ''
  }, // 文章附件表
  [modelName.other]: {
    model: '',
    name: '其他',
    idKey: ''
  } // 文章附件表

}

export const modelAction = {
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
  registered: 16, // 注册
  readOther: 17, // 阅读他人
  otherRead: 18, // 他人阅读
  sendPrivateChat: 19, // 发送私聊
  receivePrivateChat: 20 // 接受私聊
}

export const modelActionText = {
  // 动作
  [modelAction.check_in]: '签到', // 签到
  [modelAction.create]: '创建', // 创建
  [modelAction.like]: '喜欢', // 喜欢
  [modelAction.collect]: '收藏', // 收藏
  [modelAction.comment]: '评论', // 评论
  [modelAction.reply]: '回复', // 回复
  [modelAction.thumb]: '点赞', // 点赞
  [modelAction.sell]: '售出', // 卖
  [modelAction.buy]: '购物', // 买
  [modelAction.recover]: '系统回收', // 系统回收
  [modelAction.obtain_like]: '收到喜欢', // 收到喜欢
  [modelAction.obtain_collect]: '收到收藏', // 收到收藏
  [modelAction.obtain_comment]: '收到评论', // 收到评论
  [modelAction.obtain_reply]: '收到回复', // 收到回复
  [modelAction.obtain_thumb]: '收到点赞', // 收到点赞
  [modelAction.registered]: '注册', // 默认
  [modelAction.readOther]: '阅读他人', // 默认
  [modelAction.otherRead]: '他人阅读', // 默认
  [modelAction.sendPrivateChat]: '发送私聊', // 默认
  [modelAction.receivePrivateChat]: '接受私聊' // 默认
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
  sell: 9 // 售出
}

export const userMessageTypeText = {
  // 文章的类型
  [modelName.user]: {
    [userMessageAction.attention]: '关注了你' // 用户1
  },
  [modelName.article]: {
    [userMessageAction.comment]: '评论了你的文章' // 文章2
  },
  [modelName.article_blog]: {
    [userMessageAction.collect]: '收藏了你的专栏' // 文章个人专栏3
  },
  [modelName.article_comment]: {
    [userMessageAction.reply]: '文章中回复你的' // 文章评论4
  },
  [modelName.book]: {
    [userMessageAction.comment]: '评论了你的小书章节' // 小书章节5
  },
  [modelName.book_comment]: {
    [userMessageAction.reply]: '小书章节中回复你的' // 小书章节评论6
  },
  [modelName.books]: {
    [userMessageAction.comment]: '评论了你的小书', // 小书7
    [userMessageAction.sell]: '卖出小书' // 小书7
  },
  [modelName.books_comment]: {
    [userMessageAction.reply]: '小书中回复你的' // 小书评论8
  },
  [modelName.dynamic]: {
    [userMessageAction.comment]: '评论了你片刻' // 片刻9
  },
  [modelName.dynamic_comment]: {
    [userMessageAction.comment]: '片刻中回复你的' // 片刻评论10
  },
  [modelName.thumb]: {
    [userMessageAction.thumb]: '点赞你的' // 点赞了你的片刻
  },
  [modelName.like]: {
    [userMessageAction.like]: '喜欢了你的文章' // 喜欢了你的文章
  },
  [modelName.collect]: {
    [userMessageAction.collect]: '收藏你的' // 收藏你的专栏
  },
  [modelName.article_annex]: {
    [userMessageAction.sell]: '卖出' // 小书7
  }
}

export const userMessageActionText = {
  [userMessageAction.system]: '新的系统消息',
  [userMessageAction.like]: '新的喜欢',
  [userMessageAction.collect]: '新的收藏',
  [userMessageAction.attention]: '新的关注',
  [userMessageAction.comment]: '新的评论',
  [userMessageAction.reply]: '新的回复',
  [userMessageAction.thumb]: '新的赞',
  [userMessageAction.buy]: '新的购买'
}

export const userMessageIsPush = {
  open: 1, // 开启
  close: 2 // 关闭
}

// 2019.11.4 15:34

export const virtualPlusLess = {
  // 虚拟币动作
  plus: 1, // 加
  less: 2 // 减
}

export const virtualPlusLessText = {
  [virtualPlusLess.plus]: '+', // 加
  [virtualPlusLess.less]: '-' // 减
}

export const virtualInfo = {
  [modelAction.check_in]: {
    // 签到+
    plusLess: virtualPlusLess.plus, // +
    [modelName.system]: 50 // 用户每天签到:+50
  },
  [modelAction.create]: {
    // 创建内容-
    plusLess: virtualPlusLess.less, // -
    [modelName.article]: 20, // 创建文章：-20
    [modelName.article_blog]: 10, // 创建个人专栏文章：-10
    [modelName.book]: 5, // 创建小书章节：-5
    [modelName.books]: 50, // 创建小书：-50
    [modelName.dynamic]: 15 // 创建动态：-15
  },
  [modelAction.like]: {
    // 喜欢
    plusLess: virtualPlusLess.less, // -
    [modelName.article]: 5 // 喜欢文章: -5
  },
  [modelAction.collect]: {
    // 收藏
    plusLess: virtualPlusLess.less, // -
    [modelName.article_blog]: 5 // 收藏个人专栏: -5
  },
  [modelAction.comment]: {
    // 创建评论-
    plusLess: virtualPlusLess.less, // -
    [modelName.article]: 5, // 创建文章评论：-5
    [modelName.book]: 5, // 创建小书章节评论：-5
    [modelName.books]: 5, // 创建小书评论：-5
    [modelName.dynamic]: 5 // 创建动态评论：-5
  },
  [modelAction.reply]: {
    // 回复评论-
    plusLess: virtualPlusLess.less, // -
    [modelName.article]: 5, // 创建文章回复：-5
    [modelName.book]: 5, // 创建小书章节回复：-5
    [modelName.books]: 5, // 创建小书回复：-5
    [modelName.dynamic]: 5 // 创建动态回复：-5
  },
  [modelAction.thumb]: {
    plusLess: virtualPlusLess.less, // -
    [modelName.dynamic]: 5 // 点赞动态：-5
  },
  [modelAction.obtain_like]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.article]: 5 // 收到喜欢文章: +5
  },
  [modelAction.obtain_collect]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.article_blog]: 5 // 收到收藏个人专栏:  +5
  },
  [modelAction.obtain_comment]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.article]: 5, // 收到文章评论：+5
    [modelName.book]: 5, // 收到小书章节评论：+5
    [modelName.books]: 5, // 收到小书评论：+5
    [modelName.dynamic]: 5 // 收到动态评论：+5
  },
  [modelAction.obtain_reply]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.article]: 5, // 收到文章回复：+5
    [modelName.book]: 5, // 收到小书章节回复：+5
    [modelName.books]: 5, // 收到小书回复：+5
    [modelName.dynamic]: 5 // 收到动态回复：+5
  },
  [modelAction.obtain_thumb]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.dynamic]: 5 // 收到点赞动态：+5
  },
  [modelAction.registered]: {
    plusLess: virtualPlusLess.plus, // +
    [modelName.system]: 1000 // 注册增加1000：+5
  },
  [modelAction.sendPrivateChat]: {
    plusLess: virtualPlusLess.less, // -
    [modelName.chat_message]: 10 // 发送私聊-15
  }
}

// 2019.11.6 0:57
// 支付购买开始

export const payType = {
  // 支付类型
  shell: 1 // 贝壳
}

export const payTypeText = {
  // 支付类型文案
  [payType.shell]: '贝壳' // 贝壳
}

export const productTypeInfo = {
  // 商品类型
  [modelName.article]: {
    model: 'article',
    name: '文章',
    isUse: false,
    idKey: 'aid'
  }, // 文章
  [modelName.article_annex]: {
    model: 'article_annex',
    name: '文章附件',
    isUse: true,
    idKey: 'id'
  }, // 文章

  [modelName.books]: {
    model: 'books',
    name: '小书',
    isUse: true,
    idKey: 'books_id'
  } // 小书
}

export const isFree = {
  free: 1, // 免费
  pay: 2 // 付费
}

export const isFreeText = {
  [isFree.free]: '免费', // 免费
  [isFree.pay]: '付费' // 付费
}

export const trialRead = {
  // 是否可以试读
  yes: 1, // 可以
  no: 2 // 不可以
}

export const trialReadText = {
  [trialRead.yes]: '开启', // 可以
  [trialRead.no]: '关闭' // 不可以
}

// 获得经验的方式和数量

export const experienceInfo = {
  [modelAction.obtain_thumb]: 10, // 收到点赞
  [modelAction.readOther]: 1 // 阅读他人
}

export const userLevel = {
  // 用户等级，和上方经验挂钩
  one: 500,
  two: 1000,
  three: 2000,
  four: 5000,
  five: 10000
}

export const isOpen = {
  // 是否可以试读
  yes: 1, // 可以
  no: 2 // 不可以
}

export const isOpenInfo = {
  [isOpen.yes]: '开启', // 开启
  [isOpen.no]: '关闭' // 关闭
}
