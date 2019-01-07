<template>
  <div class="box-modal">
    <transition name="modal">
      <div class="box-modal-mask" v-if="show">
        <div class="box-modal-wrapper">
          <div class="modal-container">
            <i class="iconfont icon-guanbijiantou" @click="close_model"></i>
            <div class="box-modal-header">
              <slot name="header">
                提示
              </slot>
            </div>
            <div class="box-modal-body">
              <slot/>
            </div>
            <div class="box-modal-footer">
              <slot name="footer">
                <button class="btn btn-primary modal-default-button" @click="close_model">
                  确认
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      show: {
        default: false,
      },
    },
    methods: {
      close_model() {
        this.$emit('update:show', false)
      },
    },
  }
</script>

<style scoped lang="scss">

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

    .box-modal-body {
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
</style>
