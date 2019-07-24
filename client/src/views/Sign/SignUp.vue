<template>
  <section class="sign-lay layout-content">
    <div class="sign-view">
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
            <i class="iconfont icon-account"></i>
          </div>

          <div class="input-prepend email-view">
            <input v-model="formData.email"
                   type="text"
                   class="send-email-input account"
                   placeholder="邮箱">
            <i class="iconfont icon-phone"></i>
            <send-code v-model="isSendCode"
                       @click.native="sendCode"
                       storage-key="sendEmailCode"
                       class="btn-send-email-code"
                       v-loading="sendLoading" />
          </div>

          <div class="input-prepend email-view-code"
               v-show="formData.email">
            <input v-model="formData.code"
                   type="text"
                   class="send-email-code code"
                   placeholder="请输入验证码">
            <i class="iconfont icon-yanzhengma"></i>
          </div>

          <div class="input-prepend">
            <input v-model="formData.password"
                   type="password"
                   class="password"
                   placeholder="密码">
            <i class="iconfont icon-mima"></i>
          </div>

          <div class="input-prepend">
            <input v-model="formData.double_password"
                   type="password"
                   class="double_password"
                   placeholder="重复密码">
            <i class="iconfont icon-mima"></i>
          </div>

          <div class="footer-text">已有账户， <em @click="tapSign">登录</em></div>

          <button class="sign-up-button"
                  type="button"
                  @click="register">注册</button>
        </form>
        <!-- 更多登录方式 -->
        <!--<div class="more-sign">
                  <h6>社交帐号登录</h6>
                  <ul>
                    <li><a class="weibo" href="javascript:alert(暂未开放，请等待后续开放);"><i
                      class="iconfont icon-xinlang"></i></a></li>
                    <li><a class="weixin" target="_blank" href="javascript:alert(暂未开放，请等待后续开放);"><i
                      class="iconfont icon-iconfontweixin"></i></a></li>
                    <li><a class="qq" target="_blank" href="javascript:alert(暂未开放，请等待后续开放);"><i
                      class="iconfont icon-qq"></i></a></li>
                  </ul>

                  <div class="weibo-geetest-captcha"></div>
                </div>-->
      </div>
    </div>
  </section>
</template>

<script>
import { sendCode } from '@components'

export default {
  name: 'SignUp',
  data () {
    return {
      isSendCode: false,
      sendLoading: false,
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
      this.sendLoading = true
      this.$store.dispatch('sign/SIGN_SEND_CODE', { email: this.formData.email })
        .then(res => {
          this.sendLoading = false
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
            this.$store.commit('SET_IS_REGISTER', false)
            this.$store.commit('SET_IS_LOGIN', true)
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    tapSign () {
      this.$store.commit('SET_IS_REGISTER', false)
      this.$store.commit('SET_IS_LOGIN', true)
    }
  },
  components: {
    'send-code': sendCode
  }
}
</script>

