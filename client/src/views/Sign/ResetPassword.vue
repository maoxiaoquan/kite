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
                        <send-code
                                v-model="is_send_code"
                                @click.native="sendCode"
                                storage-key="reset-sendEmailCode"
                                class="btn-send-email-code btn"
                                v-loading="sendLoading"/>
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
                        <input placeholder="重复新密码" type="password" class="double_password"
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
  import { cookie } from '../../../../server/utils/cookie'
  import { sendCode } from '@components'

  export default {
    name: 'ResetPassword',
    data () {
      return {
        is_send_code: false,
        sendLoading: false,
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
      tap_register () {
        this.$store.commit('SET_IS_LOGIN', false)
        this.$store.commit('SET_IS_REGISTER', true)
      },
      tap_sign () {
        this.$store.commit('SET_IS_RESET_PASSWORD', false)
        this.$store.commit('SET_IS_LOGIN', true)
      },
      sendCode() { // 发送注册验证码
        this.sendLoading = true
        this.$store.dispatch('sign/RESET_PASSWORD_CODE', {
          email: this.form_data.email,
          type: 'email'
        })
          .then(res => {
            this.sendLoading = false
            if (res.state === 'success') {
              this.is_send_code = true
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      reset_submit () {
        this.$store.dispatch('sign/RESET_PASSWORD', this.form_data)
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
