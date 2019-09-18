<template>
  <div id="global-alert">

    <el-dialog :visible.sync="isLoginShow"
               :close-on-click-modal="false"
               class="sign-alert"
               width="350px">
      <SignIn v-if="website.config.on_login==='yes'" />
      <p class="info"
         v-else>登录未开启，请联系管理员开启</p>
    </el-dialog>

    <el-dialog :visible.sync="isRegisterShow"
               :close-on-click-modal="false"
               class="sign-alert"
               width="350px">
      <SignUp v-if="website.config.on_register==='yes'" />
      <p class="info"
         v-else>注册未开启，请联系管理员开启</p>
    </el-dialog>

    <el-dialog :visible.sync="isResetPasswordShow"
               :close-on-click-modal="false"
               class="sign-alert"
               width="350px">
      <ResetPassword />
    </el-dialog>

  </div>
</template>

<script>
import SignIn from '@views/Sign/SignIn'
import SignUp from '@views/Sign/SignUp'
import ResetPassword from '@views/Sign/ResetPassword'
import { mapState } from 'vuex'
export default {
  name: 'GlobalAlert',
  methods: {
    closeLogin (none) { // 关闭登录弹窗
      this.$store.commit('SET_IS_LOGIN', false)
      none()
    },
    closeRegister () { // 关闭注册弹窗
      this.$store.commit('SET_IS_REGISTER', false)
    },
    closeResetPassword () { // 关闭找回密码弹窗
      this.$store.commit('SET_IS_RESET_PASSWORD', false)
    }
  },
  computed: {
    ...mapState(['website']),  // home:主页  article_column:文章的专栏
    isLoginShow: { // 登录弹窗的状态
      get () {
        return this.$store.state.isLoginShow
      },
      set (val) {
        this.$store.state.isLoginShow = val
      },
    },
    isRegisterShow: { // 注册弹窗的状态
      get () {
        return this.$store.state.isRegisterShow
      },
      set (val) {
        this.$store.state.isRegisterShow = val
      },
    },
    isResetPasswordShow: { // 找回密码
      get () {
        return this.$store.state.isResetPasswordShow
      },
      set (val) {
        this.$store.state.isResetPasswordShow = val
      },
    }
  },
  components: {
    SignIn, /*登录组件*/
    SignUp, /*注册组件*/
    ResetPassword/*找回密码*/
  }
}
</script>

<style scoped lang="scss">
.info {
  text-align: center;
  padding: 20px;
  border-radius: 5px;
  color: #fff;
  background: #e05244;
  margin-top: 20px;
}
#global-alert {
  /deep/ .sign-lay.layout-content {
    text-align: center;
    font-size: 14px;
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    border-radius: 2px;
    height: 100%;
    box-sizing: border-box;
    .sign-view {
      text-align: center;
      padding-bottom: 20px;
      .title {
        font-weight: 400;
        color: #ea6f5a;
        font-size: 20px;
        margin-bottom: 15px;
      }
      .remember-btn {
        margin: 15px 0;
        font-size: 12px;
        span {
          margin-left: 5px;
          font-size: 12px;
          color: #969696;
          vertical-align: middle;
        }
      }
      .input-prepend {
        position: relative;
        margin-bottom: 15px;
        input {
          width: 100%;
          height: 35px;
          margin-bottom: 0;
          padding: 4px 12px 4px 42px;
          border: none;
          border: 1px solid #ebebeb;
          background-color: #ffffff;
          vertical-align: middle;
          font-size: 13px;
          border-radius: 12px;
        }
        i {
          position: absolute;
          top: 8px;
          left: 12px;
          font-size: 18px;
          color: #969696;
        }
      }
      .email-view {
        .send-email-input {
          padding-right: 92px;
        }
        .btn-send-email-code {
          position: absolute;
          right: 0;
          font-size: 12px;
          top: 0px;
          bottom: 10px;
        }
      }
      .email-view-code {
        text-align: left;
        .send-email-code {
          width: 170px;
        }
      }
      .sign-in-button,
      .sign-up-button {
        margin-top: 20px;
        width: 100%;
        padding: 9px 18px;
        font-size: 15px;
        border: none;
        border-radius: 25px;
        color: #fff;
        background: #42c02e;
        cursor: pointer;
        outline: none;
        display: block;
        clear: both;
      }
      .footer-text {
        margin-top: 30px;
        em {
          color: #3194d0;
          cursor: pointer;
        }
      }
      #sign-in-form-submit-btn {
        background: #3194d0;
      }
      .more-sign {
        margin-top: 50px;
        h6 {
          margin: 0 0 10px;
          font-size: 12px;
          color: #b5b5b5;
        }
        li {
          display: inline-block;
          margin: 0 5px;
          a {
            width: 50px;
            height: 50px;
            line-height: 50px;
            display: block;
          }
          i {
            font-size: 25px;
          }
          .weibo {
            i {
              color: #e05244;
            }
          }
          .weixin {
            i {
              color: #00bb29;
            }
          }
          .qq {
            i {
              color: #498ad5;
            }
          }
        }
      }
      .sign-footer {
        text-align: center;
        .return-btn {
          padding: 25px 0 30px;
          color: #498ad5;
          display: inline-block;
        }
      }
    }
  }
}

.sign-alert {
  /deep/.el-dialog {
    border-radius: 12px;
    .el-dialog__header {
    }
  }
}
</style>
