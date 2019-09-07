export default [
  // user
  {
    path: '/sign_in',
    title: '登录',
    component: () => import('../containers/Sign/view/SignIn')
  },
  {
    path: '/manager',
    component: require('../containers/Manager/view/Manager').default,
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      /*  {path: '/', redirect: '/dashboard/analysis'}, */
      {
        path: '/manager/index',
        name: 'index',
        title: '首页',
        component: () => import('../containers/Index/view/index') // 首页
      },
      {
        path: '/manager/user',
        name: 'user',
        title: '前台用户管理',
        component: () => import('../containers/User/view/User') // 前台用户
      },
      {
        path: '/manager/article',
        name: 'article',
        title: '文章汇总',
        component: () => import('../containers/Article/view/Article') // 文章汇总
      },
      {
        path: '/manager/article-tag',
        name: 'articleTag',
        title: '文章标签',
        component: () => import('../containers/ArticleTag/view/ArticleTag') // 文章标签
      },
      {
        path: '/manager/article-column',
        name: 'articleColumn',
        title: '文章专栏',
        component: () =>
          import('../containers/ArticleColumn/view/ArticleColumn') // 文章专栏
      },
      {
        path: '/manager/article-blog',
        name: 'articleBlog',
        title: '个人专栏',
        component: () => import('../containers/ArticleBlog/view/ArticleBlog') // 个人专栏
      },
      {
        path: '/manager/user-role',
        name: 'userRole',
        title: '用户角色',
        component: () => import('../containers/UserRole/view/UserRole') // 用户角色
      },
      {
        path: '/manager/user-authority',
        name: 'userAuthority',
        title: '用户权限',
        component: () =>
          import('../containers/UserAuthority/view/UserAuthority') // 用户权限
      },
      {
        path: '/manager/user-avatar-review',
        name: 'userAvatarReview',
        title: '用户头像审核',
        component: () => import('../containers/AvatarReview/view/AvatarReview') // 用户头像审核
      },
      {
        path: '/manager/picture',
        name: 'picture',
        title: '图片管理',
        component: () => import('../containers/Picture/view/Picture') // 图片管理
      },
      {
        path: '/manager/article-comment',
        name: 'articleComment',
        title: '评论管理',
        component: () =>
          import('../containers/ArticleComment/view/ArticleComment') // 评论管理
      },
      {
        path: '/manager/admin-user',
        name: 'adminUser',
        title: '后台管理员管理',
        component: () => import('../containers/AdminUser/view/AdminUser') // 后台管理员
      },
      {
        path: '/manager/admin-role',
        name: 'adminRole',
        title: '后台角色',
        component: () => import('../containers/AdminRole/view/AdminRole') // 后台角色
      },
      {
        path: '/manager/admin-authority',
        name: 'adminAuthority',
        title: '后台权限',
        component: () =>
          import('../containers/AdminAuthority/view/AdminAuthority') // 后台权限
      },
      {
        path: '/manager/system-config',
        name: 'systemConfig',
        title: '系统配置',
        component: () => import('../containers/SystemConfig/view/SystemConfig') // 系统配置
      },
      {
        path: '/manager/admin-system-log',
        name: 'adminSystemLog',
        title: '后台系统日志',
        component: () =>
          import('../containers/AdminSystemLog/view/AdminSystemLog') // 后台系统日志
      },
      {
        path: '/manager/website-config',
        name: 'websiteConfig',
        title: '网站配置',
        component: () =>
          import('../containers/WebsiteConfig/view/WebsiteConfig') // 网站配置
      },
      {
        // 2019.8.24 新增 动态
        path: '/manager/dynamic',
        name: 'dynamic',
        title: '动态',
        component: () => import('../containers/Dynamic/view/Dynamic') // 动态的话题
      },
      {
        // 2019.8.4 新增 动态话题
        path: '/manager/dynamic-topic',
        name: 'dynamicTopic',
        title: '动态的话题',
        component: () => import('../containers/DynamicTopic/view/DynamicTopic') // 动态的话题
      },
      {
        // 2019.8.24 新增动态评论管理
        path: '/manager/dynamic-comment',
        name: 'dynamicComment',
        title: '动态的评论管理',
        component: () =>
          import('../containers/DynamicComment/view/DynamicComment') // 动态的评论管理
      }
    ]
  }
]
