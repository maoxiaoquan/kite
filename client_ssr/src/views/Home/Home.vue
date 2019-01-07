<template>
  <div>
    <h1>This is page Home</h1>
    <h3>{{ user_info.message }}</h3>
    <button @click="open">登录</button>
    <button @click="open2">注册</button>
  </div>
</template>

<script>
  export default {
    asyncData({ store, route }) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('getUserInfo', 100000)
    },
    methods: {
      open() {
        this.$store.commit('SET_IS_LOGIN', true)
      },
      open2() {
        this.$store.commit('SET_IS_REGISTER', true)
      },
    },
    computed: {
      user_info() {
        return this.$store.state.user_info
      }
    }
  }
</script>
