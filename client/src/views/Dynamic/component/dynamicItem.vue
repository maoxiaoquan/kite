<template>
  <div class="dynamic-item">
    <div class="dynamic-header-row">
      <div class="account-group">
        <div class="user-popover-box">
          <a href="/user/57ac00985bbb500062b20476"
             target="_blank"
             class="user-link">
            <el-image class="avatar"
                      size="size"
                      :src="dynamicItem.user.avatar">
            </el-image>
          </a>
        </div>
        <div class="dynamic-header-content">
          <div class="user-popover-box">
            <router-link :to="{name:'user',params:{uid:dynamicItem.user.uid}}"
                         class="username">{{dynamicItem.user.nickname}}</router-link>
          </div>
          <div class="meta-box">
            <div class="position ellipsis">@ {{dynamicItem.user.introduction}}</div>
            <div class="dot">·</div>
            <a href="/dynamic/5d428a996fb9a07d87241e2c"
               target="_blank"
               rel=""
               class="time-box">
              <time datetime="2019-08-01T06:45:45.474Z"
                    title="Thu Aug 01 2019 14:45:45 GMT+0800 (中国标准时间)"
                    class="time">{{dynamicItem.create_at}}</time>
            </a>
          </div>
        </div>
      </div>

      <div class="header-action">
        <button class="subscribe-btn follow-button">关注</button>
      </div>
    </div>
    <div class="dynamic-content-row">
      <div class="content-box content-box">
        <div v-html="dynamicItem.content"></div>
        <div class="limit-ctl-box"></div>
      </div>
    </div>
    <div class="dynamic-image-row"
         v-if="dynamicItem.type===2">
      <el-image class="preview-picture"
                style="width: 100px; height: 100px"
                :src="url"
                v-for="(url,key) in imgAnalyze(dynamicItem.attach)"
                :key="key"
                v-if="url"
                :preview-src-list="imgAnalyze(dynamicItem.attach)">
      </el-image>
    </div>
    <div class="dynamic-link-row"
         v-if="dynamicItem.type===3">
      <a :href="dynamicItem.attach"
         target="_block">{{dynamicItem.attach}}</a>
    </div>
    <div class="dynamic-topic-row"
         v-if="dynamicItem.topic">
      <router-link :to='{name:"dynamicTopicView",params:{dynamicTopicId:dynamicItem.topic.topic_id}}'
                   class="topic-title">{{dynamicItem.topic.name}}</router-link>
    </div>
    <div class="dynamic-action-row">
      <div class="action-box action-box">
        <div class="like-action action">
          <i class="el-icon-thumb"></i>
          <span class="action-title">{{dynamicItem.like_count}}</span>
        </div>
        <div class="comment-action action">
          <i class="el-icon-chat-line-round"></i>
          <span class="action-title">{{dynamicItem.comment_count}}</span>
        </div>
        <div class="share-action action">
          <i class="el-icon-share"></i>
          <span class="action-title">分享</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "dynamicItem",
  props: {
    dynamicItem: {
      default: {}
    }
  },
  methods: {
    imgAnalyze (attach) {
      let urlArr = attach.split(',') || []
      let length = attach.split(',').length
      return length > 0 ? urlArr : []
    }
  }
}
</script>

<style scoped lang="scss">
.dynamic-item {
  .dynamic-content-row,
  .dynamic-image-row,
  .dynamic-link-row,
  .dynamic-topic-row {
    position: relative;
    margin: 5px 48px 5px 80px;
  }
  .account-group,
  .header-action {
    display: flex;
  }
  .dynamic-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 2rem 0 20px;
    .account-group {
      align-items: center;
    }
    .avatar {
      display: inline-block;
      position: relative;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #eee;
    }
    .avatar {
      flex: 0 0 auto;
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
    .dynamic-header-content {
      margin-left: 12px;
    }
    .username {
      font-size: 12px;
      font-weight: 600;
      color: #2e3135;
    }
    .meta-box {
      display: flex;
      align-items: center;
      margin: 3px 0 0;
      font-size: 13px;
      color: #8a9aa9;
      cursor: default;
    }
    .follow-button {
      margin: 0 0 0 auto;
      padding: 0;
      width: 55px;
      height: 26px;
      font-size: 13px;
      border-color: #6cbd45;
      color: #6cbd45;
      border: 1px solid #37c700;
      background-color: #fff;
    }
  }
  .dynamic-content-row {
    margin-top: 5px;
    margin-bottom: 5px;
    .content-box {
      font-size: 15px;
      line-height: 20px;
      white-space: pre-line;
      color: #17181a;
      .emoji {
        width: 19px;
        height: 19px;
        vertical-align: sub;
      }
    }
  }
  .dynamic-link-row {
    a {
      display: flex;
      align-items: center;
      padding: 9px 15px;
      max-width: 100%;
      background-color: #fff;
      border: 1px solid #ebebeb;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
  .dynamic-image-row {
    .preview-picture {
      width: 100px;
      height: 100px;
      overflow: hidden;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
  .dynamic-topic-row {
    .topic-title {
      font-size: 13px;
      display: inline-block;
      line-height: 22px;
      padding: 0 12px;
      border: 1px solid #007fff;
      border-radius: 14px;
      color: #007fff;
      user-select: none;
    }
  }
  .dynamic-action-row {
    .action-box {
      display: flex;
      position: relative;
      margin-top: 15px;
      height: 34px;
    }
    .action {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      cursor: pointer;
      user-select: none;
      i {
        color: #8a93a0;
      }
      .action-title {
        margin-left: 5px;
        font-size: 13px;
        font-weight: 500;
        color: #8a93a0;
      }
    }
  }
}
</style>
