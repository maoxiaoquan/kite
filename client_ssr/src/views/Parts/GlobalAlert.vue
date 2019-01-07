<template>
  <div id="global-alert">

    <transition name="modal">  <!--登录模块-->
      <div class="box-modal-mask" v-if="is_login_show">
        <div class="box-modal-wrapper">
          <div class="modal-container">
            <i class="iconfont icon-guanbijiantou" @click="close_login"></i>
            <SignIn/>
          </div>
        </div>
      </div>
    </transition>


    <transition name="modal">  <!--注册模块-->
      <div class="box-modal-mask" v-if="is_register_show">
        <div class="box-modal-wrapper">
          <div class="modal-container">
            <i class="iconfont icon-guanbijiantou" @click="close_register"></i>
            <SignUp/>
          </div>
        </div>
      </div>
    </transition>


  </div>
</template>

<script>
  import SignIn from '@views/Sign/SignIn'
  import SignUp from '@views/Sign/SignUp'

  export default {
    name: 'GlobalAlert',
    methods: {
      close_login() { // 关闭登录弹窗
        this.$store.commit('SET_IS_LOGIN', false)
      },
      close_register() { // 关闭注册弹窗
        this.$store.commit('SET_IS_REGISTER', false)
      }
    },
    computed: {
      is_login_show() { // 或者登录弹窗的状态
        return this.$store.state.is_login_show
      },
      is_register_show() { // 或者注册弹窗的状态
        return this.$store.state.is_register_show
      }
    },
    components: {
      SignIn, /*登录组件*/
      SignUp  /*注册组件*/
    }
  }
</script>

<style scoped lang="scss">
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

  .box-modal-mask {
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

  .box-modal-wrapper {
    display: table-cell;
    vertical-align: middle;
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

  .modal-container {
    width: 300px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    padding-top: 15px;

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

</style>
