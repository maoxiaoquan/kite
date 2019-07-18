import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import routes from './routes'

Vue.use(Router)
Vue.use(Meta)

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    linkActiveClass: 'current-active',
    linkExactActiveClass: 'exact-active',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return {
          x: 0,
          y: 0
        }
      }
    },
    routes: routes
  })
}
