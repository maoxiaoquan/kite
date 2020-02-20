<template>
  <div class="app-view">
    <box-header />
    <router-view />
    <global-view />
  </div>
</template>

<script>
import header from '@views/Parts/Header'
import GlobalView from '@views/Parts/GlobalView'
import { mapState } from 'vuex'
export default {
  name: 'Main',
  asyncData({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch('PERSONAL_INFO', { accessToken }),
      store.dispatch('website/GET_WEBSITE_INFO'),
      store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    ])
  },
  mounted() {
    if (this.personalInfo.islogin) {
      this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
      this.$store.dispatch('user/GET_ASSOCIATE_INFO')
      // 用户登录的情况下，当前用户加入socket
      this.$socket.emit('loginXiaoSuiBi', { uid: this.personalInfo.user.uid })
    }
  },
  computed: {
    ...mapState(['personalInfo']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    'box-header': header,
    GlobalView
  }
}
</script>
