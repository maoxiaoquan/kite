<template>
  <div class="dialog-view"
       v-show="visible">
    <div class="dialog-mark"
         @click.self="handleWrapperClick"
         :style="{'z-index': zIndex}"></div>
    <transition name="dialog-fade"
                @after-enter="afterEnter"
                @after-leave="afterLeave">
      <div class="el-dialog__wrapper"
           :style="{'z-index': zIndex+1}"
           @click.self="handleWrapperClick">
        <div role="dialog"
             :key="key"
             aria-modal="true"
             :aria-label="title || 'dialog'"
             :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
             ref="dialog"
             :style="style">
          <div class="el-dialog__header">
            <slot name="title">
              <span class="el-dialog__title">{{ title }}</span>
            </slot>
            <button type="button"
                    class="el-dialog__headerbtn"
                    aria-label="Close"
                    v-if="showClose"
                    @click="handleClose">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <div class="el-dialog__body"
               v-if="rendered">
            <slot></slot>
          </div>
          <div class="el-dialog__footer"
               v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>

export default {
  name: 'ElDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: Boolean,
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      closed: false,
      key: 0,
      rendered: true,
      zIndex: this.getZIndex(),
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    }
  },
  computed: {
    style () {
      let style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },
  methods: {
    getMigratingConfig () {
      return {
        props: {
          'size': 'size is removed.'
        }
      };
    },
    /** 每次获取之后 zindex 自动增加 */
    getZIndex () {
      let zIndexInit = 3000; return zIndexInit++
    },
    handleWrapperClick () {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose () {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide (cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    afterEnter () {
      this.$emit('opened');
    },
    afterLeave () {
      this.$emit('closed');
    }
  },
  mounted () {
    if (this.visible) {
      this.rendered = true;
      //  this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },
  destroyed () {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-view {
  .dialog-mark {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
  }
}
.el-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
}

.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 50%;
}

.el-dialog__header {
  padding: 20px 20px 10px;
}

.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}

.el-dialog__headerbtn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
}

.el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: right;
  box-sizing: border-box;
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>