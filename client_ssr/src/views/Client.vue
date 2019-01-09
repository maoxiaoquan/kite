<template>
    <div class="app-view">
        <router-view/>
    </div>
</template>

<script>
  import sign from '@views/Sign/module' // sign 模块

  export default {
    asyncData({ store, route }) {
      // 触发 action 后，会返回 Promise
    },
    name: 'EntryApp',
    beforeCreate() {
      this.$store.registerModule('sign', sign) // sign Module 需要长期存在，所以不注销
      // 特别注释 目前试了下，服务端渲染里执行的registerModule的module除了state,其他的都不会被客户端渲染的共享.
      // 所以部分vuex Module 放在  beforeCreate 中惰性注册
    }
  }
</script>
<style scoped>

</style>
