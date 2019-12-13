<template>
  <div id="dynamic-topic">
    <div class="container dynamic-main"
         v-if="personalInfo.islogin">
      <div class="dynamic-main-title">我的话题</div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-4"
             v-for="(item,key) in dynamic.dynamicTopicList"
             v-if="isRssDynamicTopic(item)"
             :key="key">
          <div class="client-card">
            <dynamic-topic-item :dynamicTopicItem="item" />
          </div>
        </div>
      </div>
    </div>
    <div class="container dynamic-main">
      <div class="dynamic-main-title">全部话题</div>
      <div class="row">
        <div class="col-xs-12 col-sm-4 col-md-4"
             v-for="(item,key) in dynamic.dynamicTopicList"
             :key="key">
          <div class="client-card">
            <dynamic-topic-item :dynamicTopicItem="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import dynamicTopicItem from './component/dynamicTopicItem'
import { baidu, google } from '@utils'
import googleMixin from '@mixins/google'

export default {
  name: 'dynamicTopic',
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: `话题-${this.website.meta.website_name}`,
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("dynamic/GET_DYNAMIC_TOPIC_LIST"), // 获取所有动态专题列表
    ]);
  },
  mounted () {
    this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.uid })
  },
  methods: {
    isRssDynamicTopic (item) {
      return ~this.user.allRssDynamicTopicId.indexOf(item.topic_id)
    },
  },
  components: {
    dynamicTopicItem
  },
  computed: {
    ...mapState(["home", "dynamic", "website", "personalInfo", "user"]), // home:主页  article_column:文章的专栏
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