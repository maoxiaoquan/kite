<template>
  <client-only>
    <section class="personal-lay layout-content">
      <div class="container  box-container">
        <div class="row">

          <div class="col-xs-12 col-sm-8 col-md-8 main">
            <ul class="trigger-menu">
              <li>
                <router-link :to='{name:"personalCollect"}'>
                  收藏
                </router-link>
              </li>
            </ul>

            <router-view />
          </div>

          <div class="col-xs-12 col-sm-4 col-md-4 box-aside">
            <router-link class="personal"
                         :to="{name:'user',params:{uid:$route.params.uid}}">
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
  async asyncData ({ store, route }) {
    return Promise.all([
      store.dispatch('user/GET_USER_INFO_ALL', { uid: route.params.uid }),
      store.dispatch('user/GET_USER_ATTENTION_LIST', {
        uid: route.params.uid
      })
    ])
  },
  methods: {

  },
  computed: {
    ...mapState(['personalInfo', 'user']),  // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    UserAside,
    ClientOnly
  }
}
</script>

<style scoped lang="scss">
.personal-lay {
  .trigger-menu {
    border-bottom: 1px solid #f0f0f0;
    font-size: 0;
    list-style: none;
    li {
      position: relative;
      display: inline-block;
      padding: 10px 0;
      a {
        padding: 13px 20px;
        font-size: 15px;
        color: #969696;
        line-height: 25px;
        &:hover {
          color: #646464;
        }
      }
      .current-active {
        margin-bottom: -1px;
        border-bottom: 2px solid #646464;
        a {
          color: #646464;
        }
      }
    }
  }
  .personal {
    font-size: 14px;
    color: #333;
  }
}
</style>
