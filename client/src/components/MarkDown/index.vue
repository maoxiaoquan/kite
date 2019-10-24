<template>
  <div class="markdown">
    <!-- 工具栏 -->
    <div class="markdown-top">
      <mdHeader />
    </div>
    <div class="markdown-panel">
      <div class="markdown-write">
        <autoTextara ref="vNoteTextarea"
                     placeholder="请输入内容"
                     class="content-input"
                     fontSize="15px"
                     lineHeight="1.5"
                     fullHeight
                     v-model="newValue" />
      </div>
      <div class="markdown-preview"></div>
    </div>
  </div>
</template> 

<script>
import mdHeader from './components/mdHeader'
import autoTextara from './components/auto-textarea'
export default {
  name: 'MarkDown',
  props: ['value'],
  data () {
    return {
      newValue: ''
    }
  },
  watch: {
    value (val) {
      this.newValue = val
    },
    newValue (val) {
      this.$emit('input', val)
    },
  },
  components: {
    mdHeader,
    autoTextara
  }
}
</script>

<style scoped lang="scss">
.markdown {
  min-width: 300px;
  min-height: 300px;
  &::after {
    display: table;
    clear: both;
    content: "";
  }
  .markdown-top {
    padding: 1px;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    white-space: pre-line;
    -webkit-box-flex: 0;
    -webkit-flex: none;
    -ms-flex: none;
    flex: none;
    min-height: 40px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-bottom: 1px solid #f2f6fc;
    border-radius: 4px 4px 0 0;
    background-color: #fff;
    z-index: 1;
  }
  .markdown-panel {
    position: relative;
    border-top: none;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .markdown-write {
      -webkit-box-flex: 0;
      -webkit-flex: 0 0 50%;
      -ms-flex: 0 0 50%;
      flex: 0 0 50%;
      width: 50%;
      padding: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      box-sizing: border-box;
      cursor: text;
      border-bottom-left-radius: 4px;
      .markdown-write-view {
        font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New",
          "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei",
          sans-serif;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        overflow-y: hidden;
        color: #2c3e50;
        outline: 0 none;
        border: none !important;
        resize: none;
      }
    }
    .markdown-preview {
      flex: 1;
    }
  }
}
</style>