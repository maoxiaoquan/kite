<template>
  <client-only>
    <section class="private-chat-list">
      <div class="container box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8 chat-message">
            <div class="chat-message-main">
              <div class="chat-title">与{{ $route.query.nickname }}的私聊</div>
              <div class="chat-message-scroll" id="message-scroll">
                <span
                  class="loading-history-data"
                  @click="getPrivateChatMsgList('click')"
                  v-if="isHistoryData"
                  >加载历史聊天</span
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
export default {
  name: 'PrivateChat',
  data() {
    return {
      messageList: [],
      message: '',
      page: 1,
      pageSize: 5,
      isHistoryData: true,
      chatInfo: {} // 用户私聊信息
    }
  },
  mounted() {
    this.getPrivateChatInfo()
    this.$socket.on('privateMessage', data => {
      if (data.sendUser.uid === this.$route.query.uid) {
        this.messageList.push(data)
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
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('#message-scroll')
        container.scrollTop = container.scrollHeight
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
    padding: 25px;
    .chat-title {
      background: #ea6f5a;
      padding: 10px;
      display: inline-block;
      margin: 0 auto 15px;
      font-size: 14px;
      color: #fff;
      font-weight: bold;
      border-radius: 10px;
      text-align: center;
    }
    .chat-message-scroll {
      height: 500px;
      overflow-y: auto;
      padding: 20px;
      margin-bottom: 20px;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background-color: skyblue;
        background-image: -webkit-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.2) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.2) 50%,
          rgba(255, 255, 255, 0.2) 75%,
          transparent 75%,
          transparent
        );
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #ededed;
        border-radius: 10px;
      }
      .loading-history-data {
        background: #fd6926;
        padding: 2px 5px;
        border-radius: 3px;
        display: block;
        font-size: 12px;
        width: 200px;
        color: #fff;
        text-align: center;
        margin: 10px auto;
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
    .message-input {
      border-radius: 15px;
      border: 1px solid #e0e0e0;
    }
    .send-message {
      float: right;
      border-radius: 20px;
      margin-top: 10px;
      padding: 5px 20px;
      border: 1px solid #f8f8f8;
      color: #f7f7f7;
      font-size: 15px;
      background: #f46e65;
    }
  }
}
</style>
