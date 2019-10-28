<template>
  <div class="dropdown-view">
    <div @click="toggleOpen"
         class="dropdown-button">
      <slot name="button"></slot>
    </div>
    <div class="dropdown-button">
      <slot name="no-button"></slot>
    </div>
    <div v-clickoutside="close"
         @click="visible=false"
         v-show="visible"
         :style="style"
         class="dropdown-menu">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popover',
  props: {
    placement: {
      type: String,
      default: 'left'
    },
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    toggleOpen () {
      this.visible = !this.visible
    },
    close (e) {
      if (this.$el.contains(e.target)) return;
      this.visible = false
    },
  },
  computed: {
    style () {
      if (this.placement === 'left') {
        return { 'left': 0 }
      } else if (this.placement === 'right') {
        return { 'right': 0 }
      }
    }
  },
  directives: {
    clickoutside: {
      bind (el, binding, vnode) {
        const documentHandler = (e) => {
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

<style scoped lang="scss">
.dropdown-view {
  position: relative;
}
.dropdown-view-button {
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}
.dropdown-menu {
  position: absolute;
  min-width: 150px;
  border-radius: 4px;
  padding: 10px 0;
  margin: 5px 0;
  background-color: #fff;
  z-index: 200;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .dropdown-menu-view {
    .dropdown-menu-item {
      list-style: none;
      display: block;
      line-height: 36px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      outline: none;
      &:focus,
      &:not(.is-disabled):hover {
        background-color: #ecf5ff;
        color: #66b1ff;
      }
    }
  }
}
</style>