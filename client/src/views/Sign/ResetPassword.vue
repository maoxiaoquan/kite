<template>
  <section class="sign-lay layout-content"
           id="reset-password">
    <div class="sign-view">
      <div class="title">
        重置密码
      </div>
      <div class="js-sign-in-container">
        <form>

          <div class="input-prepend email-view">
            <input placeholder="邮箱"
                   type="text"
                   class="send-email-input account"
                   v-model="formData.email">
            <i class="iconfont icon-phone"></i>
            <send-code v-model="isSendCode"
                       @click.native="sendCode"
                       storage-key="reset-sendEmailCode"
                       class="btn-send-email-code btn"
                       v-loading="sendLoading" />
          </div>

          <div class="input-prepend">
            <input placeholder="请输入验证码"
                   type="text"
                   v-model="formData.code"
                   class="send-email-code code">
            <i class="iconfont icon-yanzhengma"></i>
          </div>

          <div class="input-prepend">
            <input placeholder="新密码"
                   type="password"
                   class="password"
                   v-model="formData.new_password">
            <i class="iconfont icon-mima"></i>
          </div>

          <div class="input-prepend">
            <input placeholder="重复新密码"
                   type="password"
                   class="double_password"
                   v-model="formData.repeat_new_password">
            <i class="iconfont icon-mima"></i>
          </div>

          <button @click="resetSubmit"
                  class="sign-in-button"
                  type="button">
            重置密码
          </button>
        </form>
        <!-- 更多登录方式 -->
        <div class="sign-footer">
          <a class="return-btn"
             href="javascript:;"
             @click="tapSign">返回登录</a>
        </div>
      </div>
    </div>
  </section>
  <!--home-lay layout-content end-->
  <!--home-lay layout-content end-->
</template>

<script>
import { cookie } from '../../../../server/utils/cookie'
import { sendCode } from '@components'

export default {
  name: 'ResetPassword',
  data () {
    return {
      isSendCode: false,
      sendLoading: false,
      formData: {
        email: '',
        code: '',
        type: 'email',
        new_password: '',
        repeat_new_password: ''
      }
    }
  },
  methods: {
    tapRegister () {
      this.$store.commit('SET_IS_LOGIN', false)
      this.$store.commit('SET_IS_REGISTER', true)
    },
    tapSign () {
      this.$store.commit('SET_IS_RESET_PASSWORD', false)
      this.$store.commit('SET_IS_LOGIN', true)
    },
    sendCode () { // 发送注册验证码
      this.sendLoading = true
      this.$store.dispatch('sign/RESET_PASSWORD_CODE', {
        email: this.formData.email,
        type: 'email'
      })
        .then(res => {
          this.sendLoading = false
          if (res.state === 'success') {
            this.isSendCode = true
          } else {
            this.$message.warning(res.message);
          }
        })
    },
    resetSubmit () {
      this.$store.dispatch('sign/RESET_PASSWORD', this.formData)
        .then(result => {
          this.$nextTick(function () {
            if (result.state === 'success') {
              this.$message.success('重置密码成功')
              cookie.delete('accessToken')
              window.location.reload()
            } else {
              this.$message.warning(result.message)
            }
          })
        })
    }
  },
  components: {
    'send-code': sendCode
  }
}
</script>

<style scoped lang="scss">
/*sign-in start*/
</style>
