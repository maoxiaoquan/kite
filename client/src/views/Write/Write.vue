<template>
  <div class="write">
    <client-only>
      <!-- this component will only be rendered on client-side -->
      <mavon-editor />
    </client-only>
  </div>
</template>

<script>
// Local Registration
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import ClientOnly from 'vue-client-only'

export default {
  name: 'write',
  data () {
    return {

    }
  },
  components: {
    'mavon-editor': mavonEditor,
    ClientOnly
  }
}
</script>

<style lang="scss" scoped>
.write {
  margin: auto;
  width: 100%;
  height: 580px;
}
</style>



