<template>
  <client-only>
    <section class="private-chat-list">
      <div class="container box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8 chat-message">
            <div class="chat-message-main">
              <div class="chat-title">与{{ $route.query.nickname }}的私聊</div>
              <div class="chat-message-content">
                <div class="chat-message-scroll" id="message-scroll">
                  <div class="chat-message-list" id="chat-message-list">
                    <span
                      class="loading-history-data"
                      @click="getPrivateChatMsgList('click')"
                      v-if="isHistoryData"
                      >查看更多历史聊天</span
                    >
                    <div
                      class="chat-message-item"
                      v-for="(item, key) in messageList"
                      :class="{
                        me: personalInfo.user.uid === item.sendUser.uid
                      }"
                    >
                      <div class="avatar">
                        <img
                          class="avatar-img"
                          :src="item.sendUser.avatar"
                          alt=""
                        />
                      </div>
                      <div class="msg-view">
                        <div class="user-info">
                          <span class="user-nickname">{{
                            item.sendUser.nickname
                          }}</span>
                          <span class="msg-time">{{ item.create_dt }}</span>
                        </div>
                        <div class="msg-content">
                          {{ item.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="new-message" v-show="isNewMessage"
                    >有新的消息</span
                  >
                </div>
              </div>
              <div class="chat-message-footer clearfix">
                <textarea
                  rows="3"
                  cols="20"
                  class="message-input"
                  v-model="message"
                ></textarea>
                <button @click="sendMessage" class="send-message">发送</button>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <UserAside />
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import ClientOnly from 'vue-client-only'
import UserAside from '../view/UserAside'
import { mapState } from 'vuex'

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export default {
  name: 'PrivateChat',
  data() {
    return {
      messageList: [],
      message: '',
      page: 1,
      pageSize: 5,
      isHistoryData: true,
      isLockList: false,
      isNewMessage: false,
      chatInfo: {} // 用户私聊信息
    }
  },
  mounted() {
    this.scrollChatView()
    this.getPrivateChatInfo()
    this.$socket.on('privateMessage', data => {
      if (data.sendUser.uid === this.$route.query.uid) {
        this.messageList.push(data)
        if (this.isLockList) {
          this.isNewMessage = true
        }
      }
      this.scrollToBottom()
    })
  },
  methods: {
    compare(property) {
      return function(a, b) {
        let i = a[property]
        let j = b[property]
        return i - j
      }
    },
    getPrivateChatInfo() {
      this.$store
        .dispatch('chat/GET_PRIVATE_CHAT_INFO', {
          receive_uid: this.$route.query.uid
        })
        .then(result => {
          if (result.data.info) {
            this.chatInfo = result.data.info
            this.getPrivateChatMsgList()
            this.privateChatRead()
            this.$store.dispatch('user/GET_UNREAD_MESSAGE_COUNT')
          } else {
            this.joinPrivateChat()
          }
        })
    },
    getPrivateChatMsgList(type) {
      this.$store
        .dispatch('chat/GET_PRIVATE_CHAT_MSG_LIST', {
          receive_uid: this.$route.query.uid,
          page: this.page,
          pageSize: this.pageSize
        })
        .then(result => {
          this.page += 1
          let newSortList = result.data.list.sort(this.compare('id'))
          if (result.data.list.length < this.pageSize) {
            this.isHistoryData = false
          }
          this.messageList = newSortList.concat(this.messageList)
          this.setScrollTop(result.data.list ? result.data.list.length : 0)
          if (!type) {
            this.scrollToBottom()
          }
        })
    },
    joinPrivateChat() {
      // 用户聊天加入私聊
      this.$store
        .dispatch('chat/JOIN_PRIVATE_CHAT', {
          receive_uid: this.$route.query.uid
        })
        .then(() => {
          this.getPrivateChatInfo()
        })
    },
    sendMessage() {
      // 发送消息
      this.$store
        .dispatch('chat/SEND_PRIVATE_CHAT_MESSAGE', {
          receive_uid: this.$route.query.uid,
          message: this.message
        })
        .then(result => {
          this.isLockList = false
          this.messageList.push(result.data)
          this.message = ''
          this.scrollToBottom()
        })
    },
    privateChatRead() {
      // 用户聊天消息阅读
      this.$store.dispatch('chat/PRIVATE_CHAT_READ', {
        chat_id: this.chatInfo.chat_id
      })
    },
    scrollChatView() {
      this.$nextTick(() => {
        setTimeout(() => {
          document
            .querySelector('#message-scroll')
            .addEventListener('scroll', debounce(this.handleScroll, 250))
        })
      })
    },
    setScrollTop(length) {
      this.$nextTick(() => {
        const messageDom = document.querySelector('#message-scroll')
        messageDom.scrollTop = 98 * length
      })
    },
    handleScroll() {
      const messageDom = document.querySelector('#message-scroll')
      const scrollTop = messageDom.scrollTop
      const messageHeight = document.querySelector('#chat-message-list')
        .offsetHeight
      if (messageHeight - scrollTop > 550) {
        this.isLockList = true
      } else {
        this.isLockList = false
        this.isNewMessage = false
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (!this.isLockList) {
          const messageDom = this.$el.querySelector('#message-scroll')
          messageDom.scrollTop = messageDom.scrollHeight
        }
      })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    ClientOnly,
    UserAside
  }
}
</script>

<style scoped lang="scss">
.private-chat-list {
  .chat-message-main {
    background: #fff;
    .chat-title {
      padding: 15px;
      display: block;
      font-size: 14px;
      color: #333;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
    }
    .chat-message-content {
      margin-bottom: 20px;
      position: relative;
      padding: 0 20px;
    }
    .chat-message-scroll {
      height: 500px;
      overflow-y: auto;
      padding: 20px;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 30px;
        background-color: #e0e0e0;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        width: 8px;
        background: #fff;
      }
      .loading-history-data {
        border-radius: 3px;
        display: block;
        font-size: 12px;
        width: 200px;
        color: #3ac3fc;
        text-align: center;
        margin: 10px auto;
        cursor: pointer;
      }
      .new-message {
        position: absolute;
        bottom: 10px;
        left: 50%;
        margin-left: -62px;
        background: #f46e65;
        padding: 2px 5px;
        border-radius: 3px;
        display: block;
        font-size: 12px;
        width: 124px;
        color: #fff;
        text-align: center;
        cursor: pointer;
      }
    }
    .chat-message-item {
      margin-bottom: 20px;
      .avatar {
        float: left;
        .avatar-img {
          width: 50px;
          height: 50px;
          border-radius: 30px;
          border: 1px solid #e0e0e0;
        }
      }
      .msg-view {
        padding-left: 60px;
        .user-info {
          .user-nickname {
            font-size: 14px;
            color: #333;
          }
          .msg-time {
            font-size: 12px;
            color: #666;
          }
        }
        .msg-content {
          background: #f6f6f6;
          display: inline-block;
          font-size: 15px;
          padding: 12px;
          border-radius: 10px;
          margin-top: 5px;
        }
      }
      &.me {
        text-align: right;
        .avatar {
          float: right;
        }
        .msg-view {
          padding-left: 0;
          padding-right: 60px;
          .msg-content {
            background: #f46e6552;
          }
        }
      }
    }
  }
  .chat-message-footer {
    border-top: 1px solid #f1f1f1;
    position: relative;
    background: #fff;
    .message-input {
      border: none;
      height: 150px;
    }
    .send-message {
      position: absolute;
      right: 20px;
      bottom: 20px;
      border-radius: 20px;
      padding: 5px 25px;
      border: 1px solid #f8f8f8;
      color: #f7f7f7;
      font-size: 15px;
      background: #f46e65;
    }
  }
}
</style>
