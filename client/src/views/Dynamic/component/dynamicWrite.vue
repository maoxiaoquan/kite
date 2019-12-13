<template>
  <div class="dynamic-editor-dialog dynamic-editor">
    <div class="editor-body">
      <div class="content">
        <div class="rich-editor">
          <textarea v-model.trim="content"
                    ref="dynamicContent"
                    class="empty"
                    placeholder="发布的动态~" />
          <div class="current-topic"
               v-if="currentTopic.name">{{currentTopic.name}}</div>
        </div>
        <span class="word-counter count">{{content.length<600?(600-content.length):0}}</span>
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
        <img v-lazy="url"
             alt="">
      </div>
      <div class="add-picture"
           v-if="coverImageArr.length<7">
        <upload-image @changeUpload="changeDynamicImage">
          <i class="el-icon-plus"></i>
        </upload-image>
      </div>
    </div>

    <div class="insert-link"
         v-if="isInsertLink">
      <span class="insert-link-view"> <i class="close el-icon-error"
           @click="isInsertLink=false;linkContent=''"></i>{{linkContent}}</span>
    </div>

    <div class="editor-bottom">
      <div class="toolbar editor-toolbar">
        <div class="tool">
          <div class="emoji picker">
            
            <Popover :visible.sync="faceVisible">
              <face @changeFace="changeFace"
                      v-if="faceVisible" />
                <div class="emoji-box"
                    slot="button">
                  <i class="el-icon-picture-outline-round"></i>
                  <span class="tool-text">表情</span>
                </div>
            </Popover>

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
              
            <Popover :visible.sync="isLinkPopover" class="link-view">
                <input type="text"
                      v-model="linkContent"
                      class="link-input"
                      placeholder="请输入连接地址">
                <div style="text-align: right; margin: 0">
                  <button class="btn btn-default btn-sm" 
                            @click="onLink('delete')">取消</button>
                  <button class="btn btn-primary btn-sm"  
                            @click="onLink('enter')">确定</button>
                </div>
                <template>
                  <div class="emoji-box"
                    slot="button"
                    v-show="Number(type)!==2">
                    <i class="el-icon-link"></i>
                    <span class="tool-text">链接</span>
                  </div>
                  <div class="emoji-box"
                      slot="no-button"
                      v-show="type===2">
                    <i class="el-icon-link"></i>
                    <span class="tool-text">链接</span>
                  </div>
                </template>
            </Popover>

          </div>
          <div class="topic-picker picker" :class="{'no-click':afferentTopic}">

            <Popover :visible.sync="isTopicPopover">
                <div class="topic-view">
                  <input type="text"
                        v-model="searchTopicVal"
                        class="search-input"
                        placeholder="请输入连接地址">
                  <ul class="topic-list">
                    <li @click="onTopic">
                      <div class="topic-item no-topic">
                        <div class="icon">
                          <i class="el-icon-remove-outline"></i>
                        </div>
                        <div class="content">
                          <span>不添加任何话题</span>
                        </div>
                      </div>
                    </li>
                    <li v-for="(item,key) in searchTopicResultList"
                        @click="onTopic(item)"
                        :key="key">
                      <div class="topic-item">
                        <div class="lazy loaded immediate">
                          <img class="icon"
                              v-lazy="item.icon"
                              alt="">
                        </div>
                        <div class="content">
                          <span>{{item.name}}</span>
                          <!-- <span>{{item.thumb_count}} 关注 · 0 片刻</span> -->
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <template>
                  <div class="emoji-box"
                      slot="button"
                      v-if="!afferentTopic">
                    <i class="el-icon">#</i>
                    <span class="tool-text">话题</span>
                  </div>
                  <div class="emoji-box"
                      slot="no-button"
                      v-else>
                    <i class="el-icon">#</i>
                    <span class="tool-text">话题</span>
                  </div>
                </template>
            </Popover>
          </div>
        </div>
        <div class="submit">
          <button @click="send"
                     class="btn send-dynamic">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadImage, Face, Popover } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'dynamicWrite',
  data () {
    return {
      content: '',
      type: 1, // 1:默认动态;2:图片,3:连接，4：视频
      faceVisible: false,
      isInsertPicture: false, // 是否显示插入图片
      isInsertLink: false, // 是否显示插入连接
      coverImage: '', // 封面图片
      isLinkPopover: false, // 是否显示link弹窗
      isTopicPopover: false, // 是否显示topic弹窗
      linkContent: '', // 连接内容
      searchTopicVal: "", // 
      searchTopicResultList: [], //搜索结果展示
      currentTopic: {} // 当前使用专题
    }
  },
  props: {
    afferentTopic: {
      default: ''
    }
  },
  created () {
    this.$store.dispatch("dynamic/GET_DYNAMIC_TOPIC_LIST").then(result => {
      this.searchTopicResultList = result.data.list
      let topic_id = this.$route.params.dynamicTopicId
      if (topic_id) {
        this.initTopic(topic_id)
      }
    })
  },
  watch: {
    coverImage (val) { // 判断当前是否是在传封面图
      if (val) {
        this.type = 2
        this.isInsertPicture = true
      } else {
        this.type = 1
        this.isInsertPicture = false
      }
    },
    linkContent (val) { // 判断当前是否是在写连接
      if (val) {
        this.type = 3
      } else {
        this.isInsertLink = false
        this.type = 1
      }
    },
    searchTopicVal (val) {
      let arr = [];
      for (let item in this.dynamic.dynamicTopicList) {
        if (
          this.dynamic.dynamicTopicList[item].name
            .toLowerCase()
            .indexOf(this.searchTopicVal.toLowerCase()) >= 0
        ) {
          arr.push(this.dynamic.dynamicTopicList[item]);
        }
      }
      this.searchTopicResultList = arr;
    },
    //watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
    content: {//watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
      handler () {
        var _sum = 600; //字体限制为100个
        this.$refs.dynamicContent.setAttribute("maxlength", _sum);
        this.number = _sum - this.$refs.dynamicContent.value.length;
      },
      deep: true
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
      this.faceVisible = false
      this.content = this.content + val.face_text
    },
    trim (string) {
      return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
    },
    initTopic (val) { // 初始化当前专题
      this.dynamic.dynamicTopicList.map((item) => {
        if (item.topic_id === val) {
          this.currentTopic = item
        }
      })
    },
    onTopic (val) { // 选择专题
      this.currentTopic = val
      this.isTopicPopover = false
    },
    onLink (val) { // 插入连接
      this.isLinkPopover = false
      if (val === 'delete') {
        this.linkContent = ''
        this.isInsertLink = false
      } else {
        this.isInsertLink = true
      }
    },
    send () { // 发送消息
      if (!this.personalInfo.islogin) {
        this.$message.warning("当前用户未登陆，请前往首页登陆后尝试");
        return false
      }
      if (!this.content) {
        this.$message.warning("当前内容为空，请输入内容后再发送");
        return false
      }
      this.createDynamic()
    },
    createDynamic () { // 提交表单
      let attach = ''
      if (this.type === 2) {
        attach = this.coverImage
      } else if (this.type === 3) {
        attach = this.linkContent
      }
      let params = {
        content: this.trim(this.content) /* 主内容 */,
        attach, // 摘要
        type: this.type, // 类型 （1:默认动态;2:图片,3:连接，4：视频  ）
        topic_ids: this.currentTopic.topic_id
      }
      this.$store.dispatch('dynamic/CREATE_DYNAMIC', params).then(result => {
        if (result.state === 'success') {
          this.$message.success("动态创建成功");
          this.content = ''
          this.coverImage = ''
          this.currentTopic = ''
          this.linkContent = ''
          this.$emit('changeDynamicWrite')
        } else {
          this.$message.error(result.message);
        }
      })
    },
    shareOtherWeb () { // 分享到其他网站

    },
  },
  computed: {
    ...mapState(['personalInfo', 'dynamic']),
    coverImageArr () { // 已上传的图片处理成数组
      let urlArr = this.coverImage.split(',') || []
      let length = this.coverImage.split(',').length
      return length > 0 ? urlArr : []
    }
  },
  components: {
    UploadImage,
    Face,
    Popover
  }
}
</script>

<style scoped lang="scss">
.dynamic-editor {
  position: relative;
  box-shadow: 0 0.75rem 1.5rem rgba(18, 38, 63, 0.03);
  .editor-body {
    padding: 20px 20px 0;
    position: relative;
    border-radius: 2px;
    .content {
      position: relative;
      border-radius: 3px;
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
        .empty {
          background: transparent;
          border: none;
          height: 75px;
          resize: none;
          font-size: 14px;
          overflow: hidden;
        }
        .current-topic {
          font-size: 13px;
          display: inline-block;
          line-height: 22px;
          height: 22px;
          padding: 0 12px;
          border: 1px solid #007fff;
          border-radius: 14px;
          text-align: center;
          color: #007fff;
          user-select: none;
        }
      }
    }
  }
  .insert-link {
    padding: 15px 20px 0;
    .insert-link-view {
      position: relative;
      border: 1px dashed #c5c5c5;
      padding: 0 12px;
      border-radius: 10px;
      display: block;
      height: 30px;
      padding-right: 20px;
      line-height: 30px;
      .close {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #999;
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
          border-radius: 3px;
          background: #ec7259;
          padding: 3px 13px;
          font-size: 14px;
          border-color: #ec7259;
          color: #333;
        }
      }
    }
  }
}

.link-view {
  .link-input {
    width: 180px;
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
.topic-view {
  .search-input {
    display: inline-block;
    height: 30px;
    width: 100%;
    font-size: 12px;
    color: #666;
    border: 0.5px solid #e5e5e5;
    padding: 10px 12px;
    outline: none;
    background-color: #fafafb;
  }
  .topic-list {
    height: 250px;
    overflow: auto;
    margin-top: 10px;
    padding: 0;
    li {
      &:hover {
        background: #f3f3f3;
      }
    }
    .topic-item {
      border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
      display: flex;
      flex-grow: 0;
      margin: 0;
      align-items: flex-start;
      cursor: pointer;
      padding: 10px 0;
      .loaded {
        height: 42px;
        .icon {
          width: 42px;
          height: 42px;
          border-radius: 4px;
        }
      }
      &.no-topic {
        .icon {
          width: 42px;
          height: 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          background-color: #eef2f5;
          i {
            font-size: 20px;
            color: #999;
          }
        }
        .content {
          line-height: 42px;
        }
      }
      .content {
        color: #8a9aa9;
        width: 144px;
        max-width: 144px;
        letter-spacing: normal;
        text-align: left;
        margin-left: 14px;
        display: flex;
        flex-direction: column;
        span:first-child {
          color: #2e3135;
          font-size: 14px;
        }
        span {
          padding-top: 1px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>