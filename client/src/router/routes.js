export default [
  {
    path: '/',
    component: require('@views/Main').default, // main
    children: [
      {
        path: '/',
        redirect: {
          name: 'home'
        }
      },
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
        component: require('@views/Search/view/Search').default // 搜索页
      },
      {
        path: 'user/:uid',
        name: 'user',
        component: require('@views/User/User').default, // 文章内容页
        children: [
          {
            path: 'article',
            name: 'userArticle',
            component: require('@views/User/view/Article').default // 文章内容页
          },
          {
            path: 'user-dynamic',
            name: 'userDynamic',
            component: require('@views/User/view/Dynamic').default // 个人发送的动态列表
          },
          {
            path: 'books',
            name: 'userBooks',
            component: require('@views/User/view/Books').default // 用户的小书
          },
          {
            path: 'blog',
            name: 'userBlog',
            component: require('@views/User/view/Blog').default // 用户自己的个人专栏
          },
          {
            path: 'attention',
            name: 'userAttention',
            component: require('@views/User/view/UserAttention').default // 用户关注用户
          },
          {
            path: 'message',
            name: 'userMessage',
            component: require('@views/User/view/UserMessage').default // 用户消息
          }
        ],
        redirect: { name: 'userArticle' }
      },
      {
        path: 'personal/:uid',
        name: 'personal',
        component: require('@views/User/Personal').default, // 个人页
        children: [
          {
            path: 'collect',
            name: 'personalCollect',
            component: require('@views/User/PersonalView/Collect').default // 收藏
          }
        ]
      },
      {
        path: 'user/setting',
        name: 'setting',
        component: require('@views/Setting/Setting').default, // 文章内容页
        children: [
          {
            path: 'profile',
            name: 'settingProfile',
            component: require('@views/Setting/view/Profile').default // 修改资料
          },
          {
            path: 'reset-password',
            name: 'settingResetPassword',
            component: require('@views/Setting/view/ResetPassword').default // 重置密码
          }
        ],
        redirect: { name: 'settingProfile' }
      },
      {
        path: 'column-all',
        name: 'columnAll',
        component: require('@views/ArticleColumn/ArticleColumn').default // 文章专栏
      },
      {
        path: 'subscribe/:type',
        name: 'subscribe_tag',
        component: require('@views/ArticleTag/SubscribeTag').default // 文章标签订阅页
      },
      {
        path: 'tag/:en_name',
        name: 'article_tag',
        component: require('@views/ArticleTag/ArticleTag').default // 文章标签内容页
      },
      {
        path: 'article-rule',
        name: 'article_rule',
        component: require('@views/Rule/ArticleRule').default // 文章编写规则
      },
      {
        path: 'comment-rule',
        name: 'comment_rule',
        component: require('@views/Rule/CommentRule').default // 评论规则
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
        component: require('@views/Dynamic/index').default // 动态首页
      },
      {
        path: 'dynamic/:dynamicId',
        name: 'dynamicView',
        component: require('@views/Dynamic/dynamicView').default // 动态内容页
      },
      {
        path: 'topics',
        name: 'dynamicTopic',
        component: require('@views/Dynamic/dynamicTopic').default // 动态专题
      },
      {
        path: 'topic/:dynamicTopicId',
        name: 'dynamicTopicView',
        component: require('@views/Dynamic/dynamicTopicView').default // 动态专题内容页
      },
      // {
      //   path: 'blogs/:columnEnName', 屏蔽，此功能不开放
      //   name: 'articleBlogs',
      //   component: () => import('@views/ArticleBlog/Blog') // 个人专栏
      // },
      {
        path: 'blog/:blogId',
        name: 'articleBlog',
        component: require('@views/ArticleBlog/BlogView').default // 个人专栏内容
      },
      {
        path: 'books-write/:type',
        name: 'booksWrite',
        component: () => import('@views/Books/WriteBooks') // 小书创建修改
      },
      {
        path: 'books/:columnEnName',
        name: 'books',
        component: require('@views/Books/Books').default // 小书首页
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
    component: require('@views/BookView/BookView').default // 查看小书内容
  },
  {
    path: '/book/:books_id/write/:book_id',
    name: 'WriteBookView',
    component: () => import('@views/BookView/WriteBookView') // 编辑小书内容
  }
  // {
  //   path: '/editor/:editor_type',
  //   name: 'editor',
  //   component: () => import('@views/Editor/Editor') // 旧文章编写保留文件
  // }
]
