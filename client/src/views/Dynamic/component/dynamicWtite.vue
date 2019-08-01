<template>
  <div class="dynamic-editor-dialog dynamic-editor">
    <div class="editor-body">
      <div class="content">
        <div class="editor-content editor">
          <div class="auth-card">
            <div contenteditable="true"
                 spellcheck="false"
                 placeholder="告诉你个小秘密，发沸点时添加话题会被更多小伙伴看见呦~"
                 class="rich-editor empty">
            </div>
          </div>
        </div>
        <span class="word-counter count">1000</span>
      </div>
    </div>
    <div class="editor-bottom">
      <div class="toolbar editor-toolbar">
        <div class="tool">
          <div class="emoji picker">
            <div class="emoji-box">
              <i class="el-icon-picture-outline-round"></i>
              <span>表情</span>
            </div>
          </div>
          <div class="file-picker picker active">
            <div class="emoji-box">
              <i class="el-icon-picture-outline"></i>
              <span>图片</span>
            </div>
          </div>
          <div class="link-picker picker">
            <div class="emoji-box">
              <i class="el-icon-link"></i>
              <span>链接</span>
            </div>
          </div>
          <div class="topic-picker picker">
            <div class="emoji-box">
              <i class="el-icon-collection-tag"></i>
              <span>话题</span>
            </div>
          </div>
        </div>
        <div class="submit">
          <div class="tip">Ctrl or ⌘ + Enter</div>
          <el-button>发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadImage } from '@components'
export default {
  name: 'dynamicWtite',
  components: {
    UploadImage
  }
}
</script>

<style scoped lang="scss">
.dynamic-editor {
  border-radius: 3px;
  position: relative;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  .editor-body {
    padding: 15px 20px 0;
    position: relative;
    border-radius: 2px;
    .content {
      position: relative;
      border-radius: 2px;
      border: 1px solid hsla(0, 0%, 59.2%, 0.2);
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
        padding: 8px 10px;
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
          span {
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
          line-height: 36px;
          font-size: 13px;
          user-select: none;
        }
        .publish {
          padding: 3px 5px;
        }
      }
    }
  }
}
</style>