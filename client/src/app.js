import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

import {
  Message,
  MessageBox,
  Button,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Popover,
  Loading,
  Image
} from 'element-ui'

import './assets/css/box_layout.scss'
import './assets/css/reset.scss'
import './assets/css/other.scss'
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
// Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(Loading)

Vue.component('el-button', Button)
Vue.component('el-dialog', Dialog)
Vue.component('el-dropdown', Dropdown)
Vue.component('el-dropdown-menu', DropdownMenu)
Vue.component('el-dropdown-item', DropdownItem)
Vue.component('el-popover', Popover)
Vue.component('el-image', Image)

export function createApp (context) {
  // 创建 router 和 store 实例
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return {
    app,
    router,
    store
  }
}
