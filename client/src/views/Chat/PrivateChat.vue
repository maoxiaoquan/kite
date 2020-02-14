<template>
  <client-only>
    <section class="private-chat">
      <div class="container box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3 chat-user">
            <div class="chat-user-main"></div>
          </div>
          <div class="col-xs-12 col-sm-8 col-md-8 chat-message">
            <div class="message-main">
              <div class="message-scroll"></div>
              <div class="message-enter">
                <textarea rows="3" cols="20" v-model="content"></textarea>
                <button @click="sendMessage">发送</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import io from 'socket.io-client'
import ClientOnly from 'vue-client-only'
import { mapState } from 'vuex'
export default {
  name: 'PrivateChat',
  data() {
    return {
      socket: {},
      content: ''
    }
  },
  mounted() {
    this.socket = io('http://localhost:8086')
    this.socket.on('connection', () => {
      console.log('1111111111', this.socket.id) // 'G5p5...'
    })
    this.socket.emit('login', { my: 'data' })
    this.socket.on('userList', data => {
      console.log(data)
    })
    this.socket.on(this.personalInfo.user.uid, data => {
      console.log('mag', data)
    })
  },
  methods: {
    sendMessage() {
      // 发送消息
      this.socket.emit('newMessage', {
        sendUid: this.personalInfo.user.uid,
        message: this.content,
        receive_uid: 10001
      })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    ClientOnly
  }
}
</script>

<style scoped lang="scss">
.private-chat {
}
</style>
