<template>
  <button type="button"
          class="btn-code"
          :disabled="start">
    {{_isSend?'发送验证中...':tmpStr}}
  </button>
</template>

<script>
export default {
  name: 'sendcode',
  data () {
    return {
      tmpStr: '获取验证码',
      timer: null,
      start: false,
      runSecond: this.second
    }
  },
  props: {
    initStr: String,
    second: {
      default: 60,
      validator (val) {
        return /^\d*$/.test(val)
      }
    },
    runStr: {
      type: String,
      default: '{%s}秒后重新获取'
    },
    resetStr: {
      type: String,
      default: '重新获取验证码'
    },
    isSend: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    storageKey: {
      type: String
    }
  },
  methods: {
    run (lastSecond) {
      let second = lastSecond || this.runSecond
      if (this.storageKey) {
        const runSecond = new Date().getTime() + second * 1000
        if (!this.$isServer) {
          window.sessionStorage.setItem(this.storageKey, runSecond)
        }
      }
      if (!lastSecond) {
        this.tmpStr = this.getStr(second)
      }
      this.timer = setInterval(() => {
        second--
        this.tmpStr = this.getStr(second)
        second <= 0 && this.stop()
      }, 1000)
    },
    stop () {
      this.tmpStr = this.resetStr
      this.start = false
      this.$emit('input', false)
      clearInterval(this.timer)
    },
    getStr (second) {
      return this.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, second)
    }
  },
  watch: {
    value (val) {
      this.start = val
      val && this.run()
    },
  },
  computed: {
    _isSend () {
      return this.isSend
    }
  },
  created () {
    if (!this.$isServer) {
      const lastSecond = ~~((window.sessionStorage.getItem(this.storageKey) - new Date().getTime()) / 1000)
      if (lastSecond > 0 && this.storageKey) {
        this.tmpStr = this.getStr(lastSecond)
        this.start = true
        this.run(lastSecond)
      } else {
        if (this.initStr) this.tmpStr = this.initStr
      }
    }
  },
  destroyed () {
    !this.storageKey && this.stop()
  }
}
</script>

<style scoped lang="scss">
.btn-code {
  border-radius: 2px;
  border: none;
  padding: 0.5rem 1.3rem;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  background-color: transparent;
  color: #3194d0;
  &[disabled="disabled"] {
    color: #999;
  }
}
</style>
