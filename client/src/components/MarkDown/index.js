/**
 * Created by zhy on 2017/4/1.
 */
'use strict'

/**
 * mavonEditor
 * @author hinesboy
 */
const mavonEditor = require('./editor.vue').default

const VueMavonEditor = {
  // markdownIt: mavonEditor.mixins[0].data().markdownIt,
  mavonEditor: mavonEditor,
  LeftToolbar: require('./components/md-toolbar-left.vue').default,
  RightToolbar: require('./components/md-toolbar-right.vue').default,
  install: function (Vue) {
    Vue.component('mark-editor', mavonEditor)
  }
}

module.exports = VueMavonEditor
