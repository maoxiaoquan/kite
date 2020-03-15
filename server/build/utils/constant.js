"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusList = {
    // 所有内容的审核状态
    pendingReview: 1,
    reviewSuccess: 2,
    reviewFail: 3,
    freeReview: 4,
    deleted: 5,
    draft: 6 // 草稿
};
exports.statusListText = {
    // 所有内容的审核状态文字
    [exports.statusList.pendingReview]: '待审核',
    [exports.statusList.reviewSuccess]: '审核成功',
    [exports.statusList.reviewFail]: '审核失败',
    [exports.statusList.freeReview]: '免审核',
    [exports.statusList.deleted]: '已删除',
    [exports.statusList.draft]: '草稿' // 草稿
};
exports.articleType = {
    // 文章的类型
    article: 1,
    discuss: 2,
    share: 3,
    recourse: 4,
    note: 5 // 笔记
};
exports.articleTypeText = {
    // 文章的类型
    [exports.articleType.article]: '文章',
    [exports.articleType.discuss]: '讨论提问',
    [exports.articleType.share]: '分享',
    [exports.articleType.recourse]: '求助',
    [exports.articleType.note]: '笔记' // 笔记
};
exports.dynamicType = {
    // 文章的类型
    dynamic: 1,
    img: 2,
    link: 3,
    video: 4 // 视频
};
exports.dynamicTypeText = {
    // 文章的类型
    [exports.dynamicType.dynamic]: '默认动态',
    [exports.dynamicType.img]: '图片',
    [exports.dynamicType.link]: '链接',
    [exports.dynamicType.video]: '视频' // 草稿
};
exports.modelName = {
    // 类型
    user: 1,
    article: 2,
    article_blog: 3,
    article_comment: 4,
    book: 5,
    book_comment: 6,
    books: 7,
    books_comment: 8,
    dynamic: 9,
    dynamic_comment: 10,
    thumb: 11,
    like: 12,
    collect: 13,
    attention: 14,
    article_tag: 15,
    dynamic_topic: 16,
    system: 17,
    other: 18,
    virtual: 19,
    chat_message: 20,
    article_annex: 21 // 文章附件
};
exports.modelInfo = {
    // 文章的类型
    [exports.modelName.user]: {
        model: 'user',
        name: '用户',
        idKey: 'uid'
    },
    [exports.modelName.article]: {
        model: 'article',
        name: '文章',
        idKey: 'aid'
    },
    [exports.modelName.article_blog]: {
        model: 'article_blog',
        name: '文章专栏',
        idKey: 'blog_id'
    },
    [exports.modelName.article_comment]: {
        model: 'article_comment',
        name: '文章评论',
        idKey: 'id'
    },
    [exports.modelName.book]: {
        model: 'book',
        name: '小书章节',
        idKey: 'book_id'
    },
    [exports.modelName.book_comment]: {
        model: 'book_comment',
        name: '小书章节评论',
        idKey: 'id'
    },
    [exports.modelName.books]: {
        model: 'books',
        name: '小书',
        idKey: 'books_id'
    },
    [exports.modelName.books_comment]: {
        model: 'books_comment',
        name: '小书评论',
        idKey: 'id'
    },
    [exports.modelName.dynamic]: {
        model: 'dynamic',
        name: '片刻',
        idKey: 'id'
    },
    [exports.modelName.dynamic_comment]: {
        model: 'dynamic_comment',
        name: '片刻评论',
        idKey: 'id'
    },
    [exports.modelName.thumb]: {
        model: 'thumb',
        name: '赞',
        idKey: 'id'
    },
    [exports.modelName.like]: {
        model: 'like',
        name: '喜欢',
        idKey: 'id'
    },
    [exports.modelName.collect]: {
        model: 'collect',
        name: '收藏',
        idKey: 'id'
    },
    [exports.modelName.attention]: {
        model: 'attention',
        name: '关注',
        idKey: 'id'
    },
    [exports.modelName.article_tag]: {
        model: 'article_tag',
        name: '文章标签',
        idKey: 'id'
    },
    [exports.modelName.dynamic_topic]: {
        model: 'dynamic_topic',
        name: '动态专题',
        idKey: 'id'
    },
    [exports.modelName.virtual]: {
        model: 'virtual',
        name: '虚拟币',
        idKey: 'id'
    },
    [exports.modelName.chat_message]: {
        model: 'chat_message',
        name: '私聊消息',
        idKey: 'id'
    },
    [exports.modelName.article_annex]: {
        model: 'article_annex',
        name: '文章附件',
        idKey: 'id'
    },
    [exports.modelName.system]: {
        model: '',
        name: '系统',
        idKey: ''
    },
    [exports.modelName.other]: {
        model: '',
        name: '其他',
        idKey: ''
    } // 文章附件表
};
exports.modelAction = {
    // 动作
    check_in: 1,
    create: 2,
    like: 3,
    collect: 4,
    comment: 5,
    reply: 6,
    thumb: 7,
    sell: 8,
    buy: 9,
    recover: 10,
    obtain_like: 11,
    obtain_collect: 12,
    obtain_comment: 13,
    obtain_reply: 14,
    obtain_thumb: 15,
    registered: 16,
    readOther: 17,
    otherRead: 18,
    sendPrivateChat: 19,
    receivePrivateChat: 20 // 接受私聊
};
exports.modelActionText = {
    // 动作
    [exports.modelAction.check_in]: '签到',
    [exports.modelAction.create]: '创建',
    [exports.modelAction.like]: '喜欢',
    [exports.modelAction.collect]: '收藏',
    [exports.modelAction.comment]: '评论',
    [exports.modelAction.reply]: '回复',
    [exports.modelAction.thumb]: '点赞',
    [exports.modelAction.sell]: '售出',
    [exports.modelAction.buy]: '购物',
    [exports.modelAction.recover]: '系统回收',
    [exports.modelAction.obtain_like]: '收到喜欢',
    [exports.modelAction.obtain_collect]: '收到收藏',
    [exports.modelAction.obtain_comment]: '收到评论',
    [exports.modelAction.obtain_reply]: '收到回复',
    [exports.modelAction.obtain_thumb]: '收到点赞',
    [exports.modelAction.registered]: '注册',
    [exports.modelAction.readOther]: '阅读他人',
    [exports.modelAction.otherRead]: '他人阅读',
    [exports.modelAction.sendPrivateChat]: '发送私聊',
    [exports.modelAction.receivePrivateChat]: '接受私聊' // 默认
};
exports.userMessageAction = {
    system: 1,
    like: 2,
    collect: 3,
    attention: 4,
    comment: 5,
    reply: 6,
    thumb: 7,
    buy: 8,
    sell: 9 // 售出
};
exports.userMessageTypeText = {
    // 文章的类型
    [exports.modelName.user]: {
        [exports.userMessageAction.attention]: '关注了你' // 用户1
    },
    [exports.modelName.article]: {
        [exports.userMessageAction.comment]: '评论了你的文章' // 文章2
    },
    [exports.modelName.article_blog]: {
        [exports.userMessageAction.collect]: '收藏了你的专栏' // 文章个人专栏3
    },
    [exports.modelName.article_comment]: {
        [exports.userMessageAction.reply]: '文章中回复你的' // 文章评论4
    },
    [exports.modelName.book]: {
        [exports.userMessageAction.comment]: '评论了你的小书章节' // 小书章节5
    },
    [exports.modelName.book_comment]: {
        [exports.userMessageAction.reply]: '小书章节中回复你的' // 小书章节评论6
    },
    [exports.modelName.books]: {
        [exports.userMessageAction.comment]: '评论了你的小书',
        [exports.userMessageAction.sell]: '卖出小书' // 小书7
    },
    [exports.modelName.books_comment]: {
        [exports.userMessageAction.reply]: '小书中回复你的' // 小书评论8
    },
    [exports.modelName.dynamic]: {
        [exports.userMessageAction.comment]: '评论了你片刻' // 片刻9
    },
    [exports.modelName.dynamic_comment]: {
        [exports.userMessageAction.comment]: '片刻中回复你的' // 片刻评论10
    },
    [exports.modelName.thumb]: {
        [exports.userMessageAction.thumb]: '点赞你的' // 点赞了你的片刻
    },
    [exports.modelName.like]: {
        [exports.userMessageAction.like]: '喜欢了你的文章' // 喜欢了你的文章
    },
    [exports.modelName.collect]: {
        [exports.userMessageAction.collect]: '收藏你的' // 收藏你的专栏
    },
    [exports.modelName.article_annex]: {
        [exports.userMessageAction.sell]: '卖出' // 小书7
    }
};
exports.userMessageActionText = {
    [exports.userMessageAction.system]: '新的系统消息',
    [exports.userMessageAction.like]: '新的喜欢',
    [exports.userMessageAction.collect]: '新的收藏',
    [exports.userMessageAction.attention]: '新的关注',
    [exports.userMessageAction.comment]: '新的评论',
    [exports.userMessageAction.reply]: '新的回复',
    [exports.userMessageAction.thumb]: '新的赞',
    [exports.userMessageAction.buy]: '新的购买'
};
exports.userMessageIsPush = {
    open: 1,
    close: 2 // 关闭
};
// 2019.11.4 15:34
exports.virtualPlusLess = {
    // 虚拟币动作
    plus: 1,
    less: 2 // 减
};
exports.virtualPlusLessText = {
    [exports.virtualPlusLess.plus]: '+',
    [exports.virtualPlusLess.less]: '-' // 减
};
exports.virtualInfo = {
    [exports.modelAction.check_in]: {
        // 签到+
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.system]: 50 // 用户每天签到:+50
    },
    [exports.modelAction.create]: {
        // 创建内容-
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.article]: 20,
        [exports.modelName.article_blog]: 10,
        [exports.modelName.book]: 5,
        [exports.modelName.books]: 50,
        [exports.modelName.dynamic]: 15 // 创建动态：-15
    },
    [exports.modelAction.like]: {
        // 喜欢
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.article]: 5 // 喜欢文章: -5
    },
    [exports.modelAction.collect]: {
        // 收藏
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.article_blog]: 5 // 收藏个人专栏: -5
    },
    [exports.modelAction.comment]: {
        // 创建评论-
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.article]: 5,
        [exports.modelName.book]: 5,
        [exports.modelName.books]: 5,
        [exports.modelName.dynamic]: 5 // 创建动态评论：-5
    },
    [exports.modelAction.reply]: {
        // 回复评论-
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.article]: 5,
        [exports.modelName.book]: 5,
        [exports.modelName.books]: 5,
        [exports.modelName.dynamic]: 5 // 创建动态回复：-5
    },
    [exports.modelAction.thumb]: {
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.dynamic]: 5 // 点赞动态：-5
    },
    [exports.modelAction.obtain_like]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.article]: 5 // 收到喜欢文章: +5
    },
    [exports.modelAction.obtain_collect]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.article_blog]: 5 // 收到收藏个人专栏:  +5
    },
    [exports.modelAction.obtain_comment]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.article]: 5,
        [exports.modelName.book]: 5,
        [exports.modelName.books]: 5,
        [exports.modelName.dynamic]: 5 // 收到动态评论：+5
    },
    [exports.modelAction.obtain_reply]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.article]: 5,
        [exports.modelName.book]: 5,
        [exports.modelName.books]: 5,
        [exports.modelName.dynamic]: 5 // 收到动态回复：+5
    },
    [exports.modelAction.obtain_thumb]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.dynamic]: 5 // 收到点赞动态：+5
    },
    [exports.modelAction.registered]: {
        plusLess: exports.virtualPlusLess.plus,
        [exports.modelName.system]: 1000 // 注册增加1000：+5
    },
    [exports.modelAction.sendPrivateChat]: {
        plusLess: exports.virtualPlusLess.less,
        [exports.modelName.chat_message]: 10 // 发送私聊-15
    }
};
// 2019.11.6 0:57
// 支付购买开始
exports.payType = {
    // 支付类型
    shell: 1 // 贝壳
};
exports.payTypeText = {
    // 支付类型文案
    [exports.payType.shell]: '贝壳' // 贝壳
};
exports.productTypeInfo = {
    // 商品类型
    [exports.modelName.article]: {
        model: 'article',
        name: '文章',
        isUse: false,
        idKey: 'aid'
    },
    [exports.modelName.article_annex]: {
        model: 'article_annex',
        name: '文章附件',
        isUse: true,
        idKey: 'id'
    },
    [exports.modelName.books]: {
        model: 'books',
        name: '小书',
        isUse: true,
        idKey: 'books_id'
    } // 小书
};
exports.isFree = {
    free: 1,
    pay: 2 // 付费
};
exports.isFreeText = {
    [exports.isFree.free]: '免费',
    [exports.isFree.pay]: '付费' // 付费
};
exports.trialRead = {
    // 是否可以试读
    yes: 1,
    no: 2 // 不可以
};
exports.trialReadText = {
    [exports.trialRead.yes]: '开启',
    [exports.trialRead.no]: '关闭' // 不可以
};
// 获得经验的方式和数量
exports.experienceInfo = {
    [exports.modelAction.obtain_thumb]: 10,
    [exports.modelAction.readOther]: 1 // 阅读他人
};
exports.userLevel = {
    // 用户等级，和上方经验挂钩
    one: 500,
    two: 1000,
    three: 2000,
    four: 5000,
    five: 10000
};
exports.isOpen = {
    // 是否可以试读
    yes: 1,
    no: 2 // 不可以
};
exports.isOpenInfo = {
    [exports.isOpen.yes]: '开启',
    [exports.isOpen.no]: '关闭' // 关闭
};
