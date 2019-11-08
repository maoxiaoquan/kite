export default [
  {
    path: '/',
    component: require('@views/Main').default, // main
    children: [
      {
        path: '',
        name: 'home',
        component: require('@views/Home/Home').default // 主页
      },
      {
        path: 'column/:en_name',
        name: 'column',
        component: require('@views/Home/Column').default // 主页
      },
      {
        path: 'p/:aid',
        name: 'article',
        component: require('@views/Article/Article').default // 文章内容页
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@views/Search/view/Search') // 搜索页
      },
      {
        path: 'user/:uid/:routeType',
        name: 'user',
        component: () => import('@views/User/User') // 用户内页
      },
      {
        path: 'personal/:uid',
        name: 'personal',
        component: () => import('@views/User/Personal') // 个人页
      },
      {
        path: 'shell-detail',
        name: 'shellDetail',
        component: () => import('@views/User/shellDetail') // 消费明细
      },
      {
        path: 'my-order',
        name: 'myOrder',
        component: () => import('@views/User/Order') // 我的订单
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@views/Setting/Setting'), // 文章内容页
        children: [
          {
            path: 'profile',
            name: 'settingProfile',
            component: () => import('@views/Setting/view/Profile') // 修改资料
          },
          {
            path: 'reset-password',
            name: 'settingResetPassword',
            component: () => import('@views/Setting/view/ResetPassword') // 重置密码
          }
        ],
        redirect: { name: 'settingProfile' }
      },
      {
        path: 'column-all',
        name: 'columnAll',
        component: () => import('@views/ArticleColumn/ArticleColumn') // 文章专栏
      },
      {
        path: 'subscribe/:type',
        name: 'subscribe_tag',
        component: () => import('@views/ArticleTag/SubscribeTag') // 文章标签订阅页
      },
      {
        path: 'tag/:en_name',
        name: 'article_tag',
        component: require('@views/ArticleTag/ArticleTag').default // 文章标签内容页
      },
      {
        path: 'article-rule',
        name: 'article_rule',
        component: () => import('@views/Rule/ArticleRule') // 文章编写规则
      },
      {
        path: 'comment-rule',
        name: 'comment_rule',
        component: () => import('@views/Rule/CommentRule') // 评论规则
      },
      {
        path: 'write/:type',
        name: 'Write',
        component: () => import('@views/Write/Write') // 文章编写
      },
      {
        //动态 2019.8.1 12:11开发
        path: 'dynamics/:dynamicTopicId',
        name: 'dynamics',
        component: () => import('@views/Dynamic/index') // 动态首页
      },
      {
        path: 'dynamic/:dynamicId',
        name: 'dynamicView',
        component: () => import('@views/Dynamic/dynamicView') // 动态内容页
      },
      {
        path: 'topics',
        name: 'dynamicTopic',
        component: () => import('@views/Dynamic/dynamicTopic') // 动态专题
      },
      {
        path: 'topic/:dynamicTopicId',
        name: 'dynamicTopicView',
        component: () => import('@views/Dynamic/dynamicTopicView') // 动态专题内容页
      },
      {
        path: 'blog/:blogId',
        name: 'articleBlog',
        component: () => import('@views/ArticleBlog/BlogView') // 个人专栏内容
      },
      {
        path: 'books-write/:type',
        name: 'booksWrite',
        component: () => import('@views/Books/WriteBooks') // 小书创建修改
      },
      {
        path: 'books/:columnEnName',
        name: 'books',
        component: () => import('@views/Books/Books') // 小书首页
      },
      {
        path: 'book/:books_id',
        name: 'book',
        component: require('@views/Book/Book').default // 小书内容
      }
    ]
  },
  {
    path: '/book/:books_id/section/:book_id',
    name: 'BookView',
    component: () => import('@views/BookView/BookView') // 查看小书内容
  },
  {
    path: '/book/:books_id/write/:book_id',
    name: 'WriteBookView',
    component: () => import('@views/BookView/WriteBookView') // 编辑小书内容
  },
  {
    path: '/sign/in',
    name: 'signIn',
    component: () => import('@views/Sign/SignIn') // 登录
  },
  {
    path: '/sign/up',
    name: 'signUp',
    component: () => import('@views/Sign/SignUp') // 注册
  },
  {
    path: '/sign/reset-password',
    name: 'resetPassword',
    component: () => import('@views/Sign/ResetPassword') // 找回密码
  }
]
