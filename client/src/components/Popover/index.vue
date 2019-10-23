<template>
  <div class="pop-over">
    <div @click="toggleOpen"
         class="pop-button">
      <slot name="button"></slot>
    </div>
    <div class="pop-button">
      <slot name="no-button"></slot>
    </div>
    <div v-clickoutside="close"
         v-show="visible"
         class="pop-view">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popover',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    toggleOpen: function () {
      this.$emit('update:visible', !this.visible);
    },
    close: function (e) {
      if (this.$el.contains(e.target)) return;
      this.$emit('update:visible', false);
    }
  },
  directives: {
    clickoutside: {
      bind: function (el, binding, vnode) {
        const documentHandler = function (e) {
          if (!vnode.context || el.contains(e.target)) return;
          binding.value(e);
        };
        setTimeout(() => {
          document.addEventListener('click', documentHandler);
        }, 0);
      }
    }
  }
}
</script>

<style scoped>
.pop-over {
  position: relative;
}
.pop-button {
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
.pop-view {
  position: absolute;
  background: #fff;
  min-width: 150px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 200;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
}
</style>