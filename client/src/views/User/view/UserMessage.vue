<template>
  <div class="user-message"
       v-loading="isLoading">
    <div class="user-message-view">
      <div class="client-card"
           v-for="(item,key) in userMessage.list"
           :key="key">
        <attention v-if="Number(item.action)===userMessageAction.attention"
                   :MessageItem="item"
                   @delete-change="deleteChange" />
        <comment v-else-if="Number(item.action)===userMessageAction.comment"
                 :MessageItem="item"
                 @delete-change="deleteChange" />
        <reply v-else-if="Number(item.action)===userMessageAction.reply"
               :MessageItem="item"
               @delete-change="deleteChange" />
      </div>
    </div>
    <Page :total="userMessage.count"
          :pageSize="userMessage.pageSize"
          :page="Number(userMessage.page)"
          @pageChange="pageChange"></Page>
  </div>
</template>

<script>

import attention from '../msgComponents/attention'
import comment from '../msgComponents/comment'
import reply from '../msgComponents/reply'
import { Page } from '@components'
import { mapState } from 'vuex'
import {
  userMessageType,
  userMessageAction,
  userMessageActionText
} from '@utils/constant'
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
      userMessageType,
      userMessageAction,
      userMessageActionText,
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
    ...mapState(["personalInfo", 'user'])
  },
  components: {
    attention,
    comment,
    reply,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-message {
  .user-message-view {
    padding-top: 20px;
    .client-card {
      margin-bottom: 15px;
      padding: 20px;
    }
  }
}
</style>
