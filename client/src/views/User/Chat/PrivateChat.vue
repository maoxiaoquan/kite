<template>
  <client-only>
    <section class="private-chat-list">
      <div class="container box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8 chat-message">
            <div class="message-main">
              <div class="message-scroll"></div>
              <div class="message-enter">
                <textarea rows="3" cols="20" v-model="message"></textarea>
                <button @click="sendMessage">发送</button>
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
      socketId: '',
      socket: {},
      message: ''
    }
  },
  mounted() {
    this.$store.dispatch('user/GET_USER_INFO_ALL', {
      uid: this.personalInfo.user.uid
    })
    this.$socket.on('privateMessage', data => {
      console.log('privateMessage', data)
    })
    // this.socket = io('http://localhost:8086')
    // if (this.personalInfo.islogin) {
    //   // 判断用户是否登录
    //   this.socket.emit('joinXiaoSuiBi', {
    //     uid: this.personalInfo.user.uid
    //   })
    // }
    // this.socket.on('joinXiaoSuiBiInfo', data => {
    //   this.socketId = data.socketId
    //   console.log('joinXiaoSuiBiInfo', data)
    // })
    // this.socket.on(this.personalInfo.user.uid, data => {
    //   console.log('mag', data)
    // })
    // this.socket.on('test', data => {
    //   console.log('msg', data)
    // })
  },
  methods: {
    sendMessage() {
      // 发送消息
      this.$store.dispatch('chat/SEND_PRIVATE_CHAT_MESSAGE', {
        receive_uid: this.$route.query.uid,
        message: this.message
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
}
</style>
