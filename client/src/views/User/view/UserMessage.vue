<template>
  <div class="user-message"
       v-loading="isLoading">
    <div class="user-message-view">
      <div class="user-message-item"
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
        <like v-else-if="Number(item.action)===userMessageAction.like"
              :MessageItem="item"
              @delete-change="deleteChange" />
        <thumb v-else-if="Number(item.action)===userMessageAction.thumb"
               :MessageItem="item"
               @delete-change="deleteChange" />
        <sell v-else-if="Number(item.action)===userMessageAction.sell"
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
import like from '../msgComponents/like'
import reply from '../msgComponents/reply'
import thumb from '../msgComponents/thumb'
import sell from '../msgComponents/sell'

import { Page } from '@components'
import { mapState } from 'vuex'
import {
  userMessageAction,
} from '@utils/constant'
export default {
  name: 'UserMessage',
  data () {
    return {
      isLoading: false,
      userMessageAction,
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
    like,
    thumb,
    sell,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-message {
  .user-message-view {
    padding-top: 20px;
    .user-message-item {
      margin-bottom: 15px;
      padding: 20px;
      border: 1px solid rgba(178, 186, 194, 0.15);
    }
  }
}
</style>
