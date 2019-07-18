<template>
    <div class="app-view">
        <Header/> <!-- 公共头部 -->
        <router-view/>
        <GlobalAlert/> <!-- 公共弹窗-->
    </div>
</template>

<script>
  import Header from '@views/Parts/Header'
  import GlobalAlert from '@views/Parts/GlobalAlert'

  export default {
    name: 'Main',
    asyncData ({ store, route, accessToken = '' }) {
      // 触发 action 后，会返回 Promise
      return Promise.all([
        store.dispatch('PERSONAL_INFO', { accessToken }),
        store.dispatch('website/GET_WEBSITE_INFO'),
        store.dispatch('article_tag/GET_ARTICLE_TAG_ALL'),
        store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
      ])
    },
    components: {
      Header,
      GlobalAlert
    }
  }
</script>
