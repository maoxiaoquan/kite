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
          {
            path: '',
            name: 'home',
            component: () => import('@views/Home/Home') // 主页
          },
          {
            path: 'column/:column_us_name',
            name: 'column',
            component: () => import('@views/Home/Home') // 专栏
          }
        ]
      },
      {
        path: '/writer',
        name: 'writer',
        component: () => import('@views/Writer/Writer') // 文章编写
      }
    ]
  })
}
