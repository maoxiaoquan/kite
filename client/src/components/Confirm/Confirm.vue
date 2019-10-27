<template>
  <transition name="fade">
    <div class="confirm-wrap"
         v-if="visible">
      <div class="confirm">
        <div class="hd">
          {{title}}
          <i class="btn-close iconfont icon-close"
             @click="handleAction('close')"></i>
        </div>
        <div class="bd">
          <i v-if="type!=''"
             class="icon-type iconfont"
             :class="'icon-'+type"></i>{{content}}
        </div>
        <div class="ft">
          <a href="javscript:void(0)"
             class="btn btn-primary"
             @click="handleAction('yes')">{{yesBtnText}}</a>
          <a href="javscript:void(0)"
             class="btn btn-default"
             @click="handleAction('cancel')">{{cancelBtnText}}</a>
        </div>
      </div>
      <div class="backdrop"
           @click="handleAction('close')"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "MyConfirm",
  data () {
    return {
      visible: false,
      title: "",
      content: "",
      yesBtnText: "确定",
      cancelBtnText: "取消",
      type: "",
      promiseStatus: null
    };
  },
  watch: {
    visible: function (curVal) {
      if (curVal && document.body.scrollHeight > window.innerHeight) {
        document.querySelector('body').classList.add("backdrop-open");
      } else {
        document.querySelector('body').classList.remove("backdrop-open");
      }
    }
  },
  methods: {
    confirm () {
      let _this = this;
      this.visible = true;
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject };
      });
    },
    handleAction (action) {
      this.visible = false;
      if (action == "yes") {
        this.promiseStatus && this.promiseStatus.resolve();
      } else {
        this.promiseStatus && this.promiseStatus.reject();
      }
    }
  }
};
</script>

<style lang="scss" scope>
//confirm Modal
.confirm-wrap,
.modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s;
  z-index: 9999;
  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
  }
  .confirm,
  .modal {
    position: relative;
    display: inline-block;
    width: 420px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    z-index: 999;
    .hd {
      font-size: 16px;
      line-height: 1;
      padding: 15px 15px 10px 15px;
      .btn-close {
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }
    .bd {
      padding: 10px 15px;
    }
    .ft {
      padding: 5px 15px;
      text-align: right;
    }
  }
  &:after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
}
.modal-wrap {
  .modal {
    width: 600px;
  }
}
.confirm-wrap {
  .icon-type {
    margin-right: 10px;
    font-size: 24px;
    vertical-align: middle;
  }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
</style>