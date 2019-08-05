<template>
  <div class="dynamic-editor-dialog dynamic-editor">
    <div class="editor-body">
      <div class="content">
        <div class="rich-editor">
          <textarea v-model="content"
                    class="empty"
                    cols="20"
                    placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见呦~"
                    rows="10"></textarea>
        </div>
        <span class="word-counter count">1000</span>
      </div>
    </div>
    <div class="editor-bottom">
      <div class="toolbar editor-toolbar">
        <div class="tool">
          <div class="emoji picker">
            <el-popover placement="bottom-start"
                        width="500"
                        v-model="faceVisible">
              <comment-face @changeFace="changeFace"
                            v-if="faceVisible" />
              <div class="emoji-box"
                   slot="reference">
                <i class="el-icon-picture-outline-round"></i>
                <span class="tool-text">表情</span>
              </div>
            </el-popover>
          </div>

          <div class="file-picker picker active">
            <div class="emoji-box">
              <i class="el-icon-picture-outline"></i>
              <span class="tool-text">图片</span>
            </div>
          </div>
          <div class="link-picker picker">
            <div class="emoji-box">
              <i class="el-icon-link"></i>
              <span class="tool-text">链接</span>
            </div>
          </div>
          <div class="topic-picker picker">
            <div class="emoji-box">
              <i class="el-icon-collection-tag"></i>
              <span class="tool-text">话题</span>
            </div>
          </div>
        </div>
        <div class="submit">
          <div class="tip">Ctrl or ⌘ + Enter</div>
          <el-button size="mini"
                     type="primary"
                     @click="send"
                     class="send-dynamic">发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadImage } from '@components'
import commentFace from '../../Comment/ArticleComment/CommentFace'
export default {
  name: 'dynamicWtite',
  data () {
    return {
      content: '',
      faceVisible: false
    }
  },
  methods: {
    changeFace (val) { // 表情
      console.log(val)
      this.faceVisible = false
      this.content = this.content + val.face_text
    },
    send () { // 发送消息
      console.log(this.content)
    },
    createDynamic () { // 提交表单
      this.$store.dispatch('dynamic/CREATE_DYNAMIC')
    }
  },
  components: {
    UploadImage,
    commentFace
  }
}
</script>

<style scoped lang="scss">
.dynamic-editor {
  position: relative;
  .editor-body {
    padding: 15px 20px 0;
    position: relative;
    border-radius: 2px;
    .content {
      position: relative;
      border-radius: 16px;
      background-color: rgba(226, 230, 235, 0.2);
      .editor {
        position: relative;
        font-size: 14px;
        word-wrap: break-word;
      }
      .count {
        position: absolute;
        right: 10px;
        bottom: 5px;
        font-size: 13px;
        z-index: 1;
        user-select: none;
        pointer-events: none;
      }
      .rich-editor {
        position: relative;
        height: 100%;
        outline: none;
        border-radius: 2px;
        color: #17181a;
        min-height: 75px;
        font-size: 14px;
        padding: 3px 10px;
        .empty {
          background: transparent;
          border: none;
          height: 100px;
          resize: none;
          overflow: hidden;
        }
      }
    }
  }
  .editor-bottom {
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: -2px;
    .toolbar {
      display: flex;
      color: #007fff;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      .tool {
        display: flex;
        align-items: center;
        .picker {
          z-index: 1;
          margin-right: 16px;
          user-select: none;
          .tool-text {
            padding: 1px;
            font-size: 13px;
          }
        }
      }
      .submit {
        display: flex;
        .tip {
          color: #c2c2c2;
          text-align: center;
          width: 120px;
          font-size: 13px;
          user-select: none;
          display: inline-block;
          padding-top: 5px;
          vertical-align: top;
        }
        .publish {
          padding: 3px 5px;
        }
        .send-dynamic {
        }
      }
    }
  }
}
</style>