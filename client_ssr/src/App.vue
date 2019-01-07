<template>
  <div class="app">
    <Header/> <!--公共头部-->
    <router-view/>
    <GlobalAlert/> <!--公共弹窗-->
  </div>
</template>

<script>

  import Header from '@views/Parts/Header'
  import GlobalAlert from '@views/Parts/GlobalAlert'

  export default {
    name: 'App',
    methods: {
      update() {
        /* eslint-disable */
        alert('hi')
      }
    },
    computed: {
    },
    components: {
      Header,
      GlobalAlert
    }
  }
</script>
