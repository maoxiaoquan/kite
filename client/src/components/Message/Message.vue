<template>
  <transition name="fade">
    <div class="message"
         :class="type"
         v-show="show">
      <i class="icon"></i>
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'message',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: val => ['info', 'success', 'warning', 'error'].includes(val)
      //['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
    },
    text: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.message {
  position: fixed;
  top: 40px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  min-width: 400px;
  padding: 10px 20px;
  color: #909399;
  background: #f5f5f5;
  border: 1px solid #f5f5f5;
  font-size: 14px;
  line-height: 1.4;
  border-radius: 4px;
  z-index: 5000;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);

  &.info {
    color: #909399;
    background-color: #f4f4f5;
    border: 1px solid #909399;
  }

  &.success {
    color: #67c23a;
    background-color: #f0f9eb;
    border: 1px solid #67c23a;
  }

  &.error {
    border: 1px solid #e6a23c;
    background-color: #fdf6ec;
    color: #e6a23c;
  }

  &.warning {
    color: #f56c6c;
    background-color: #fef0f0;
    border: 1px solid #f56c6c;
  }
}
</style>