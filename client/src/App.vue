<template>
  <div id="app">
    <router-view />
    <global-alert />
  </div>
</template>

<script>
import globalAlert from '@views/Parts/GlobalAlert'
export default {
  name: 'App',
  components: {
    'global-alert': globalAlert
  }
}
</script>
