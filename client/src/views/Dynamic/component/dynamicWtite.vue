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
    <div class="insert-picture"
         v-show="isInsertPicture">
      <div class="img-item"
           v-for="(url,key) in coverImageArr"
           v-if="url"
           :key="key">
        <i @click="deleteCoverImage(url,key)"
           class="close el-icon-error"></i>
        <img :src="url"
             alt="">
      </div>
      <div class="add-picture">
        <upload-image @changeUpload="changeDynamicImage">
          <i class="el-icon-plus"></i>
        </upload-image>
      </div>
    </div>

    <div class="editor-bottom">
      <div class="toolbar editor-toolbar">
        <div class="tool">
          <div class="emoji picker">
            <el-popover placement="bottom-start"
                        width="500"
                        v-model="faceVisible">
              <face @changeFace="changeFace"
                    v-if="faceVisible" />
              <div class="emoji-box"
                   slot="reference">
                <i class="el-icon-picture-outline-round"></i>
                <span class="tool-text">表情</span>
              </div>
            </el-popover>
          </div>

          <div class="file-picker picker"
               :class="{'no-click':type===3}">
            <upload-image @changeUpload="changeDynamicImage"
                          v-show="type!==3">
              <div class="emoji-box">
                <i class="el-icon-picture-outline"></i>
                <span class="tool-text">图片</span>
              </div>
            </upload-image>
            <div class="emoji-box"
                 v-show="type===3">
              <i class="el-icon-picture-outline"></i>
              <span class="tool-text">图片</span>
            </div>
          </div>
          <div class="link-picker picker"
               :class="{'no-click':type===2}">
            <el-popover ref="popoverLink"
                        placement="bottom"
                        popper-class="link-view"
                        v-model="isLink">
              <input type="text"
                     class="link-input"
                     placeholder="请输入连接地址">
              <div style="text-align: right; margin: 0">
                <el-button size="mini"
                           type="text"
                           @click="isLink = false">取消</el-button>
                <el-button type="primary"
                           size="mini"
                           @click="isLink = false">确定</el-button>
              </div>
            </el-popover>
            <div class="emoji-box"
                 v-popover:popoverLink
                 v-show="Number(type)!==2">
              <i class="el-icon-link"></i>
              <span class="tool-text">链接</span>
            </div>
            <div class="emoji-box"
                 v-show="type===2">
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
import { UploadImage, Face } from '@components'
export default {
  name: 'dynamicWtite',
  data () {
    return {
      content: '',
      type: 1, // 1:默认动态;2:图片,3:连接，4：视频
      faceVisible: false,
      isInsertPicture: false, // 是否显示插入图片
      coverImage: '', // 封面图片
      isLink: false, // 是否显示link
      linkContent: '' // 连接内容
    }
  },
  watch: {
    coverImage (val) {
      if (val) {
        this.type = 2
        this.isInsertPicture = true
      } else {
        this.type = 1
        this.isInsertPicture = false
      }
    },
    linkContent (val) {
      if (val) {
        this.type = 3
      } else {
        this.type = 1
      }
    }
  },
  methods: {
    changeDynamicImage ({ formData, config }) { // 上传图片，并且组合
      this.$store.dispatch('dynamic/UPLOAD_DYNAMIC_PICTURE', formData)
        .then(result => {
          this.coverImage += result.data.img + ','
        })
    },
    deleteCoverImage (url, index) { // 删除已上传的图片
      let coverImageArr = this.coverImage.split(',') || []
      coverImageArr.splice(index, 1)
      let newCoverImageArr = coverImageArr.join(',')
      this.coverImage = newCoverImageArr
    },
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
  computed: {
    coverImageArr () { // 已上传的图片处理成数组
      let urlArr = this.coverImage.split(',') || []
      let length = this.coverImage.split(',').length
      return length > 0 ? urlArr : []
    }
  },
  components: {
    UploadImage,
    Face
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
  .insert-picture {
    padding: 15px 20px 0;
    .img-item,
    .add-picture {
      width: 80px;
      height: 80px;
      position: relative;
      border-radius: 16px;
      border: 1px dashed #c5c5c5;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: 0px;
    }
    .img-item {
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .close {
        position: absolute;
        top: 3px;
        right: 3px;
        cursor: pointer;
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #666;
      }
    }
    .add-picture {
      cursor: pointer;
      border: 1px dashed #c5c5c5;
      background: #f8f8f9;
      .UploadImage {
        width: 100%;
        height: 100%;
        .el-icon-plus {
          position: absolute;
          color: #666;
          font-size: 30px;
          top: 24px;
          left: 28px;
          font-size: 25px;
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
          cursor: pointer;
          .tool-text {
            padding: 1px;
            font-size: 13px;
          }
          &.no-click {
            cursor: no-drop;
            .tool-text,
            i {
              color: #999;
            }
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

.link-view {
  .link-input {
    width: 100%;
    background-color: #fafafb;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    outline: #027fff;
    color: #666;
    display: block;
    font-size: 12px;
    padding: 3px 10px;
    margin-bottom: 10px;
  }
}
</style>