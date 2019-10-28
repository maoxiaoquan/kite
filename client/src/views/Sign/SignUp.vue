<template>
  <ClientOnly>
    <section class="sign-lay layout-content">
      <div class="sign-view client-card">
        <div class="title">
          注册
        </div>
        <div class="js-sign-in-container">
          <form id="sign-up"
                accept-charset="UTF-8"
                method="post"
                ref="register">

            <div class="input-prepend restyle js-normal">
              <input v-model="formData.nickname"
                     type="text"
                     class="nickname"
                     placeholder="你的昵称">
              <i class="el-icon-user-solid"></i>
            </div>

            <div class="input-prepend email-view">
              <input v-model="formData.email"
                     type="text"
                     class="send-email-input account"
                     placeholder="邮箱">
              <i class="el-icon-message"></i>
              <send-code :isSend="isSendCodeSuccess"
                         v-model="isSendCode"
                         @click.native="sendCode"
                         storage-key="sendEmailCode"
                         class="btn-send-email-code" />
            </div>

            <div class="input-prepend email-view-code"
                 v-show="formData.email">
              <input v-model="formData.code"
                     type="text"
                     class="send-email-code code"
                     placeholder="请输入验证码">
              <i class="el-icon-chat-round"></i>
            </div>

            <div class="input-prepend">
              <input v-model="formData.password"
                     type="password"
                     class="password"
                     placeholder="密码">
              <i class="el-icon-key"></i>
            </div>

            <div class="input-prepend">
              <input v-model="formData.double_password"
                     type="password"
                     class="double_password"
                     placeholder="重复密码">
              <i class="el-icon-key"></i>
            </div>

            <div class="footer-text">已有账户， <em @click="tapSign">登录</em></div>

            <button class="sign-up-button"
                    type="button"
                    @click="register">注册</button>
          </form>

        </div>
      </div>
    </section>
  </ClientOnly>
</template>

<script>
import { sendCode } from '@components'
import ClientOnly from 'vue-client-only'
export default {
  name: 'SignUp',
  data () {
    return {
      isSendCode: false,
      isSendCodeSuccess: false, // 验证码是否发送
      formData: {
        nickname: '',
        email: '',
        phone: '',
        code: '',
        type: 'email',
        password: '',
        double_password: ''
      }
    }
  },
  methods: {
    sendCode () { // 发送注册验证码
      this.isSendCodeSuccess = true
      this.$store.dispatch('sign/SIGN_SEND_CODE', { email: this.formData.email })
        .then(res => {
          this.isSendCodeSuccess = false
          if (res.state === 'success') {
            this.isSendCode = true
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    register () {
      this.$store.dispatch('sign/REGISTER', this.formData)
        .then(res => {
          if (res.state === 'success') {
            this.$message.success(res.message)
            this.$refs.register.reset();
            this.$router.push({ name: 'signIn' })
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    tapSign () {
      this.$router.push({ name: 'signIn' })
    }
  },
  components: {
    'send-code': sendCode,
    ClientOnly
  }
}
</script>

