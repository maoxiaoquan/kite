<template>
  <client-only>
    <section class="layout-content detail-lay">
      <div class="container  box-container">

        <h3>贝壳明细</h3>

        <div class="row">

          <div class="col-xs-12 col-sm-8 col-md-8 main">
            <table>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>

          </div>

          <div class="col-xs-12 col-sm-4 col-md-4 box-aside">
            <router-link class="personal"
                         :to="{name:'user',params:{uid:$route.params.uid,routeType:'article'}}">
              返回个人中心 <i class="el-icon-d-arrow-right"></i>
            </router-link>
            <UserAside />
          </div>

        </div>
      </div>

    </section>
  </client-only>
</template>

<script>
import UserAside from './view/UserAside'
import Collect from './PersonalView/Collect'
import { mapState } from 'vuex'
import ClientOnly from 'vue-client-only'
export default {
  name: 'Personal',
  metaInfo () {
    return {
      title: '个人中心',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data () {
    return {
      detail: {
        list: [],
        count: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getVirtualList()
  },
  methods: {
    getVirtualList () {
      this.$store.dispatch('virtual/GET_USER_ATTENTION_LIST', {
        uid: route.params.uid
      })
    },
  },
  computed: {
    ...mapState(['personalInfo', 'user']),  // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    UserAside,
    ClientOnly,
    Collect
  }
}
</script>

<style scoped lang="scss">
.detail-lay {
}
</style>
