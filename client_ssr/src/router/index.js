import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@views/Home/home')
      },
     /* {
        path: '/sign-in',
        name: 'signin',
        component: () => import('@views/Sign/SignIn')
      },
      {
        path: '/sign-up',
        name: 'signup',
        component: () => import('@views/Sign/SignUp')
      },*/
    ]
  })
}
