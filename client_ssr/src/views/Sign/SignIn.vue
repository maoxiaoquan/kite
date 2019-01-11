<template>
    <section class="sign-lay layout-content">
        <div class="sign-view">
            <div class="title">
                登录
            </div>
            <div class="js-sign-in-container">
                <form id="new_session" ref="login">
                    <!-- 正常登录登录名输入框 -->
                    <div class="input-prepend restyle js-normal">
                        <input placeholder="邮箱" type="text" v-model="form_data.email" value="">
                        <i class="iconfont icon-account"></i>
                    </div>

                    <div class="input-prepend">
                        <input placeholder="密码" type="password" v-model="form_data.password" name="password" value="">
                        <i class="iconfont icon-mima"></i>
                    </div>

                    <div class="remember-btn clearfix">
                        <div class="pull-left">
                            <input type="checkbox" value="true" checked="checked"
                                   id="session_remember_me"><span>记住我</span>
                        </div>
                        <div class="pull-right">
                            <a href="javascript:;" @click="tap_reset_password">忘记密码</a>
                        </div>
                    </div>

                    <div class="footer-text">没有账号？ <em @click="tap_register">注册</em></div>

                    <button class="sign-in-button" id="sign-in-form-submit-btn" type="button" @click="login">
                        登录
                    </button>
                </form>
                <!-- 更多登录方式 -->
                <!--<div class="more-sign">
                  <h6>社交帐号登录</h6>
                  <ul>
                    <li><a class="weibo" href="javascript:alert('暂未开放，请等待后续开放');"><i class="iconfont icon-xinlang"></i></a></li>
                    <li><a class="weixin" target="_blank" href="javascript:alert('暂未开放，请等待后续开放');"><i
                      class="iconfont icon-iconfontweixin"></i></a></li>
                    <li><a class="qq" target="_blank" href="javascript:alert('暂未开放，请等待后续开放');"><i class="iconfont icon-qq"></i></a>
                    </li>
                  </ul>

                  <div class="weibo-geetest-captcha"></div>
                </div>-->
            </div>
        </div>
    </section>
    <!--home-lay layout-content end-->
</template>

<script>

  import { cookie } from '../../../../server/utils/cookie'

  export default {
    name: 'SignIn',
    data() {
      return {
        form_data: {
          email: '',
          phone: '',
          type: 'email',
          password: '',
        }
      }
    },
    methods: {
      login() {
        this.$store.dispatch('sign/LOGIN', this.form_data)
          .then(res => {
            if (res.state === 'success') {
              alert(res.message)
              this.$refs.login.reset()
              cookie.set('accessToken', res.data.token, 1)
              this.$store.commit('SET_IS_LOGIN', false)
            } else {
              alert(res.message)
            }
          })
      },
      tap_register() {
        this.$store.commit('SET_IS_LOGIN', false)
        this.$store.commit('SET_IS_REGISTER', true)
      },
      tap_reset_password() {
        this.$store.commit('SET_IS_LOGIN', false)
        this.$store.commit('SET_IS_RESET_PASSWORD', true)
      }
    }
  }
</script>

<style scoped lang="scss">
    /*sign-in start*/


</style>
