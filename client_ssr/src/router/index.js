import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    linkActiveClass: 'current-active',
    linkExactActiveClass: 'exact-active',
    routes: [
      {
        path: '/',
        name: 'main',
        component: () => import('@views/Main'), // main
        children: [
          { path: '', redirect: { name: 'home' }},
          {
            path: '/index',
            name: 'home',
            component: () => import('@views/Home/Home') // 主页
          },
          {
            path: 'column/:column_us_name',
            name: 'column',
            component: () => import('@views/Home/Column') // 专栏
          },
          {
            path: 'subscribe/:type',
            name: 'subscribe_tag',
            component: () => import('@views/ArticleTag/SubscribeTag') // 文章标签订阅页
          },
          {
            path: 'tag/:article_tag_id',
            name: 'article_tag',
            component: () => import('@views/ArticleTag/ArticleTag') // 文章标签内容页
          }
        ]
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import('@views/Editor/Editor') // 文章编写
      }
    ]
  })
}
