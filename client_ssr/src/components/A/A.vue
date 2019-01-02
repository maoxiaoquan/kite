<template>
  <div>
    <h1>This is page A</h1>
    <h3>{{ this.movie }}</h3>
  </div>
</template>

<script>
export default {
  title () {
    return 'A页面'
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('fetchMovie', 54321)
  },
  computed: {
    movie () {
      return this.$store.state.movie
    }
  }
}
</script>
