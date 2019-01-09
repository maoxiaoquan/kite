<template>
    <div id="global-alert">

        <transition name="modal">  <!--登录模块-->
            <div class="global-box-modal-mask" v-if="is_login_show">
                <div class="global-box-modal-wrapper">
                    <div class="global-modal-container">
                        <div class="modal-top">
                            <i class="iconfont icon-guanbijiantou" @click="close_login"></i>
                        </div>
                        <SignIn/>
                    </div>
                </div>
            </div>
        </transition>


        <transition name="modal">  <!--注册模块-->
            <div class="global-box-modal-mask" v-if="is_register_show">
                <div class="global-box-modal-wrapper">
                    <div class="global-modal-container">
                        <div class="modal-top">
                            <i class="iconfont icon-guanbijiantou" @click="close_register"></i>
                        </div>
                        <SignUp/>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="modal">  <!--找回密码-->
            <div class="global-box-modal-mask" v-if="is_reset_password_show">
                <div class="global-box-modal-wrapper">
                    <div class="global-modal-container">
                        <div class="modal-top">
                            <i class="iconfont icon-guanbijiantou" @click="close_reset_password"></i>
                        </div>
                        <ResetPassword/>
                    </div>
                </div>
            </div>
        </transition>


    </div>
</template>

<script>
  import SignIn from '@views/Sign/SignIn'
  import SignUp from '@views/Sign/SignUp'
  import ResetPassword from '@views/Sign/ResetPassword'

  export default {
    name: 'GlobalAlert',
    methods: {
      close_login() { // 关闭登录弹窗
        this.$store.commit('SET_IS_LOGIN', false)
      },
      close_register() { // 关闭注册弹窗
        this.$store.commit('SET_IS_REGISTER', false)
      },
      close_reset_password() { // 关闭找回密码弹窗
        this.$store.commit('SET_IS_RESET_PASSWORD', false)
      }
    },
    computed: {
      is_login_show() { // 登录弹窗的状态
        return this.$store.state.is_login_show
      },
      is_register_show() { // 注册弹窗的状态
        return this.$store.state.is_register_show
      },
      is_reset_password_show() { // 找回密码
        return this.$store.state.is_reset_password_show
      }
    },
    components: {
      SignIn, /*登录组件*/
      SignUp, /*注册组件*/
      ResetPassword/*找回密码*/
    }
  }
</script>

<style  lang="scss">

    #global-alert {

        .modal-enter {
            opacity: 0;
        }

        .modal-leave-active {
            opacity: 0;
        }

        .modal-enter .modal-container,
        .modal-leave-active .modal-container {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
        }

        .global-box-modal-mask {
            position: fixed;
            z-index: 9998;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: table;
            transition: opacity 0.3s ease;
        }

        .global-box-modal-wrapper {
            display: table-cell;
            vertical-align: middle;
            .modal-top {
                height: 45px;
            }
            .box-modal-header {
                text-align: center;
                padding: 10px 15px;
                h3 {
                    margin-top: 0;
                    color: #42b983;
                }
            }

            .box-modal-footer {
                text-align: center;
                padding: 0 15px 25px;
            }
        }

        .global-modal-container {
            width: 380px;
            margin: 0px auto;
            background-color: #fff;
            border-radius: 2px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
            transition: all 0.3s ease;
            font-family: Helvetica, Arial, sans-serif;
            position: relative;
            .icon-guanbijiantou {
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;
                width: 45px;
                height: 45px;
                line-height: 45px;
                text-align: center;
            }
        }

        .sign-lay.layout-content {
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
                padding-bottom: 60px;
                .title {
                    padding: 10px;
                    font-weight: 400;
                    color: #ea6f5a;
                    font-size: 20px;
                    margin-bottom: 15px;
                }
                .remember-btn {
                    margin: 15px 0;
                    span {
                        margin-left: 5px;
                        font-size: 14px;
                        color: #969696;
                        vertical-align: middle;
                    }
                }
                .input-prepend {
                    position: relative;
                    input {
                        width: 100%;
                        height: 50px;
                        margin-bottom: 0;
                        padding: 4px 12px 4px 42px;
                        border: none;
                        border-bottom: 1px solid #ebebeb;
                        background-color: #ffffff;
                        vertical-align: middle;
                        font-size: 14px;
                    }
                    i {
                        position: absolute;
                        top: 11px;
                        left: 10px;
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
                    font-size: 18px;
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
                        color: #00bcd4;
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
</style>
