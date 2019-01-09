<template>
    <div>
        <h1>This is page Home</h1>
        <h3>{{ fooCount }}</h3>
        <button @click="open">登录</button>
        <button @click="open2">注册</button>
        <Dialog/>
    </div>
</template>

<script>
  export default {
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
      },
      fooCount() {
        return this.$store.state.sign.count
      }
    }
  }
</script>
