<template>
  <div class="user-message"
       v-loading="isLoading">
    <div class="user-message-view">
      <UserMessageItem v-for="(item,key) in userMessage.list"
                       :MessageItem="item"
                       :key="key"
                       @delete-change="deleteChange" />
    </div>
    <Page :total="userMessage.count"
          :pageSize="userMessage.pageSize"
          :page="Number(userMessage.page)"
          @pageChange="pageChange"></Page>
  </div>
</template>

<script>

import UserMessageItem from '../component/UserMessageItem'
import { Page } from '@components'
import { mapState } from 'vuex'
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
  data () {
    return {
      isLoading: false,
      userMessage: {
        // 用户消息
        list: [],
        count: 0,
        page: 1,
        pageSize: 10
      },
    }
  },
  created () {
    this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
  },
  mounted () {
    this.getUserMessageList()
  },
  methods: {
    getUserMessageList () {
      this.$store.dispatch('user/GET_USER_MESSAGE_LIST', {
        page: this.userMessage.page || 1,
        pageSize: this.userMessage.pageSize || 10,
      }).then(result => {
        this.userMessage = result.data
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    deleteChange () {
      this.getUserMessageList()
    },
    pageChange (val) {
      this.userMessage.page = val
      this.getUserMessageList()
    },
  },
  computed: {
    ...mapState(["personalInfo"]),
    userInfo () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
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
