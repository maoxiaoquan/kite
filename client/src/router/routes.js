export default [
  {
    path: '/',
    component: () => import('@views/Main'), // main
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
        component: () => import('@views/Home/Home') // 主页
      },
      {
        path: 'column/:article_column_en_name',
        name: 'column',
        component: () => import('@views/Home/Column') // 主页
      },
      {
        path: 'p/:aid',
        name: 'article',
        component: () => import('@views/Article/Article') // 文章内容页
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@views/Search/view/Search') // 搜索页
      },
      {
        path: 'user/:uid',
        name: 'user',
        component: () => import('@views/User/User'), // 文章内容页
        children: [
          {
            path: 'article',
            name: 'userArticle',
            component: () => import('@views/User/view/Article') // 文章内容页
          },
          {
            path: 'user-dynamic',
            name: 'userDynamic',
            component: () => import('@views/User/view/Dynamic') // 个人发送的动态列表
          },
          {
            path: 'books',
            name: 'userBooks',
            component: () => import('@views/User/view/books') // 用户的小书
          },
          {
            path: 'blog',
            name: 'userBlog',
            component: () => import('@views/User/view/Blog') // 用户自己的个人专栏
          },
          {
            path: 'attention',
            name: 'userAttention',
            component: () => import('@views/User/view/UserAttention') // 用户关注用户
          },
          {
            path: 'like',
            name: 'userLike',
            component: () => import('@views/User/view/UserLike') // 用户like文章
          },
          {
            path: 'message',
            name: 'userMessage',
            component: () => import('@views/User/view/UserMessage') // 用户消息
          }
        ],
        redirect: { name: 'userArticle' }
      },
      {
        path: 'user/setting',
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
        path: 'tag/:article_tag_en_name',
        name: 'article_tag',
        component: () => import('@views/ArticleTag/ArticleTag') // 文章标签内容页
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
        component: () => import('@views/Dynamic/dynamicTopic') // 动态内容页
      },
      {
        path: 'topic/:dynamicTopicId',
        name: 'dynamicTopicView',
        component: () => import('@views/Dynamic/dynamicTopicView') // 动态内容页
      },
      {
        path: 'blogs/:columnEnName',
        name: 'articleBlogs',
        component: () => import('@views/ArticleBlog/Blog') // 个人专栏
      },
      {
        path: 'blog/:blogId',
        name: 'articleBlog',
        component: () => import('@views/ArticleBlog/BlogView') // 个人专栏内容
      },
      {
        path: 'blogs-like',
        name: 'articleBlogsLike',
        component: () => import('@views/ArticleBlog/myLikeBlog') // 个人用户like的个人专栏
      },
      {
        path: 'books-write/:type',
        name: 'booksWrite',
        component: () => import('@views/Books/WriteBooks') // 小书创建修改
      }
    ]
  }
  // {
  //   path: '/editor/:editor_type',
  //   name: 'editor',
  //   component: () => import('@views/Editor/Editor') // 旧文章编写保留文件
  // }
]
