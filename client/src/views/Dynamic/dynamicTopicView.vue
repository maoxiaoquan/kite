<template>
  <div id="dynamic-topic-view">
    <div class="container dynamic-container">
      <div class="row dynamic-main">
        <div class="col-xs-12 col-sm-8 col-md-8 left">
          <div class="stream-wrapper">
            <div class="edit-view client-card"
                 v-if="personalInfo.islogin">
              <dynamic-write @changeDynamicWrite="dynamicSubmit"
                             v-if="personalInfo.islogin"
                             :afferentTopic="afferentTopic" />
            </div>

            <div class="sort client-card">
              <router-link :to='{name:"dynamicTopicView",params:{dynamicTopicId:afferentTopic}}'
                           class="topic-title">推荐</router-link>
              <router-link :to='{name:"dynamicTopicView",params:{dynamicTopicId:afferentTopic},query:{sort:"new"}}'
                           class="topic-title">最新</router-link>
            </div>

            <div class="dy-view">
              <scroll-loading @scroll-loading="infiniteHandler"
                              :isLoading="isLoading"
                              :isMore="isMore">
                <div class="dy-item client-card"
                     v-for="(dynamicItem,key) in list"
                     :key="key">
                  <dynamic-item :dynamicItem="dynamicItem" />
                </div>
              </scroll-loading>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <aside class="topic-side topic-side sidebar client-card">
            <div class="topic-box">
              <div class="wallpaper">
                <span :style="`background-image: url(${topicInfo.icon});`"></span>
              </div>
              <div class="content">
                <img v-lazy="topicInfo.icon"
                     class="icon"
                     alt="">
                <div class="title">{{topicInfo.name}}</div>

                <span class="followed"
                      v-if="personalInfo.islogin"
                      :class="{'active':isRssDynamicTopic}"
                      @click="subscribeDynamicTopic">{{isRssDynamicTopic?'已关注':'+ 关注'}}</span>

                <div class="describe">
                  <div class="desc-title">话题介绍:</div><span>{{topicInfo.description}}</span>
                  <div class="limit-ctl-box"></div>
                </div>
              </div>
              <div class="stat-box">
                <li class="item">
                  <div class="count">{{topicInfo.dynamic_count}}</div>
                  <div class="title">片刻</div>
                </li>
                <li class="item">
                  <div class="count">{{topicInfo.attention_count}}</div>
                  <div class="title">关注</div>
                </li>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dynamicItem from './component/dynamicItem'
import dynamicWrite from './component/dynamicWrite'
import dynamicAside from './component/dynamicAside'
import { mapState } from 'vuex'
import { ScrollLoading } from "@components";
import { baidu, google } from '@utils'
import googleMixin from '@mixins/google'
import {
  modelType
} from '@utils/constant'

export default {
  name: 'dynamic',
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: this.topicInfo.name + '-话题-' + this.website.meta.website_name || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.topicInfo.name}-${this.topicInfo.description || ""}`
        }
      ],
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
    };
  },
  data () {
    return {
      afferentTopic: "",
      topicInfo: {},
      page: 1,
      isLoading: false,
      isMore: true,
      list: []
    }
  },
  created () {
    this.afferentTopic = this.$route.params.dynamicTopicId
  },
  watch: {
    $route (to, from) {
      this.page = 1
      this.isLoading = false
      this.isMore = true
      this.list = []
      this.infiniteHandler()
      this.getDynamicTopicInfo()
    }
  },
  mounted () {
    this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.uid })
    this.getDynamicTopicInfo()
  },
  methods: {
    infiniteHandler () {
      this.isLoading = true;
      let _list = this.list
      this.$store
        .dispatch("dynamic/GET_DYNAMIC_LIST", {
          topic_id: this.$route.params.dynamicTopicId,
          page: this.page,
          isCommit: false,
          sort: this.$route.query.sort || ''
        })
        .then(result => {
          this.isLoading = false;
          this.list = [..._list, ...result.data.list]
          if (result.data.list.length === 10) {
            this.page += 1;
          } else {
            this.isMore = false;
          }
        })
        .catch(err => {
          this.isMore = false;
        });
    },
    dynamicSubmit () {
      if (this.$route.query.sort !== 'new') {
        this.$router.push({ name: "dynamicTopicView", params: { dynamicTopicId: this.afferentTopic }, query: { sort: "new" } })
      } else {
        window.location.reload()
      }
    },
    getDynamicTopicInfo () {
      this.$store.dispatch("dynamic/GET_DYNAMIC_TOPIC_INFO", { topic_id: this.$route.params.dynamicTopicId || '' }).then(result => {
        this.topicInfo = result.data.info || {}
      })
    },
    async subscribeDynamicTopic () { // 订阅动态话题
      await this.$store.dispatch('common/SET_ATTENTION', { associate_id: this.topicInfo.id, type: modelType.dynamic_topic })
        .then(res => {
          // this.$store.dispatch('articleTag/MY_SUBSCRIBE_TAG_LIST')
          if (res.state === 'success') {
            if (res.data.type === 'enter') {
              this.topicInfo.attention_count = Number(this.topicInfo.attention_count) + 1
            } else {
              this.topicInfo.attention_count -= 1
            }
            this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.uid })
            this.$message.success(res.message);
          }
        })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'dynamic', 'user', 'website']),
    isRssDynamicTopic () {
      if (this.personalInfo.islogin) {
        return ~this.user.allRssDynamicTopicId.indexOf(this.topicInfo.id)
      } else {
        return false
      }
    },
  },
  components: {
    dynamicItem,
    dynamicWrite,
    dynamicAside,
    ScrollLoading
  }
}
</script>

<style scoped lang="scss">
#dynamic-topic-view {
  margin-bottom: 15px;
  .dynamic-main {
    .stream-wrapper {
      .edit-view {
        border-bottom: 1px solid rgba(92, 96, 102, 0.1);
      }
      .sort {
        border-bottom: 1px solid rgba(92, 96, 102, 0.1);
        display: flex;
        flex-direction: row;
        a {
          flex: 1;
          text-align: center;
          padding: 12px 0;
          font-size: 13px;
          &.exact-active {
            color: #37c701;
          }
        }
      }
    }
  }
  .topic-side {
    border-radius: 6px;
    overflow: hidden;
    .topic-box {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      margin-bottom: 8px;
      .wallpaper {
        position: relative;
        height: 109px;
        overflow: hidden;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
          background-position: 50%;
          background-size: 120%;
          background-repeat: no-repeat;
          filter: blur(6.3px);
          transform: scale(1.1);
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        .icon {
          filter: none;
          position: absolute;
          top: -32px;
          left: 50%;
          width: 64px;
          height: 64px;
          border-radius: 5px;
          margin-left: -32px;
          border: 2px solid hsla(0, 0%, 100%, 0.6);
          z-index: 1;
          box-sizing: content-box;
        }
        .title {
          font-size: 15px;
          margin-top: 41px;
          text-align: center;
          font-weight: 600;
          color: #17181a;
        }
        .followed {
          padding: 0;
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: #fff;
          border-radius: 15px;
          color: #333;
          border: 1px solid #666;
          font-size: 14px;
          margin: 10px 0 8px;
          background: #f3f3f3;
          cursor: pointer;
          &.active {
            background: #37c701;
            border: 1px solid #37c701;
            color: #fff;
          }
        }
        .describe {
          font-size: 13px;
          color: #1a1b1d;
          width: 100%;
          margin-bottom: 12px;
          .desc-title {
            color: #17181a;
            font-weight: 600;
            font-size: 14px;
            padding: 0 16px;
          }
          span {
            padding: 0 16px;
            white-space: pre-line;
            display: inline-block;
          }
        }
      }
      .stat-box {
        flex: 1 1 auto;
        display: flex;
        margin: 0;
        list-style: none;
        text-align: center;
        padding: 12px 0;
        border-top: 1px solid rgba(92, 96, 102, 0.1);
        user-select: none;
        .item {
          flex: 1 1 auto;
          max-height: 40px;
          .count {
            font-size: 14px;
          }
          .title {
            font-size: 14px;
          }
        }
        .item:not(:last-child) {
          border-right: 1px solid rgba(92, 96, 102, 0.1);
        }
      }
    }
  }
}
</style>