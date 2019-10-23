import Vue from 'vue'
import Confirm from './Confirm.vue'

const ConfirmBox = Vue.extend(Confirm)

Confirm.install = (content, title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }

  options = Object.assign(
    {
      title: title,
      content: content
    },
    options
  )

  let instance = new ConfirmBox({
    data: options
  }).$mount()

  document.body.appendChild(instance.$el)

  return instance.confirm()
}

export default Confirm
