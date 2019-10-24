<template>
  <div class="v-left-item">
    <slot name="left-toolbar-before" />
    <button :disabled="!editable"
            type="button"
            @click="$clicks('bold')"
            class="op-icon fa fa-mavon-bold"
            aria-hidden="true"
            :title="`粗体 (ctrl+b)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('italic')"
            class="op-icon fa fa-mavon-italic"
            aria-hidden="true"
            :title="`斜体 (ctrl+i)`"></button>
    <div :class="{'selected': s_header_dropdown_open}"
         :disabled="!editable"
         type="button"
         @mouseleave="$mouseleave_header_dropdown"
         @mouseenter="$mouseenter_header_dropdown"
         class="op-icon fa fa-mavon-header dropdown dropdown-wrapper"
         aria-hidden="true"
         :title="`标题 (ctrl+h)`">
      <transition name="fade">
        <div class="op-header popup-dropdown"
             :class="{'transition': transition}"
             v-show="s_header_dropdown_open"
             @mouseenter="$mouseenter_header_dropdown"
             @mouseleave="$mouseleave_header_dropdown">
          <div title="#"
               class="dropdown-item"
               @click.stop="$click_header('header1')"><span>一级标题</span></div>
          <div title="## "
               class="dropdown-item"
               @click.stop="$click_header('header2')"><span>二级标题</span></div>
          <div title="### "
               class="dropdown-item"
               @click.stop="$click_header('header3')"><span>三级标题</span></div>
          <div title="#### "
               class="dropdown-item"
               @click.stop="$click_header('header4')"><span>四级标题</span></div>
          <div title="##### "
               class="dropdown-item"
               @click.stop="$click_header('header5')"><span>五级标题</span></div>
          <div title="###### "
               class="dropdown-item"
               @click.stop="$click_header('header6')"><span>六级标题</span></div>
        </div>
      </transition>
    </div>
    <span class="op-icon-divider"></span>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('underline')"
            class="op-icon fa fa-mavon-underline"
            :title="`下划线 (ctrl+u)`"
            aria-hidden="true"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('strikethrough')"
            class="op-icon fa fa-mavon-strikethrough"
            :title="`中划线 (ctrl+shift+d)`"
            aria-hidden="true"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('mark')"
            class="op-icon fa fa-mavon-thumb-tack"
            :title="`标记 (ctrl+m)`"
            aria-hidden="true"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('superscript')"
            class="op-icon fa fa-mavon-superscript"
            aria-hidden="true"
            :title="`上角标 (ctrl+alt+s)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('subscript')"
            class="op-icon fa fa-mavon-subscript"
            aria-hidden="true"
            :title="`下角标 (ctrl+shift+s)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('alignleft')"
            class="op-icon fa fa-mavon-align-left"
            aria-hidden="true"
            :title="`居左 (ctrl+l)`">
    </button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('aligncenter')"
            class="op-icon fa fa-mavon-align-center"
            aria-hidden="true"
            :title="`居中 (ctrl+e)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('alignright')"
            class="op-icon fa fa-mavon-align-right"
            aria-hidden="true"
            :title="`居右 (ctrl+r)`"></button>
    <span class="op-icon-divider"></span>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('quote')"
            class="op-icon fa fa-mavon-quote-left"
            aria-hidden="true"
            :title="`段落引用 (ctrl+q)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('ol')"
            class="op-icon fa fa-mavon-list-ol"
            aria-hidden="true"
            :title="`有序列表 (ctrl+o)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('ul')"
            class="op-icon fa fa-mavon-list-ul"
            aria-hidden="true"
            :title="`无序列表 (ctrl+alt+u)`"></button>
    <span class="op-icon-divider"></span>
    <button :disabled="!editable"
            type="button"
            @click.stop="$toggle_imgLinkAdd('link')"
            class="op-icon fa fa-mavon-link"
            aria-hidden="true"
            :title="`链接 (ctrl+l)`"></button>
    <div :disabled="!editable"
         :class="{'selected': s_img_dropdown_open}"
         type="button"
         @mouseleave="$mouseleave_img_dropdown"
         @mouseenter="$mouseenter_img_dropdown"
         class="op-icon fa fa-mavon-picture-o dropdown dropdown-wrapper"
         aria-hidden="true">
      <transition name="fade">
        <div class="op-image popup-dropdown"
             :class="{'transition': transition}"
             v-show="s_img_dropdown_open"
             @mouseleave="$mouseleave_img_dropdown"
             @mouseenter="$mouseenter_img_dropdown">
          <div class="dropdown-item"
               @click.stop="$toggle_imgLinkAdd('imagelink')"><span>添加图片链接</span></div>
          <div class="dropdown-item"
               style="overflow: hidden">
            <input type="file"
                   accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                   @change="$imgAdd($event)"
                   multiple="multiple" />上传图片
          </div>
        </div>
      </transition>
    </div>

    <button :disabled="!editable"
            type="button"
            @click="$clicks('code')"
            class="op-icon fa fa-mavon-code"
            aria-hidden="true"
            :title="`代码块 (ctrl+alt+c)`"></button>
    <button :disabled="!editable"
            type="button"
            @click="$clicks('table')"
            class="op-icon fa fa-mavon-table"
            aria-hidden="true"
            :title="`表格 (ctrl+alt+t)`"></button>
    <span class="op-icon-divider"></span>
    <button type="button"
            @click="$clicks('trash')"
            class="op-icon fa fa-mavon-trash-o"
            aria-hidden="true"
            :title="`清空 (ctrl+breakspace)`"></button>

  </div>
</template>
<script >
export default {
  name: 's-md-toolbar-left',
  props: {
    editable: { // 是否开启编辑
      type: Boolean,
      default: true
    },
    transition: { // TODO: 是否开启动画过渡
      type: Boolean,
      default: true
    },
    image_filter: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      // [index, file]
      img_file: [[0, null]],
      img_timer: null,
      header_timer: null,
      s_img_dropdown_open: false,
      s_header_dropdown_open: false,
      s_img_link_open: false,
      trigger: null,
      num: 0,
      link_text: '',
      link_addr: '',
      link_type: 'link'
    }
  },
  methods: {
    $imgLinkAdd () {
      this.$emit('toolbar_left_addlink', this.link_type, this.link_text, this.link_addr);
      this.s_img_link_open = false;
    },
    $toggle_imgLinkAdd (type) {
      this.link_type = type;
      this.link_text = this.link_addr = '';
      this.s_img_link_open = true;
      this.$nextTick(() => {
        this.$refs.linkTextInput.focus()
      })
      this.s_img_dropdown_open = false;
    },
    $imgFileListClick (pos) {
      this.$emit('imgTouch', this.img_file[pos]);
    },
    $changeUrl (index, url) {
      this.img_file[index][0] = url;
    },
    $imgFileAdd ($file) {
      // this.img_file[0][0] = this.num;
      // this.img_file[0][1] = $file;
      // this.img_file.unshift([(this.num + 1), null]);
      // this.num = this.num + 1;
      this.img_file.push([++this.num, $file])
      this.$emit('imgAdd', this.num, $file);
      this.s_img_dropdown_open = false;
    },
    $imgFilesAdd ($files) {
      // valid means if the image_filter exist.
      let valid = (typeof this.image_filter === 'function');
      for (let i = 0; i < $files.length; i++) {
        if (valid && this.image_filter($files[i]) === true) {
          this.$imgFileAdd($files[i]);
        } else if (!valid && $files[i].type.match(/^image\//i)) {
          this.$imgFileAdd($files[i]);
        }
      }
    },
    $imgAdd ($e) {
      this.$imgFilesAdd($e.target.files);
      $e.target.value = ''; // 初始化
    },
    $imgDel (pos) {
      this.$emit('imgDel', this.img_file[pos]);
      this.img_file.splice(pos, 1);
      this.num--;
      this.s_img_dropdown_open = false;
    },
    isEqualName (filename, pos) {
      if (this.img_file[pos][1]) {
        if (this.img_file[pos][1].name == filename || this.img_file[pos][1]._name == filename) {
          return true
        }
      }
      return false
    },
    $imgDelByFilename (filename) {
      var pos = 0;
      while (this.img_file.length > pos) {
        if (this.img_file[pos][1] == filename || this.isEqualName(filename, pos)) {
          this.$imgDel(pos);
          return true;
        }
        pos += 1;
      }
      return false;
    },
    $imgAddByFilename (filename, $file) {
      for (var i = 0; i < this.img_file.length; i++) { if (this.img_file[i][0] == filename) return false; }
      this.img_file[0][0] = filename;
      this.img_file[0][1] = $file;
      this.img_file[0][2] = filename;
      this.img_file.unshift(['./' + (this.num), null])
      this.$emit('imgAdd', this.img_file[1][0], $file, false);
      return true;
    },
    $imgAddByUrl (filename, $url) {
      for (var i = 0; i < this.img_file.length; i++) { if (this.img_file[i][0] == filename) return false; }
      this.img_file[0][0] = filename;
      this.img_file[0][1] = $url;
      this.img_file.unshift(['./' + (this.num), null])
      return true;
    },
    $imgUpdateByFilename (filename, $file) {
      for (var i = 0; i < this.img_file.length; i++) {
        if (this.img_file[i][0] == filename || this.isEqualName(filename, i)) {
          this.img_file[i][1] = $file;
          this.$emit('imgAdd', filename, $file, false);
          return true;
        }
      }
      return false;
    },
    // 工具栏功能图标click-----------------
    $mouseenter_img_dropdown () {
      if (this.editable) {
        clearTimeout(this.img_timer)
        this.s_img_dropdown_open = true
      }
    },
    $mouseleave_img_dropdown () {
      let vm = this
      this.img_timer = setTimeout(function () {
        vm.s_img_dropdown_open = false
      }, 200)
    },
    $mouseenter_header_dropdown () {
      if (this.editable) {
        clearTimeout(this.header_timer)
        this.s_header_dropdown_open = true
      }
    },
    $mouseleave_header_dropdown () {
      let vm = this
      this.header_timer = setTimeout(function () {
        vm.s_header_dropdown_open = false
      }, 200)
    },
    $clicks (_type) {
      // 让父节点来绑定事件并
      if (this.editable) {
        this.$emit('toolbar_left_click', _type);
      }
    },
    $click_header (_type) {
      // 让父节点来绑定事件并
      this.$emit('toolbar_left_click', _type);
      this.s_header_dropdown_open = false
    },
    handleClose (e) {
      this.s_img_dropdown_open = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.v-left-item,
.v-right-item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-height: 40px;
  box-sizing: border-box;
}
.v-left-item .op-icon-divider,
.v-note-wrapper .v-note-op .v-right-item .op-icon-divider {
  height: 40px;
  border-left: 1px solid #e5e5e5;
  margin: 0 6px 0 4px;
}
.v-left-item .op-icon,
.v-right-item .op-icon {
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
}
.v-left-item .op-icon.dropdown-wrapper,
.v-right-item .op-icon.dropdown-wrapper {
  line-height: 18px;
}
.v-left-item .op-icon.selected,
.v-right-item .op-icon.selected {
  color: rgba(0, 0, 0, 0.8);
  background: #eaeaea;
}
.v-left-item .op-icon:hover,
.v-right-item .op-icon:hover {
  color: rgba(0, 0, 0, 0.8);
  background: #e9e9eb;
}
.v-left-item.transition .op-icon,
.v-right-item.transition .op-icon {
  -webkit-transition: all 0.2s linear 0s;
  transition: all 0.2s linear 0s;
}
.v-right-item {
  text-align: right;
  padding-right: 6px;
  max-width: 30%;
}
.v-left-item {
  text-align: left;
  padding-left: 6px;
}

@font-face {
  font-family: "fontello";
  src: url("../font/fontello.eot?60486047");
  src: url("../font/fontello.eot?60486047#iefix") format("embedded-opentype"),
    url("../font/fontello.woff?60486047") format("woff"),
    url("../font/fontello.ttf?60486047") format("truetype");
  font-weight: normal;
  font-style: normal;
}
/* Chrome hack: SVG is rendered more smooth in Windozze. 100% magic, uncomment if you need it. */
/* Note, that will break hinting! In other OS-es font will be not as sharp as it could be */
/*
@media screen and (-webkit-min-device-pixel-ratio:0) {
  @font-face {
    font-family: 'fontello';
    src: url('../font/fontello.svg?60486047#fontello') format('svg');
  }
}
*/

[class^="fa-mavon-"]:before,
[class*=" fa-mavon-"]:before {
  font-family: "fontello";
  font-style: normal;
  font-weight: normal;
  speak: none;

  display: inline-block;
  text-decoration: inherit;
  width: 1em;
  margin-right: 0.2em;
  text-align: center;
  /* opacity: .8; */

  /* For safety - reset parent styles, that can break glyph codes*/
  font-variant: normal;
  text-transform: none;

  /* fix buttons height, for twitter bootstrap */
  line-height: 1em;

  /* Animation center compensation - margins should be symmetric */
  /* remove if not needed */
  margin-left: 0.2em;

  /* you can be more comfortable with increased icons size */
  /* font-size: 120%; */

  /* Font smoothing. That was taken from TWBS */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Uncomment for 3D effect */
  /* text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3); */
}

.fa-mavon-bold:before {
  content: "\e800";
} /* '' */
.fa-mavon-italic:before {
  content: "\e801";
} /* '' */
.fa-mavon-thumb-tack:before {
  content: "\e802";
} /* '' */
.fa-mavon-link:before {
  content: "\e803";
} /* '' */
.fa-mavon-picture-o:before {
  content: "\e804";
} /* '' */
.fa-mavon-repeat:before {
  content: "\e805";
} /* '' */
.fa-mavon-undo:before {
  content: "\e806";
} /* '' */
.fa-mavon-trash-o:before {
  content: "\e807";
} /* '' */
.fa-mavon-floppy-o:before {
  content: "\e808";
} /* '' */
.fa-mavon-compress:before {
  content: "\e809";
} /* '' */
.fa-mavon-eye:before {
  content: "\e80a";
} /* '' */
.fa-mavon-eye-slash:before {
  content: "\e80b";
} /* '' */
.fa-mavon-question-circle:before {
  content: "\e80c";
} /* '' */
.fa-mavon-times:before {
  content: "\e80d";
} /* '' */
.fa-mavon-align-left:before {
  content: "\e80f";
} /* '' */
.fa-mavon-align-center:before {
  content: "\e810";
} /* '' */
.fa-mavon-align-right:before {
  content: "\e811";
} /* '' */
.fa-mavon-arrows-alt:before {
  content: "\f0b2";
} /* '' */
.fa-mavon-bars:before {
  content: "\f0c9";
} /* '' */
.fa-mavon-list-ul:before {
  content: "\f0ca";
} /* '' */
.fa-mavon-list-ol:before {
  content: "\f0cb";
} /* '' */
.fa-mavon-strikethrough:before {
  content: "\f0cc";
} /* '' */
.fa-mavon-underline:before {
  content: "\f0cd";
} /* '' */
.fa-mavon-table:before {
  content: "\f0ce";
} /* '' */
.fa-mavon-columns:before {
  content: "\f0db";
} /* '' */
.fa-mavon-quote-left:before {
  content: "\f10d";
} /* '' */
.fa-mavon-code:before {
  content: "\f121";
} /* '' */
.fa-mavon-superscript:before {
  content: "\f12b";
} /* '' */
.fa-mavon-subscript:before {
  content: "\f12c";
} /* '' */
.fa-mavon-header:before {
  content: "\f1dc";
} /* '' */
.fa-mavon-window-maximize:before {
  content: "\f2d0";
} /* '' */
</style>