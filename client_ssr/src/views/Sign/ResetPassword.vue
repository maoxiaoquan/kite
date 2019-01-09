<template>
  <section class="sign-lay layout-content" id="reset-password">
    <div class="sign-view">
      <div class="title">
        重置密码
      </div>
      <div class="js-sign-in-container">
        <form>

          <div class="input-prepend email-view">
            <input placeholder="邮箱" type="text" class="send-email-input account" v-model="form_data.email">
            <i class="iconfont icon-phone"></i>
            <button class="btn-send-email-code btn" @click="reset_password_code" type="button">发送验证码</button>
          </div>

          <div class="input-prepend">
            <input placeholder="请输入验证码" type="text" v-model="form_data.code" class="send-email-code code">
            <i class="iconfont icon-yanzhengma"></i>
          </div>

          <div class="input-prepend">
            <input placeholder="新密码" type="password" class="password" v-model="form_data.new_password">
            <i class="iconfont icon-mima"></i>
          </div>

          <div class="input-prepend">
            <input placeholder="重复新密码" type="double_password" class="double_password"
                   v-model="form_data.repeat_new_password">
            <i class="iconfont icon-mima"></i>
          </div>

          <button @click="reset_submit" class="sign-in-button" type="button">
            重置密码
          </button>
        </form>
        <!-- 更多登录方式 -->
        <div class="sign-footer">
          <a class="return-btn" href="javascript:;" @click="tap_sign">返回登录</a>
        </div>
      </div>
    </div>
  </section>
  <!--home-lay layout-content end-->
  <!--home-lay layout-content end-->
</template>

<script>
  export default {
    name: 'ResetPassword',
    data() {
      return {
        form_data: {
          email: '',
          code: '',
          type: 'email',
          new_password: '',
          repeat_new_password: ''
        }
      }
    },
    methods: {
      tap_register() {
        this.$store.commit('SET_IS_LOGIN', false)
        this.$store.commit('SET_IS_REGISTER', true)
      },
      tap_sign() {
        this.$store.commit('SET_IS_RESET_PASSWORD', false)
        this.$store.commit('SET_IS_LOGIN', true)
      },
      reset_password_code: function () {
        var that = this
        /*_server.post_reset_password_code({
          email: that.form_data.email,
          type: 'email'
        })
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                alert('重置密码验证码发送成功')
              } else {
                alert(res.message)
              }
            })
          })*/
      },
      reset_submit: function () {
        var that = this
        /* _server.post_reset_password(that.form_data)
           .then(function (res) {
             that.$nextTick(function () {
               if (res.state === 'success') {
                 alert('重置密码成功')
                 window.location.href = '/sign_in'
               } else {
                 alert(res.message)
               }
             })
           })*/
      }

    }
  }
</script>

<style scoped lang="scss">
  /*sign-in start*/


</style>
