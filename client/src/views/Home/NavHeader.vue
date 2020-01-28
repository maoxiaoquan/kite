<template>
  <div class="top-tabs clearfix">
    <router-link class="top-tabs-link"
                 :to="{name:'home'}">推荐</router-link>
    <router-link class="top-tabs-link"
                 :to="{name: 'column', params: { en_name: 'all' }}">专栏</router-link>
    <router-link class="top-tabs-link"
                 v-if="personalInfo.islogin"
                 :to="{name:'AttentionMessage'}">关注</router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NavHeader',
  props: {
    navItem: Array
  },
  computed: {
    ...mapState(['articleColumn', 'personalInfo'])
  }
}
</script>

<style scoped lang="scss">
.top-tabs {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-bottom: 1px solid #f6f6f6;
  height: 62px;
  border-bottom: 1px solid #f0f2f7;
  .top-tabs-link {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 16px;
    cursor: pointer;
    margin: 0 22px;
    &.exact-active {
      color: #ea6f5a;
    }
  }
}
@media (max-width: 575px) {
  .top-tabs {
    height: 50px;
  }
}
</style>
