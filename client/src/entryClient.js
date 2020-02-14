import Vue from 'vue'
import { createApp } from './app'
import NProgress from 'nprogress'
import { loading } from './directive'

import VueLazyload from 'vue-lazyload'
const { app, router, store } = createApp()
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/default/img/loadingfail.png',
  loading: '/default/img/loadingimg.png',
  attempt: 1
})

Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      })
        .then(next)
        .catch(next)
    } else {
      next()
    }
  }
})

Vue.directive('loading', loading)

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((d, i) => {
      return diffed || (diffed = prevMatched[i] !== d)
    })
    if (!activated.length) {
      return next()
    }
    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(
      activated.map(r => {
        if (r.asyncData) {
          return r.asyncData({
            store,
            route: to
          })
        }
      })
    )
      .then(() => {
        // 停止加载指示器(loading indicator)
        next()
      })
      .catch(next)
  })
  app.$mount('#app')
})

router.beforeEach((to, from, next) => {
  // 每次切换页面时，调用进度条
  NProgress.start()
  // 这个一定要加，没有next()页面不会跳转的。这部分还不清楚的去翻一下官网就明白了
  next()
})
// 当路由进入后：关闭进度条
router.afterEach(() => {
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})

function isLocalhost() {
  return /^http(s)?:\/\/localhost/.test(location.href)
}

if (
  (location.protocol === 'https:' || isLocalhost()) &&
  navigator.serviceWorker
) {
  navigator.serviceWorker.register('/_client/service-worker.js')
}
