<template>
  <div class="input-msg"
       ref="msg"
       contenteditable="plaintext-only"
       @input="changeText"
       placeholder="placeholder"
       @keydown.enter.prevent="enterMsg"></div>
</template>
 
<script>
export default {
  name: 'editDiv',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (newvalue) {
      console.log(newvalue);
      // if (!this.isLocked && !this.innerText) {
      if (!newvalue) {
        // 清空节点内所有html来清空文本
        this.$refs.msg.innerHTML = '';
      } else {
        this.keepLastIndex(this.$refs.msg);
      }
    }
  },
  methods: {
    changeText (event) {
      this.$emit('input', this.$el.innerHTML);
    },

    enterMsg (event) {
      this.$emit('send');
    },
    keepLastIndex (obj) {
      if (window.getSelection) {
        //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
      }
    }
  }
};
</script>
 
<style scoped>
.input-msg {
  line-height: 17px;
  min-height: 17px;
  border: 0;
  display: block;
  flex: 1;
  max-height: 57px;
  overflow-x: hidden;
  padding: 2px 2px 0 2px;
  user-select: text;
  -webkit-user-modify: read-write-plaintext-only;
}

.input-msg:focus {
  border: 0;
  outline: 0;
}

.input-msg:empty:before {
  content: "";
}
</style>
