<template>
  <div class="user-message">
    <div class="user-message-view">
      <UserMessageItem v-for="(item,key) in user_message.user_message_list"
                       :MessageItem="item"
                       :key="key"
                       @delete-change="deleteChange" />
    </div>
    <Page :count="pagination"
          :page="Number($route.query.page)||1"
          @pageChange="pageChange"></Page>
  </div>
</template>

<script>

import UserMessageItem from '../component/UserMessageItem'
import { Page } from '@components'
export default {
  name: 'UserMessage',
  metaInfo () {
    return {
      title: '消息',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  created () {
    this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
  },
  async asyncData ({ store, route, accessToken }) {
    return store.dispatch('user/GET_USER_MESSAGE_LIST', {
      accessToken,
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  methods: {
    deleteChange () {
      this.$store.dispatch('user/GET_USER_MESSAGE_LIST', {
        page: Number(this.$route.query.page) || 1
      })
    },
    pageChange (val) {
      this.$router.push({
        name: 'userMessage',
        query: {
          page: val
        }
      })
    },
  },
  computed: {
    personal_info () { // 登录后的个人信息
      return this.$store.state.personal_info || {}
    },
    user_info () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
    pagination () { // 分页
      return Math.ceil(this.user_message.count / this.user_message.pageSize)
    },
    user_message () { // 用户的消息
      return this.$store.state.user.user_message || {}
    },
  },
  components: {
    UserMessageItem,
    Page
  }
}
</script>

<style scoped>
</style>
