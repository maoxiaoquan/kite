<template>
  <div id="dynamic-topic">
    <div class="container dynamic-main">
      <div class="dynamic-main-title">我的话题</div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-4"
             v-for="x in 5">
          <div class="topic-item">
            <router-link class="icon"
                         :to='{name:"dynamicTopicView",params:{dynamicTopicId:1}}'>
              <el-image class="avatar"
                        size="size"
                        src="circleUrl">
              </el-image>
            </router-link>
            <div class="content">
              <a title="能用图，就不要用字。">一图胜千言</a>
              <span>4582 关注 · 3367 沸点</span>
              <span class="subscribe">已关注</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container dynamic-main">
      <div class="dynamic-main-title">全部话题</div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-4"
             v-for="(item,key) in dynamic.dynamicTopicIndex"
             :key="key">
          <div class="topic-item">
            <router-link class="icon"
                         :to='{name:"dynamicTopicView",params:{dynamicTopicId:item.topic_id}}'>
              <el-image class="avatar"
                        size="size"
                        :src="item.icon">
              </el-image>
            </router-link>
            <div class="content">
              <a title="能用图，就不要用字。">{{item.name}}</a>
              <span>{{item.rss_count}} 关注 · 3367 沸点</span>
              <span class="subscribe">已关注</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'dynamicTopic',
  metaInfo () {
    return {
      title: `话题-${this.website.meta.website_name}`,
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("dynamic/GET_DYNAMIC_TOPIC_LIST"), // 重置文章列表数据
    ]);
  },
  computed: {
    ...mapState(["home", "dynamic", "website"]) // home:主页  article_column:文章的专栏
  },
}
</script>

<style scoped lang="scss">
#dynamic-topic {
  .dynamic-main {
    .dynamic-main-title {
      padding: 0 20px;
      text-align: left;
      font-size: 20px;
      color: #0e0e0e;
      font-weight: 600;
      margin: 20px 0;
    }
    .topic-item {
      display: flex;
      flex-grow: 0;
      padding: 18px 14px;
      align-items: flex-start;
      .icon {
        .avatar {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 150px;
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
      .content {
        color: #8a9aa9;
        width: 144px;
        max-width: 144px;
        letter-spacing: normal;
        text-align: left;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        a {
          font-weight: 600;
          color: #2e3135;
          font-size: 13px;
          justify-content: center;
        }
        span {
          padding-top: 0.5rem;
          font-size: 12px;
        }
      }
    }
  }
}
</style>