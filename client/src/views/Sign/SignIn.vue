<template>
  <section class="sign-lay layout-content">
    <div class="sign-view">
      <div class="title">
        登录
      </div>
      <div class="js-sign-in-container">
        <form id="new_session"
              ref="login">
          <!-- 正常登录登录名输入框 -->
          <div class="input-prepend restyle js-normal">
            <input placeholder="邮箱"
                   type="text"
                   v-model="formData.email"
                   @keyup.enter="login"
                   value="">
            <i class="el-icon-user-solid"></i>
          </div>

          <div class="input-prepend">
            <input placeholder="密码"
                   type="password"
                   v-model="formData.password"
                   name="password"
                   @keyup.enter="login"
                   value="">
            <i class="el-icon-key"></i>
          </div>

          <div class="remember-btn clearfix">
            <div class="pull-left">
              没有账号？ <em class="reg-btn"
                  @click="tapRegister">注册</em>
            </div>
            <div class="pull-right">
              <a href="javascript:;"
                 @click="tapResetPassword">忘记密码</a>
            </div>
          </div>

          <div class="footer-text"></div>

          <button class="sign-in-button"
                  id="sign-in-form-submit-btn"
                  type="button"
                  @click="login">
            登录
          </button>
        </form>

      </div>
    </div>
  </section>
  <!--home-lay layout-content end-->
</template>

<script>

import { cookie } from '../../../../server/utils/cookie'

export default {
  name: 'SignIn',
  data () {
    return {
      formData: {
        email: '',
        phone: '',
        type: 'email',
        password: '',
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch('sign/LOGIN', this.formData)
        .then(res => {
          if (res.state === 'success') {
            this.$message.success(res.message)
            this.$refs.login.reset()
            cookie.set('accessToken', res.data.token, 7)
            this.$store.commit('SET_IS_LOGIN', false)
            window.location.reload()
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    tapRegister () {
      this.$store.commit('SET_IS_LOGIN', false)
      this.$store.commit('SET_IS_REGISTER', true)
    },
    tapResetPassword () {
      this.$store.commit('SET_IS_LOGIN', false)
      this.$store.commit('SET_IS_RESET_PASSWORD', true)
    }
  }
}
</script>

<style scoped lang="scss">
/*sign-in start*/
.reg-btn {
  color: #3194d0;
  cursor: pointer;
}
</style>
