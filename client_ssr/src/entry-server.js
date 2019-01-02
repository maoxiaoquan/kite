import { createApp } from './app'

export default context => {
  // 返回Promise 等待异步路由钩子函数或组件
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    // 设置服务端router的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      //  如果匹配不到, 返回404
      if (!matchedComponents.length) {
        /* eslint-disable */
        return reject({ code: 404 })
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
