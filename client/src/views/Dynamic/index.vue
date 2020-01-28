<template>
  <div id="dynamic">
    <div class="container dynamic-container">
      <div class="aside">
        <nav role="navigation"
             class="dock-nav">
          <ul class="nav-list">
            <li class="nav-item acitve">
              <router-link :to="{ name: 'dynamics', params: { dynamicTopicId: 'newest' } }"
                           class="nav-link">推荐</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'dynamics', params: { dynamicTopicId: 'hot' } }"
                           class="nav-link">热门</router-link>
            </li>
            <li class="nav-item"
                v-if="personalInfo.islogin">
              <router-link :to="{
                  name: 'dynamics',
                  params: { dynamicTopicId: 'following' }
                }"
                           class="nav-link">我的</router-link>
            </li>
          </ul>
          <ul class="nav-list">
            <li class="nav-item"
                v-for="(item, key) in dynamic.dynamicTopicIndex"
                :key="key">
              <router-link :to="{
                  name: 'dynamics',
                  params: { dynamicTopicId: item.topic_id }
                }"
                           class="nav-link">{{ item.name }}</router-link>
            </li>
            <li class="nav-item more">
              <router-link :to="{ name: 'dynamicTopic' }"
                           class="more-view">
                <span>更多</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="row dynamic-main">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="stream-wrapper client-card"
               v-if="personalInfo.islogin">
            <dynamic-write @changeDynamicWrite="dynamicSubmit" />
          </div>

          <scroll-loading @scroll-loading="infiniteHandler"
                          :isLoading="isLoading"
                          :isMore="isMore">
            <div class="dy-item client-card"
                 v-for="(dynamicItem, key) in dynamic.dynamicList.list"
                 :key="key">
              <dynamic-item :dynamicItem="dynamicItem" />
            </div>
          </scroll-loading>

        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <dynamic-aside />
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
import { ScrollLoading } from '@components'
import { baidu, google } from '@utils'
import googleMixin from '@mixins/google'

export default {
  name: 'dynamic',
  mixins: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: `片刻-${this.website.meta.website_name}`,
      htmlAttrs: {
        lang: 'zh'
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config
        }),
        ...google.statisticsCode({
          route: this.$route,
          googleCode: this.website.config.googleCode,
          random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  data () {
    return {
      page: 2,
      isLoading: false,
      isMore: true,
      loginUserInfo: {}
    }
  },
  async asyncData ({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    const dispatchUrl =
      route.params.dynamicTopicId !== 'following'
        ? 'dynamic/GET_DYNAMIC_LIST'
        : 'dynamic/GET_DYNAMIC_LIST_ME'
    const isSort = ~['newest', 'hot'].indexOf(route.params.dynamicTopicId)
    return Promise.all([
      store.commit('dynamic/INIT_DYNAMIC_LIST'),
      store.dispatch(dispatchUrl, {
        topic_id: !isSort ? route.params.dynamicTopicId : '',
        sort: isSort ? route.params.dynamicTopicId : '',
        accessToken,
        isCommit: true
      })
    ])
  },
  created () {
    this.$store.dispatch('dynamic/GET_DYNAMIC_TOPIC_INDEX') // 获取首页动态专题列表
  },
  methods: {
    dynamicSubmit () {
      // 评论提交的回调
      if (this.$route.params.dynamicTopicId !== 'following') {
        // 判断是不是关注页面，是则直接刷新
        this.$router.push({
          name: 'dynamics',
          params: { dynamicTopicId: 'following' }
        })
      } else {
        window.location.reload()
      }
    },
    infiniteHandler () {
      this.isLoading = true
      const dispatchUrl =
        this.$route.params.dynamicTopicId !== 'following'
          ? 'dynamic/GET_DYNAMIC_LIST'
          : 'dynamic/GET_DYNAMIC_LIST_ME'
      const isSort = ~['newest', 'hot'].indexOf(
        this.$route.params.dynamicTopicId
      )
      this.$store
        .dispatch(dispatchUrl, {
          topic_id: !isSort ? this.$route.params.dynamicTopicId : '',
          sort: isSort ? this.$route.params.dynamicTopicId : '',
          page: this.page,
          isCommit: true
        })
        .then(result => {
          this.isLoading = false
          if (result.data.list.length === 10) {
            this.page += 1
          } else {
            this.isMore = false
          }
        })
        .catch(err => {
          this.isMore = false
        })
    }
  },
  computed: {
    ...mapState(['home', 'dynamic', 'website', 'personalInfo'])
  },
  components: {
    ScrollLoading,
    dynamicItem,
    dynamicWrite,
    dynamicAside
  }
}
</script>

<style scoped lang="scss">
#dynamic {
  margin-bottom: 15px;
  .aside {
    position: fixed;
    top: 65px;
    width: 110px;
    padding: 12px 10px;
    background: #fff;
    border-radius: 3px;
    transition: all 0.3s ease;
    box-shadow: 0 0.75rem 1.5rem rgba(18, 38, 63, 0.03);
    .nav-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      .nav-item {
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin-bottom: 5px;
          padding: 3px 10px;
          border-radius: 5px;
          color: #666;
          transition: background-color 0.2s, color 0.2s;
        }
        .current-active {
          color: rgba(0, 0, 0, 0.88);
          background: #ec7259;
          border-color: #ec7259;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .dynamic-main {
    padding-left: 120px;
    .stream-wrapper {
      margin-bottom: 10px;
    }
    .dy-item {
      position: relative;
      margin-bottom: 10px;
    }
  }
  @media (max-width: 575px) {
    .aside {
      position: static;
      width: 100%;
      .nav-list {
        display: block;
        .nav-item {
          display: inline-block;
        }
      }
    }
    .dynamic-main {
      padding-left: 0;
    }
  }
}
</style>
