import { loadScript } from '../core/extra-function.js'
import marked from 'marked'
var needLangs = []

export default {
  methods: {
    $render (src, func) {
      var $vm = this
      needLangs = []
      var res = marked(src, { breaks: true })
      if (this.ishljs) {
        if (needLangs.length > 0) {
          $vm.$_render(src, func, res)
        }
      }
      func(res)
    },
    $_render (src, func, res) {
      var $vm = this
      var deal = 0
      for (var i = 0; i < needLangs.length; i++) {
        var url = $vm.p_external_link.hljs_lang(needLangs[i])
        loadScript(url, function () {
          deal = deal + 1
          if (deal === needLangs.length) {
            func(res)
          }
        })
      }
    }
  }
}
