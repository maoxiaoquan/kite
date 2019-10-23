import Message from './Message.vue'

const MESSAGE = {
  duration: 3000, // 显示的时间 ms
  animateTime: 300, // 动画时间,表示这个组件切换show的动画时间
  install (Vue) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component('Message', Message)

    function msg (type, text, callBack) {
      let msg
      let duration = MESSAGE.duration
      if (typeof text === 'string') {
        msg = text
      } else if (text instanceof Object) {
        msg = text.text || ''
        if (text.duration) {
          duration = text.duration
        }
      }
      let VueMessage = Vue.extend({
        render (h) {
          let props = {
            type,
            text: msg,
            show: this.show
          }
          return h('message', { props })
        },
        data () {
          return {
            show: false
          }
        }
      })
      let newMessage = new VueMessage()
      let vm = newMessage.$mount()
      let el = vm.$el
      document.body.appendChild(el) // 把生成的提示的dom插入body中
      vm.show = true
      let t1 = setTimeout(() => {
        clearTimeout(t1)
        vm.show = false // 隐藏提示组件，此时会有300ms的动画效果，等动画效果过了再从body中移除dom
        let t2 = setTimeout(() => {
          clearTimeout(t2)
          document.body.removeChild(el) // 从body中移除dom
          newMessage.$destroy()
          vm = null // 设置为null，好让js垃圾回收算法回收，释放内存

          callBack && typeof callBack === 'function' && callBack()
          // 如果有回调函数就执行，没有就不执行，用&&操作符，
          // 只有&&左边 的代码为true才执行&&右边的代码，避免用面条代码：
          // if(true){
          //   ...
          //   if(true){
          //   ...
          //   }
          // }
        }, MESSAGE.animateTime)
      }, duration)
    }

    // 挂载到vue原型上，暴露四个方法
    Vue.prototype.$message = {
      info (text, callBack) {
        if (!text) return
        msg('info', text, callBack)
      },
      success (text, callBack) {
        if (!text) return
        msg('success', text, callBack)
      },
      error (text, callBack) {
        if (!text) return
        msg('error', text, callBack)
      },
      warning (text, callBack) {
        if (!text) return
        msg('warning', text, callBack)
      }
    }
  }
}
export default MESSAGE
