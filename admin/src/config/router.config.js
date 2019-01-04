export default [
  // user
  {
    path: '/sign_in',
    component: () => import('../containers/Sign/view/SignIn'),
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
        name: 'Index',
        component: () => import('../containers/Index/view/index'), // 首页
      },
      {
        path: '/manager/user',
        name: 'User',
        component: () => import('../containers/User/view/User'), // 前台用户
      },
      {
        path: '/manager/article',
        name: 'Article',
        component: () => import('../containers/Article/view/Article'), // 文章汇总
      },
      {
        path: '/manager/article_tag',
        name: 'ArticleTag',
        component: () => import('../containers/ArticleTag/view/ArticleTag'), // 文章标签
      },
      {
        path: '/manager/banner',
        name: 'Banner',
        component: () => import('../containers/Banner/view/Banner'), // Banner
      },
      {
        path: '/manager/article_column',
        name: 'ArticleColumn',
        component: () => import('../containers/ArticleColumn/view/ArticleColumn'), // 文章标签
      },
      {
        path: '/manager/user_tag',
        name: 'UserTag',
        component: () => import('../containers/UserTag/view/UserTag'), // 用户标签
      },
      {
        path: '/manager/picture',
        name: 'Picture',
        component: () => import('../containers/Picture/view/Picture'), // 图片管理
      },
      {
        path: '/manager/comment',
        name: 'Comment',
        component: () => import('../containers/Comment/view/Comment'), // 评论管理
      },
      {
        path: '/manager/admin_user',
        name: 'AdminUser',
        component: () => import('../containers/adminUser/view/AdminUser'), // 后台管理员
      },
      {
        path: '/manager/admin_role',
        name: 'AdminRole',
        component: () => import('../containers/adminRole/view/AdminRole'), // 后台角色
      },
      {
        path: '/manager/admin_authority',
        name: 'AdminAuthority',
        component: () => import('../containers/adminAuthority/view/AdminAuthority'), // 后台权限
      },
      {
        path: '/manager/admin_system_log',
        name: 'AdminSystemLog',
        component: () => import('../containers/AdminSystemLog/view/AdminSystemLog'), // 后台系统日志
      },
    ],
  },
]
