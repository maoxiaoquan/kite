# 基于webpack4构建的vue应用（SSR/SPA）

📦 此项目是通过webpack搭建了vue单页面应用以及vue服务端渲染应用。项目只是作为学习webpack以及SSR，并不足以强大能够用于线上项目。

> 看完整代码可以查找对应Tag。

## webpack-SPA

[完整代码](https://github.com/lhz960904/webpack-vue-ssr/tree/webpack4-SPA-v1.0)

#### Usage:

```shell
npm install

npm run dev # 开发环境

npm run build # 线上构建
```





## webpack-SSR

[完整代码](https://github.com/lhz960904/webpack-vue-ssr/tree/webpack-SSR-v1.0)

#### Usage:

```shell
npm install

npm run dev # 开发环境

npm run build # 线上构建
npm run start # 线上运行
```

```javascript
// movie.vue
export default {
  // 更改title
  title () {
  	return 'demo1'
  },
  // 异步获取数据
  asyncData ({ store, route }) {
    // 触发 action 后，例：请求电影、传入id
    return store.dispatch('fetchMovie', 54321)
  },
}


// store/index.js
return new Vuex.Store({
  state: {
    movie: {}
  },
  actions: {
    fetchMovie ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // ajax去请求数据
      }).then(res => {
        commit('setMoive', { res })
      })
    }
  },
  mutations: {
    setMoive (state, { res }) {
      Vue.set(state, 'movie', res)
    }
  }
})
```
