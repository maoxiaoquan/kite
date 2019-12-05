<template>
  <aside class="dynamic-aside">
    <div class="profile-box client-card"
         v-if="personalInfo.islogin">
      <div class="profile">
        <a href="javascript:;">
          <img v-lazy="user.user.avatar"
               class="avatar"
               alt="">
        </a>
        <div class="user-info">
          <a class="username ellipsis">{{user.user.nickname}}</a>
          <div class="position ellipsis">{{user.user.nickname}}</div>
        </div>
      </div>
      <ul class="stat-list">
        <a class="item">
          <div class="title">片刻</div>
          <div class="count">{{user.dynamicCount}}</div>
        </a><a class="item">
          <div class="title">关注</div>
          <div class="count">{{user.userAttentionCount}}</div>
        </a><a class="item">
          <div class="title">关注者</div>
          <div class="count">{{user.otherUserAttentionCount}}</div>
        </a>
      </ul>
    </div>

    <div class="related-dynamic-block dynamic-block client-card">
      <header class="title">推荐片刻</header>
      <ul class="dynamic-list">
        <li class="item"
            v-for="(item,key) in dynamic.recommendDynamicList"
            :key="key">
          <router-link class="dynamic"
                       :to='{name:"dynamicView",params:{dynamicId:item.id}}'>
            <div class="content-box">
              <div class="content"
                   v-html="contentRender(item.content)"></div>
              <div class="stat item"><span>{{item.thumb_count}} 赞 · </span><span>{{item.comment_count}} 评论</span></div>
            </div>

          </router-link>
        </li>
      </ul>
    </div>

    <div class="topic-sidebar shadow topics client-card"
         v-if="personalInfo.islogin">
      <div class="title"><span>关注的话题</span>
        <router-link :to="{name:'dynamicTopic'}">
          <span>全部</span>
        </router-link>
      </div>
      <div class="content">
        <ul class="topic-list topic_list">
          <li v-for="(item,key) in dynamic.dynamicTopicList"
              v-if="isRssDynamicTopic(item)"
              :key="key">
            <router-link class="topic-item"
                         :to='{name:"dynamicTopicView",params:{dynamicTopicId:item.topic_id}}'>
              <img v-lazy="item.icon"
                   class="lazy icon loaded immediate"
                   alt="">
              <div class="content"><span>{{item.name}}</span><span>{{item.rss_count}} 关注 · {{item.dynamicCount}} 片刻</span>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

  </aside>
</template>

<script>
import { mapState } from "vuex";
import { faceQQ } from '@components'
export default {
  name: 'dynamicAside',
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([

    ]);
  },
  created () {
    this.$store.dispatch("dynamic/GET_RECOMMEND_DYNAMIC_LIST")
  },
  mounted () {
    if (this.personalInfo.islogin) {
      this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.uid })
    }
  },
  methods: {
    contentRender (val) {
      let content = val;
      faceQQ.map(faceItem => {
        content = content.replace(
          new RegExp("\\" + faceItem.face_text, "g"),
          faceItem.face_view
        );
      });
      return content;
    },
    isRssDynamicTopic (item) {
      return ~this.user.allRssDynamicTopicId.indexOf(item.topic_id)
    },
  },
  computed: {
    ...mapState(["personalInfo", "dynamic", "website", "user"]), // home:主页  article_column:文章的专栏
  }
}
</script>

<style scope lang="scss">
.profile-box {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 10px;
  font-size: 13px;
  .profile {
    display: flex;
    padding: 16px;
    height: 248px;
    max-height: 92px;
    border-bottom: 1px solid rgba(92, 96, 102, 0.1);
    .avatar {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #fff;
    }
    .user-info {
      position: relative;
      margin: 12px 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .username {
        color: #17181a;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.2;
      }
      .position {
        color: #8f969c;
      }
    }
  }
  .stat-list {
    flex: 1 1 auto;
    display: flex;
    margin: 0;
    list-style: none;
    text-align: center;
    padding: 16.5px 0;
    .item {
      flex: 1 1 33.333%;
      max-height: 83px;
      line-height: 1;
      .title {
        font-size: 13px;
        padding-bottom: 5px;
      }
      .count {
        font-size: 13px;
      }
    }
    .item:not(:last-child) {
      border-right: 1px solid rgba(92, 96, 102, 0.1);
    }
  }
}

.shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.related-dynamic-block {
  overflow: hidden;
  padding: 22px;
  margin-bottom: 10px;
  .title {
    font-size: 16px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 700;
    margin-bottom: 16px;
    position: relative;
    padding-left: 12px;
    &:before {
      content: "";
      width: 4px;
      height: 20px;
      position: absolute;
      top: 4px;
      left: 0;
      border-radius: 2px;
      background: #ec7259;
    }
  }
  .dynamic-list {
    .item {
      padding: 8px 0;
    }
    .item:not(:last-child) {
      border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
    }
    .dynamic {
      display: flex;
      justify-content: space-between;
    }
    .content-box {
      display: flex;
      align-content: space-between;
      flex-direction: column;
      .content {
        color: #2e3135;
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
    .stat {
      color: #76797e;
      font-size: 12px;
      margin-top: auto;
    }
  }
}

.topic-sidebar {
  padding: 22px;
  overflow: hidden;
  .title {
    font-size: 16px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 700;
    margin-bottom: 16px;
    position: relative;
    padding-left: 12px;
    &:before {
      content: "";
      width: 4px;
      height: 20px;
      position: absolute;
      top: 4px;
      left: 0;
      border-radius: 2px;
      background: #ec7259;
    }
    a {
      color: #007fff;
      font-size: 13px;
      float: right;
    }
  }
  .topic-list {
    .topic-item {
      display: flex;
      flex-grow: 0;
      margin: 0;
      align-items: flex-start;
      cursor: pointer;
      padding: 10px 0;
      .icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background-size: cover;
        background-repeat: no-repeat;
      }
      .content-box {
        color: #8a9aa9;
        width: 144px;
        max-width: 144px;
        letter-spacing: normal;
        text-align: left;
        margin-left: 14px;
        display: flex;
        flex-direction: column;
        span {
          padding-top: 2px;
          font-size: 13px;
        }
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
      span {
        padding-top: 2px;
        font-size: 13px;
      }
      span:first-child {
        color: #2e3135;
        font-size: 13px;
      }
    }
  }
}
</style>
