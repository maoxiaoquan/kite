<template>
  <div :class="[{ 'fullscreen': s_fullScreen, 'shadow': boxShadow }]"
       class="v-note-wrapper markdown-body"
       :style="{'box-shadow': boxShadow ? boxShadowStyle : ''}">
    <!--工具栏-->
    <div class="v-note-op"
         v-show="toolbarsFlag"
         :style="{'background': toolbarsBackground}">
      <mdToolbarleft ref="toolbar_left"
                     :editable="editable"
                     :transition="transition"
                     :d_words="d_words"
                     @toolbar_left_click="toolbar_left_click"
                     @toolbar_left_addlink="toolbar_left_addlink"
                     :toolbars="toolbars"
                     @imgAdd="$imgAdd"
                     @imgDel="$imgDel"
                     @imgTouch="$imgTouch"
                     :image_filter="imageFilter"
                     :class="{'transition': transition}">
        <slot name="left-toolbar-before"
              slot="left-toolbar-before" />
        <slot name="left-toolbar-after"
              slot="left-toolbar-after" />
      </mdToolbarleft>

      <mdToolbarRight ref="toolbar_right"
                      :d_words="d_words"
                      @toolbar_right_click="toolbar_right_click"
                      :toolbars="toolbars"
                      :s_subfield="s_subfield"
                      :s_preview_switch="s_preview_switch"
                      :s_fullScreen="s_fullScreen"
                      :s_html_code="s_html_code"
                      :s_navigation="s_navigation"
                      :class="{'transition': transition}">
        <slot name="right-toolbar-before"
              slot="right-toolbar-before" />
        <slot name="right-toolbar-after"
              slot="right-toolbar-after" />
      </mdToolbarRight>

    </div>
    <!--编辑展示区域-->
    <div class="v-note-panel">
      <!--编辑区-->
      <div ref="vNoteEdit"
           @scroll="$v_edit_scroll"
           class="v-note-edit divarea-wrapper"
           :class="{'scroll-style': s_scrollStyle, 'scroll-style-border-radius': s_scrollStyle && !s_preview_switch && !s_html_code, 'single-edit': !s_preview_switch && !s_html_code, 'single-show': (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code), 'transition': transition}"
           @click="textAreaFocus">
        <div class="content-input-wrapper"
             :style="{'background-color': editorBackground}">
          <!-- 双栏 -->
          <autoTextara ref="vNoteTextarea"
                       :placeholder="placeholder ? placeholder : d_words.start_editor"
                       class="content-input"
                       :fontSize="fontSize"
                       lineHeight="1.5"
                       v-model="d_value"
                       fullHeight
                       :style="{'background-color': editorBackground}"></autoTextara>
        </div>
      </div>

      <!--展示区-->
      <div :class="{'single-show': (!s_subfield && s_preview_switch) || (!s_subfield && s_html_code)}"
           v-show="s_preview_switch || s_html_code"
           class="v-note-show">
        <div ref="vShowContent"
             v-html="d_render"
             v-show="!s_html_code"
             :class="{'scroll-style': s_scrollStyle, 'scroll-style-border-radius': s_scrollStyle}"
             class="v-show-content"
             :style="{'background-color': previewBackground}">
        </div>
        <div v-show="s_html_code"
             :class="{'scroll-style': s_scrollStyle, 'scroll-style-border-radius': s_scrollStyle}"
             class="v-show-content-html"
             :style="{'background-color': previewBackground}">
          {{d_render}}
        </div>
      </div>

    </div>

    <!--阅读模式-->
    <div :class="{'show': s_readmodel}"
         class="v-note-read-model scroll-style"
         ref="vReadModel">
      <div ref="vNoteReadContent"
           class="v-note-read-content"
           v-html="d_render">
      </div>
    </div>

  </div>
</template> 

<script>
import mdToolbarleft from './components/md-toolbar-left'
import mdToolbarRight from './components/md-toolbar-right'
import { toolbar_left_click, toolbar_left_addlink, toolbar_right_click } from './libs/toobar.js'
import {
  fullscreenchange,
  /* windowResize, */
  scrollLink,
  insertTextAtCaret,
  getNavigation,
  insertTab,
  unInsertTab,
  insertOl,
  insertUl,
  insertEnter,
  removeLine,
  loadLink,
  loadScript,
  ImagePreviewListener
} from './libs/core/extra-function.js'
import autoTextara from './components/auto-textarea'
import lang from './libs/lang'
import { CONFIG } from './libs/config.js'
import "./libs/css/fontello.css"
import marked from 'marked'
import markdown from './libs/mixins/markdown.js'
export default {
  name: 'MarkDown',
  mixins: [markdown],
  props: {
    value: {
      type: String,
      default: ''
    },
    scrollStyle: {  // 是否渲染滚动条样式(webkit)
      type: Boolean,
      default: true
    },
    boxShadow: { // 是否添加阴影
      type: Boolean,
      default: true
    },
    boxShadowStyle: { // 阴影样式
      type: String,
      default: '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
    },
    toolbarsFlag: { // 是否开启工具栏
      type: Boolean,
      default: true
    },
    transition: { // 是否开启动画过渡
      type: Boolean,
      default: true
    },
    placeholder: { // 编辑器默认内容
      type: String,
      default: null
    },
    navigation: {
      type: Boolean,
      default: false
    },
    fontSize: { // 字体大小
      type: String,
      default: '15px'
    },
    toolbars: { // 工具栏
      type: Object,
      default () {
        return CONFIG.toolbars
      }
    },
    previewBackground: { // 预览栏背景色
      type: String,
      default: '#fbfbfb'
    },
    toolbarsBackground: { // 工具栏背景色
      type: String,
      default: '#ffffff'
    },
    editorBackground: { // TODO: 编辑栏背景色
      type: String,
      default: '#ffffff'
    },
    editable: { // 是否开启编辑
      type: Boolean,
      default: true
    },
    subfield: {
      type: Boolean,
      default: true
    },
    imageFilter: {
      type: Function,
      default: null
    },
  },
  data () {
    return {
      newValue: '',
      s_fullScreen: false,// 全屏编辑标志
      s_subfield: (() => {
        return this.subfield;
      })(),
      s_navigation: (() => {
        return this.navigation;
      })(),
      s_scrollStyle: (() => {
        return this.scrollStyle
      })(),// props 是否渲染滚动条样式
      s_readmodel: false,
      d_history: (() => {
        let temp_array = []
        temp_array.push(this.value)
        return temp_array;
      })(), // 编辑记录
      d_history_index: 0, // 编辑记录索引
      d_render: '', // props 文本内容render
      s_preview_switch: (() => {
        let default_open_ = this.defaultOpen;
        if (!default_open_) {
          default_open_ = this.subfield ? 'preview' : 'edit';
        }
        return default_open_ === 'preview' ? true : false;
      })(), // props true 展示编辑 false展示预览
      s_html_code: false,// 分栏情况下查看html
      d_value: '',// props 文本内容
      d_words: null
    }
  },
  mounted () {
    this.d_value = this.value;
  },
  watch: {
    d_value: function (val, oldVal) {
      this.iRender();
    },
    value: function (val, oldVal) {
      if (val !== this.d_value) {
        this.d_value = val
      }
    },
  },
  created () {
    this.init()
  },
  methods: {
    // 获取textarea dom节点
    init () { // 初始化
      var $vm = this;
      this.d_words = lang
      $vm.$render('', function (res) {
        $vm.d_help = res;
      })
    },
    getTextareaDom () {
      return this.$refs.vNoteTextarea.$refs.vTextarea;
    },
    insertUl () { // 插入有序列表
      insertUl(this)
    },
    insertOl () { // 插入无序列表
      insertOl(this)
    },
    $imgTouch (file) {
      var $vm = this;
      // TODO 跳转到图片位置
    },
    iRender () {
      var $vm = this;
      $vm.$render($vm.d_value, function (res) {
        console.log('res', res)
        // render
        $vm.d_render = res;
        // change回调
        if ($vm.change) $vm.change($vm.d_value, $vm.d_render);
        // 改变标题导航
        if ($vm.s_navigation) getNavigation($vm, false);
        // v-model 语法糖
        $vm.$emit('input', $vm.d_value)
        // 塞入编辑记录数组
        if ($vm.d_value === $vm.d_history[$vm.d_history_index]) return
        window.clearTimeout($vm.currentTimeout)
        $vm.currentTimeout = setTimeout(() => {
          $vm.saveHistory();
        }, 500);
      })
    },
    saveHistory () {
      this.d_history.splice(this.d_history_index + 1, this.d_history.length)
      this.d_history.push(this.d_value)
      this.d_history_index = this.d_history.length - 1
    },
    $imgDel (file) {
      // this.markdownIt.image_del(file[1]);
      // 删除所有markdown中的图片
      let fileReg = file[0]
      let reg = new RegExp(`\\!\\[${file[1]._name}\\]\\(${fileReg}\\)`, "g")
      this.d_value = this.d_value.replace(reg, '');
      this.iRender();
      this.$emit('imgDel', file);
    },
    $imgAdd (pos, $file, isinsert) {
      if (isinsert === undefined) isinsert = true;
      var $vm = this;
      if (this.__rFilter == null) {
        // this.__rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        this.__rFilter = /^image\//i;
      }
      this.__oFReader = new FileReader();
      this.__oFReader.onload = function (oFREvent) {
        // $vm.markdownIt.image_add(pos, oFREvent.target.result);
        $file.miniurl = oFREvent.target.result;
        if (isinsert === true) {
          // 去除特殊字符
          $file._name = $file.name.replace(/[\[\]\(\)\+\{\}&\|\\\*^%$#@\-]/g, '');

          $vm.insertText($vm.getTextareaDom(),
            {
              prefix: '![' + $file._name + '](' + pos + ')',
              subfix: '',
              str: ''
            });
          $vm.$nextTick(function () {
            $vm.$emit('imgAdd', pos, $file);
          })
        }
      }
      if ($file) {
        var oFile = $file;
        if (this.__rFilter.test(oFile.type)) {
          this.__oFReader.readAsDataURL(oFile);
        }
      }
    },
    $img2Url (fileIndex, url) {
      // x.replace(/(\[[^\[]*?\](?=\())\(\s*(\.\/2)\s*\)/g, "$1(http://path/to/png.png)")
      var reg_str = "/(!\\[\[^\\[\]*?\\]\(?=\\(\)\)\\(\\s*\(" + fileIndex + "\)\\s*\\)/g"
      var reg = eval(reg_str);
      this.d_value = this.d_value.replace(reg, "$1(" + url + ")")
      this.$refs.toolbar_left.$changeUrl(fileIndex, url)
      this.iRender()
    },
    defaultOpen: function (val) {
      let default_open_ = val;
      if (!default_open_) {
        default_open_ = this.subfield ? 'preview' : 'edit';
      }
      return this.s_preview_switch = default_open_ === 'preview' ? true : false;
    },
    $v_edit_scroll ($event) {
      scrollLink($event, this);
    },
    textAreaFocus () {
      this.$refs.vNoteTextarea.$refs.vTextarea.focus();
    },
    // 工具栏插入内容
    insertText (obj, { prefix, subfix, str, type }) {
      // if (this.s_preview_switch) {
      insertTextAtCaret(obj, { prefix, subfix, str, type }, this);
    },
    toolbar_left_addlink (_type, text, link) {
      toolbar_left_addlink(_type, text, link, this);
    },
    toolbar_left_click (_type) {
      toolbar_left_click(_type, this);
    },
    toolbar_right_click (_type) {
      toolbar_right_click(_type, this);
    },
  },
  components: {
    mdToolbarleft,
    mdToolbarRight,
    autoTextara
  }
}
</script>

<style scoped lang="scss">
textarea:disabled {
  background-color: #ffffff;
}

/* 路由内容 */
.v-note-wrapper {
  position: relative;
  min-width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 200;
  text-align: left;
  border: 1px solid #f2f6fc;
  border-radius: 4px;

  &.fullscreen {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: 0;
    height: auto;
    z-index: 1501;
  }

  .v-note-op {
    padding: 1px;
    width: 100%;
    display: flex;
    white-space: pre-line;
    flex: none;
    min-height: 40px;
    user-select: none;
    border-bottom: 1px solid #f2f6fc;
    border-radius: 4px 4px 0 0;
    background-color: #fff;
    z-index: 1;

    /deep/.v-left-item,
    /deep/.v-right-item {
      flex: 1;
      min-height: 40px;
      box-sizing: border-box;

      .op-icon-divider {
        height: 40px;
        border-left: 1px solid #e5e5e5;
        margin: 0 6px 0 4px;
      }

      .op-icon {
        box-sizing: border-box;
        display: inline-block;
        cursor: pointer;
        height: 28px;
        width: 28px;
        margin: 6px 0 5px 0px;
        font-size: 15px;
        padding: 4.5px 6px 5px 3.5px;
        color: #757575;
        border-radius: 5px;
        text-align: center;
        background: none;
        border: none;
        outline: none;
        line-height: 1;

        // vertical-align middle
        &.dropdown-wrapper {
          line-height: 18px;
        }

        &.selected {
          color: rgba(0, 0, 0, 0.8);
          background: #eaeaea;
        }

        &:hover {
          color: rgba(0, 0, 0, 0.8);
          background: #e9e9eb;
        }
      }

      &.transition {
        .op-icon {
          transition: all 0.2s linear 0s;
        }
      }
    }

    /deep/.v-right-item {
      text-align: right;
      padding-right: 6px;
      max-width: 30%;
    }

    /deep/.v-left-item {
      text-align: left;
      padding-left: 6px;
    }
  }

  .v-note-panel {
    position: relative;
    border-top: none;
    display: flex;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    .v-note-edit.divarea-wrapper {
      flex: 0 0 50%;
      width: 50%;
      padding: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      box-sizing: border-box;
      cursor: text;
      border-bottom-left-radius: 4px;
      .scroll-style::-webkit-scrollbar {
        width: 6px;
        background-color: #e5e5e5;
      }
      .scroll-style::-webkit-scrollbar-thumb {
        background-color: #b7b7b7;
        border-radius: 4px;
      }
      .scroll-style::-webkit-scrollbar-thumb:hover {
        background-color: #a1a1a1;
      }
      .scroll-style::-webkit-scrollbar-thumb:active {
        background-color: #a1a1a1;
      }
      .scroll-style::-webkit-scrollbar-track {
        -webkit-box-shadow: 0 0 0px #808080 inset;
      }
      .scroll-style-border-radius::-webkit-scrollbar {
        border-bottom-right-radius: 4px;
      }

      &.transition {
        transition: all 0.2s linear 0s;
      }

      &.single-edit {
        width: 100%;
        flex: 0 0 100%;
        overflow-y: auto;
      }

      &.single-show {
        width: 0;
        flex: 0 0 0;
        display: none;
      }

      .content-div {
        width: 100%;
        padding: 20px 25px;
        box-sizing: border-box;
        outline: 0 none;
        border: none !important;
        color: #2c3e50;
        font-size: 16px;
      }

      .content-input-wrapper {
        width: 100%;
        padding: 8px 25px 15px 25px;
      }
    }

    .v-note-show {
      flex: 0 0 50%;
      width: 50%;
      overflow-y: auto;
      padding: 0 0;
      transition: all 0.2s linear 0s;

      &.single-show {
        flex: 0 0 100%;
        width: 100%;
      }

      .v-show-content,
      .v-show-content-html {
        width: 100%;
        height: 100%;
        padding: 8px 25px 15px 25px;
        overflow-y: auto;
        box-sizing: border-box;
        overflow-x: hidden;
        .scroll-style::-webkit-scrollbar {
          width: 6px;
          background-color: #e5e5e5;
        }
        .scroll-style::-webkit-scrollbar-thumb {
          background-color: #b7b7b7;
          border-radius: 4px;
        }
        .scroll-style::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1a1;
        }
        .scroll-style::-webkit-scrollbar-thumb:active {
          background-color: #a1a1a1;
        }
        .scroll-style::-webkit-scrollbar-track {
          -webkit-box-shadow: 0 0 0px #808080 inset;
        }
        .scroll-style-border-radius::-webkit-scrollbar {
          border-bottom-right-radius: 4px;
        }
      }
    }

    .v-note-navigation-wrapper {
      display: flex;
      position: absolute;
      width: 250px;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      flex-direction: column;
      background-color: rgba(255, 255, 255, 0.98);
      border-left: 1px solid #f2f6fc;
      border-right: 1px solid #f2f6fc;

      &.transition {
        transition: all 0.1s linear 0s;
      }

      @media only screen and (max-width: 768px) {
        width: 50%;
      }

      &.slideTop-enter-active,
      &.slideTop-leave-active {
        height: 100%;
      }

      &.slideTop-enter,
      &.slideTop-leave-active {
        height: 0;
      }

      .v-note-navigation-title {
        height: 50px;
        width: 100%;
        border-bottom: 1px solid #f2f6fc;
        flex: none;
        line-height: 35px;
        font-size: 16px;
        box-sizing: border-box;
        padding: 0 12px 0 18px;

        .v-note-navigation-close {
          float: right;
          color: #606266;
          font-size: 18px;
          cursor: pointer;

          &:hover {
            color: #303133;
          }
        }
      }

      .v-note-navigation-content {
        overflow-y: auto;
        flex: 1;
        .scroll-style::-webkit-scrollbar {
          width: 6px;
          background-color: #e5e5e5;
        }
        .scroll-style::-webkit-scrollbar-thumb {
          background-color: #b7b7b7;
          border-radius: 4px;
        }
        .scroll-style::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1a1;
        }
        .scroll-style::-webkit-scrollbar-thumb:active {
          background-color: #a1a1a1;
        }
        .scroll-style::-webkit-scrollbar-track {
          -webkit-box-shadow: 0 0 0px #808080 inset;
        }
        .scroll-style-border-radius::-webkit-scrollbar {
          border-bottom-right-radius: 4px;
        }
        padding: 8px 0;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 2px 0;
          font-weight: 500;
          font-size: 17px;
          color: #2185d0;
          cursor: pointer;
          line-height: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 12px;
          border-bottom: none;

          &:hover {
            color: #483d8b;
            text-decoration-line: underline;
          }
        }

        h2 {
          padding-left: 27px;
          font-size: 17px;
        }

        h3 {
          padding-left: 42px;
          font-size: 17px;
        }

        h4 {
          padding-left: 58px;
          font-size: 15px;
        }

        h5 {
          padding-left: 72px;
          font-size: 15px;
        }

        h6 {
          padding-left: 87px;
          font-size: 15px;
        }
      }
    }
  }

  .v-note-read-model {
    position: relative;
    display: none;
    width: 100%;
    height: 100%;
    background: #fbfbfb;
    padding: 30px 8% 50px 8%;
    overflow-y: auto;
    .scroll-style::-webkit-scrollbar {
      width: 6px;
      background-color: #e5e5e5;
    }
    .scroll-style::-webkit-scrollbar-thumb {
      background-color: #b7b7b7;
      border-radius: 4px;
    }
    .scroll-style::-webkit-scrollbar-thumb:hover {
      background-color: #a1a1a1;
    }
    .scroll-style::-webkit-scrollbar-thumb:active {
      background-color: #a1a1a1;
    }
    .scroll-style::-webkit-scrollbar-track {
      -webkit-box-shadow: 0 0 0px #808080 inset;
    }
    .scroll-style-border-radius::-webkit-scrollbar {
      border-bottom-right-radius: 4px;
    }
    box-sizing: border-box;

    &.show {
      display: block;
    }
  }

  &.shadow {
    border: none;
    // box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
}

.v-note-help-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1600;
  transition: all 0.1s linear 0s;

  &.fade-enter-active,
  &.fade-leave-active {
    opacity: 1;
  }

  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
  }

  .v-note-help-content {
    position: relative;
    width: 60%;
    max-width: 800px;
    margin: 30px auto;
    height: 90%;
    min-width: 320px;
    transition: all 0.1s linear 0s;
    z-index: 3;
    border: 1px solid #f2f6fc;

    &.shadow {
      border: none;
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.156863),
        0 0px 5px rgba(0, 0, 0, 0.227451);
    }

    i {
      font-size: 28px;
      position: absolute;
      right: 15px;
      top: 8px;
      color: rgba(0, 0, 0, 0.7);
      cursor: pointer;

      &:hover {
        color: rgba(0, 0, 0, 1);
      }
    }

    .v-note-help-show {
      width: 100%;
      height: 100%;
      font-size: 18px;
      background: #fbfbfb;
      overflow-y: auto;
      padding: 2% 6%;
      .scroll-style::-webkit-scrollbar {
        width: 6px;
        background-color: #e5e5e5;
      }
      .scroll-style::-webkit-scrollbar-thumb {
        background-color: #b7b7b7;
        border-radius: 4px;
      }
      .scroll-style::-webkit-scrollbar-thumb:hover {
        background-color: #a1a1a1;
      }
      .scroll-style::-webkit-scrollbar-thumb:active {
        background-color: #a1a1a1;
      }
      .scroll-style::-webkit-scrollbar-track {
        -webkit-box-shadow: 0 0 0px #808080 inset;
      }
      .scroll-style-border-radius::-webkit-scrollbar {
        border-bottom-right-radius: 4px;
      }
    }
  }
}

.v-note-img-wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1600;
  transition: all 0.1s linear 0s;

  &.fade-enter-active,
  &.fade-leave-active {
    opacity: 1;
  }

  &.fade-enter,
  &.fade-leave-active {
    opacity: 0;
  }

  img {
    flex: 0 0 auto;
    z-index: 3;
  }

  i {
    font-size: 28px;
    position: absolute;
    right: 15px;
    top: 8px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>