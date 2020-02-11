"use strict";
const statusList = {
    // 所有内容的审核状态
    pendingReview: 1,
    reviewSuccess: 2,
    reviewFail: 3,
    freeReview: 4,
    deleted: 5 // 已删除
};
const statusListText = {
    // 所有内容的审核状态文字
    [statusList.pendingReview]: '待审核',
    [statusList.reviewSuccess]: '审核成功',
    [statusList.reviewFail]: '审核失败',
    [statusList.freeReview]: '免审核',
    [statusList.deleted]: '已删除' // 已删除
};
const articleType = {
    // 文章的类型
    article: 1,
    note: 2,
    draft: 3 // 草稿
};
const articleTypeText = {
    // 文章的类型
    [articleType.article]: '文章',
    [articleType.note]: '笔记',
    [articleType.draft]: '草稿' // 草稿
};
const dynamicType = {
    // 文章的类型
    dynamic: 1,
    img: 2,
    link: 3,
    video: 4 // 视频
};
const dynamicTypeText = {
    // 文章的类型
    [dynamicType.dynamic]: '默认动态',
    [dynamicType.img]: '图片',
    [dynamicType.link]: '链接',
    [dynamicType.video]: '视频' // 草稿
};
const modelType = {
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
    other: 18 // 其他
};
const modelInfo = {
    // 文章的类型
    [modelType.user]: {
        model: 'user',
        name: '用户',
        idKey: 'uid'
    },
    [modelType.article]: {
        model: 'article',
        name: '文章',
        idKey: 'aid'
    },
    [modelType.article_blog]: {
        model: 'article_blog',
        name: '文章专栏',
        idKey: 'blog_id'
    },
    [modelType.article_comment]: {
        model: 'article_comment',
        name: '文章评论',
        idKey: 'id'
    },
    [modelType.book]: {
        model: 'book',
        name: '小书章节',
        idKey: 'book_id'
    },
    [modelType.book_comment]: {
        model: 'book_comment',
        name: '小书章节评论',
        idKey: 'id'
    },
    [modelType.books]: {
        model: 'books',
        name: '小书',
        idKey: 'books_id'
    },
    [modelType.books_comment]: {
        model: 'books_comment',
        name: '小书评论',
        idKey: 'id'
    },
    [modelType.dynamic]: {
        model: 'dynamic',
        name: '片刻',
        idKey: 'id'
    },
    [modelType.dynamic_comment]: {
        model: 'dynamic_comment',
        name: '片刻评论',
        idKey: 'id'
    },
    [modelType.thumb]: {
        model: 'thumb',
        name: '赞',
        idKey: 'id'
    },
    [modelType.like]: {
        model: 'like',
        name: '喜欢',
        idKey: 'id'
    },
    [modelType.collect]: {
        model: 'collect',
        name: '收藏',
        idKey: 'id'
    },
    [modelType.attention]: {
        model: 'attention',
        name: '关注',
        idKey: 'id'
    },
    [modelType.article_tag]: {
        model: 'article_tag',
        name: '文章标签',
        idKey: 'id'
    },
    [modelType.dynamic_topic]: {
        model: 'dynamic_topic',
        name: '动态专题',
        idKey: 'id'
    } // 关注表
};
const userMessageAction = {
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
const userMessageActionText = {
    [userMessageAction.system]: '新的系统消息',
    [userMessageAction.like]: '新的喜欢',
    [userMessageAction.collect]: '新的收藏',
    [userMessageAction.attention]: '新的关注',
    [userMessageAction.comment]: '新的评论',
    [userMessageAction.reply]: '新的回复',
    [userMessageAction.thumb]: '新的赞',
    [userMessageAction.buy]: '新的购买'
};
const userMessageIsPush = {
    open: 1,
    close: 2 // 关闭
};
// 2019.11.4 15:34
const virtualPlusLess = {
    // 虚拟币动作
    plus: 1,
    less: 2 // 减
};
const modelAction = {
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
    registered: 16 // 注册
};
const modelActionText = {
    // 动作
    [modelAction.check_in]: '签到',
    [modelAction.create]: '创建',
    [modelAction.like]: '喜欢',
    [modelAction.collect]: '收藏',
    [modelAction.comment]: '评论',
    [modelAction.reply]: '回复',
    [modelAction.thumb]: '点赞',
    [modelAction.sell]: '售出',
    [modelAction.buy]: '购物',
    [modelAction.recover]: '系统回收',
    [modelAction.obtain_like]: '收到喜欢',
    [modelAction.obtain_collect]: '收到收藏',
    [modelAction.obtain_comment]: '收到评论',
    [modelAction.obtain_reply]: '收到回复',
    [modelAction.obtain_thumb]: '收到点赞',
    [modelAction.registered]: '默认' // 默认
};
const virtualType = {
    // 关联模块
    other: 1,
    user: 2,
    article: 3,
    article_blog: 4,
    book: 5,
    books: 6,
    dynamic: 7,
    system: 8 // 系统
};
const virtualTypeText = {
    // 关联模块
    [virtualType.other]: '其他',
    [virtualType.user]: '用户',
    [virtualType.article]: '文章',
    [virtualType.article_blog]: '文章个人专栏',
    [virtualType.book]: '小书章节',
    [virtualType.books]: '小书',
    [virtualType.dynamic]: '片刻',
    [virtualType.system]: '系统' // 系统
};
const virtualInfo = {
    [modelAction.check_in]: {
        // 签到+
        plusLess: virtualPlusLess.plus,
        [virtualType.system]: 50 // 用户每天签到:+50
    },
    [modelAction.create]: {
        // 创建内容-
        plusLess: virtualPlusLess.less,
        [virtualType.article]: 20,
        [virtualType.article_blog]: 10,
        [virtualType.book]: 5,
        [virtualType.books]: 50,
        [virtualType.dynamic]: 15 // 创建动态：-15
    },
    [modelAction.like]: {
        // 喜欢
        plusLess: virtualPlusLess.less,
        [virtualType.article]: 5 // 喜欢文章: -5
    },
    [modelAction.collect]: {
        // 收藏
        plusLess: virtualPlusLess.less,
        [virtualType.article_blog]: 5 // 收藏个人专栏: -5
    },
    [modelAction.comment]: {
        // 创建评论-
        plusLess: virtualPlusLess.less,
        [virtualType.article]: 5,
        [virtualType.book]: 5,
        [virtualType.books]: 5,
        [virtualType.dynamic]: 5 // 创建动态评论：-5
    },
    [modelAction.reply]: {
        // 回复评论-
        plusLess: virtualPlusLess.less,
        [virtualType.article]: 5,
        [virtualType.book]: 5,
        [virtualType.books]: 5,
        [virtualType.dynamic]: 5 // 创建动态回复：-5
    },
    [modelAction.thumb]: {
        plusLess: virtualPlusLess.less,
        [virtualType.dynamic]: 5 // 点赞动态：-5
    },
    [modelAction.obtain_like]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.article]: 5 // 收到喜欢文章: +5
    },
    [modelAction.obtain_collect]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.article_blog]: 5 // 收到收藏个人专栏:  +5
    },
    [modelAction.obtain_comment]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.article]: 5,
        [virtualType.book]: 5,
        [virtualType.books]: 5,
        [virtualType.dynamic]: 5 // 收到动态评论：+5
    },
    [modelAction.obtain_reply]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.article]: 5,
        [virtualType.book]: 5,
        [virtualType.books]: 5,
        [virtualType.dynamic]: 5 // 收到动态回复：+5
    },
    [modelAction.obtain_thumb]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.dynamic]: 5 // 收到点赞动态：+5
    },
    [modelAction.registered]: {
        plusLess: virtualPlusLess.plus,
        [virtualType.system]: 3000 // 注册增加3000：+5
    }
};
// 2019.11.6 0:57
// 支付购买开始
const payType = {
    // 支付类型
    shell: 1 // 贝壳
};
const payTypeText = {
    // 支付类型文案
    [payType.shell]: '贝壳' // 贝壳
};
const productType = {
    // 商品类型
    other: 1,
    user: 2,
    article: 3,
    article_blog: 4,
    book: 5,
    books: 6,
    dynamic: 7,
    system: 8 // 系统
};
const productTypeInfo = {
    // 商品类型
    [productType.other]: {
        model: 'other',
        name: '其他',
        isUse: false,
        idKey: ''
    },
    [productType.user]: {
        model: 'user',
        name: '用户',
        isUse: false,
        idKey: 'uid'
    },
    [productType.article]: {
        model: 'article',
        name: '文章',
        isUse: false,
        idKey: 'aid'
    },
    [productType.article_blog]: {
        model: 'article_blog',
        name: '文章专栏',
        isUse: false,
        idKey: 'blog_id'
    },
    [productType.book]: {
        model: 'book',
        name: '小书章节',
        isUse: false,
        idKey: 'book_id'
    },
    [productType.books]: {
        model: 'books',
        name: '小书',
        isUse: true,
        idKey: 'books_id'
    },
    [productType.dynamic]: {
        model: 'dynamic',
        name: '片刻',
        isUse: false,
        idKey: 'id'
    },
    [productType.system]: {
        model: 'system',
        isUse: false,
        idKey: ''
    } // 系统
};
const isFree = {
    free: 1,
    pay: 2 // 付费
};
const isFreeText = {
    [isFree.free]: '免费',
    [isFree.pay]: '付费' // 付费
};
const trialRead = {
    // 是否可以试读
    yes: 1,
    no: 2 // 不可以
};
const trialReadText = {
    [trialRead.yes]: '开启',
    [trialRead.no]: '关闭' // 不可以
};
module.exports = {
    statusList,
    statusListText,
    articleType,
    articleTypeText,
    dynamicType,
    dynamicTypeText,
    userMessageAction,
    userMessageActionText,
    userMessageIsPush,
    virtualType,
    virtualPlusLess,
    modelAction,
    virtualInfo,
    modelActionText,
    virtualTypeText,
    payType,
    payTypeText,
    isFree,
    isFreeText,
    productType,
    productTypeInfo,
    trialRead,
    trialReadText,
    modelType,
    modelInfo
};
