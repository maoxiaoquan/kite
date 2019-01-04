<template>
  <div>
    <h1>This is page Home</h1>
    <h3>{{ user_info.message }}</h3>
  </div>
</template>

<script>
  export default {
    asyncData ({ store, route }) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('getUserInfo', 100000)
    },
    computed: {
      user_info () {
        return this.$store.state.user_info
      }
    }
  }
</script>
