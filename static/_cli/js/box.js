/* server func */

const _Fetch = axios.create({
  baseURL: '/',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})

_Fetch.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    console.error(error)
  }
)

function hasClass (obj, cls) {
  var obj_class = obj.className // 获取 class 内容.
  var obj_class_lst = obj_class.split(/\s+/) // 通过split空字符将cls转换成数组.
  for (var x in obj_class_lst) {
    if (obj_class_lst[x] == cls) {
      // 循环数组, 判断是否包含cls
      return true
    }
  }
  return false
}

// eslint-disable-next-line no-unused-expressions
!(function (window) {
  var _server = {
    cliSetStep: function (data) {
      // 根据uid更新用户相关信息
      return _Fetch.post('/set_step', data)
    },
    cliSetMysql: function (data) {
      // 根据uid更新用户相关信息
      return _Fetch.post('/set_mysql', data)
    },
    cliCreateAdminUser: function (data) {
      // 根据uid更新用户相关信息
      return _Fetch.post('/create_admin_user', data)
    },
    cliRestartProject: function (data) {
      // 根据uid更新用户相关信息
      return _Fetch.post('/restart_project', data)
    }
  }

  window._server = _server
})(window)

var modal_template =
  ' <transition name="modal">' +
  '        <div class="modal-mask" v-if="show">' +
  '            <div class="modal-wrapper">' +
  '                <div class="modal-container">' +
  '                    <i class="iconfont icon-guanbijiantou" @click="close_model"></i>' +
  '                    <div class="box-modal-header">' +
  '                        <slot name="header">' +
  '                            提示' +
  '                        </slot>' +
  '                    </div>' +
  '                    <div class="box-modal-body">' +
  '                        <slot />' +
  '                    </div>' +
  '                    <div class="box-modal-footer">' +
  '                        <slot name="footer">' +
  '                            <button class="btn btn-primary modal-default-button" @click="close_model">' +
  '                                确认' +
  '                            </button>' +
  '                        </slot>' +
  '                    </div>' +
  '                </div>' +
  '            </div>' +
  '        </div>' +
  '    </transition>'

/* <child :foo.sync=”msg”></child> 就会被扩展为： <child :foo=”bar” @update:foo=”val => bar = val”>  （@是v-on的简写） */

// register modal component
Vue.component('box-modal', {
  props: {
    show: {
      default: false
    }
  },
  methods: {
    close_model: function () {
      this.$emit('update:show', false)
    }
  },
  template: modal_template
})
