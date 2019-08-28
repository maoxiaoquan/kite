<template>
  <div id="dynamic">
    <div class="container dynamic-container">
      <div class="aside">
        <nav role="navigation"
             class="dock-nav">
          <ul class="nav-list">
            <li class="nav-item acitve">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'newest'}}"
                           class="nav-link">推荐</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'hot'}}"
                           class="nav-link">热门</router-link>
            </li>
            <li class="nav-item"
                v-if="personalInfo.islogin">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'following'}}"
                           class="nav-link">关注</router-link>
            </li>
          </ul>
          <ul class="nav-list">
            <li class="nav-item"
                v-for="(item,key) in dynamic.dynamicTopicIndex"
                :key="key">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:item.topic_id}}"
                           class="nav-link">{{item.name}}</router-link>
            </li>
            <li class="nav-item more">
              <router-link :to="{name:'dynamicTopic'}"
                           class="more-view">
                <span>更多</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="row dynamic-main">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="stream-wrapper"
               v-if="personalInfo.islogin">
            <dynamic-write @changeDynamicWrite="dynamicSubmit" />
          </div>
          <div>
            <scroll-loading @scroll-loading="infiniteHandler"
                            :isLoading="isLoading"
                            :isMore="isMore">
              <div class="dy-item"
                   v-for="(dynamicItem,key) in dynamic.dynamicList.list"
                   :key="key">
                <dynamic-item :dynamicItem="dynamicItem" />
              </div>
            </scroll-loading>
          </div>
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
import { mapState } from "vuex";
import { ScrollLoading } from "@components";
export default {
  name: 'dynamic',
  metaInfo () {
    return {
      title: `片刻-${this.website.meta.website_name}`,
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  data () {
    return {
      page: 2,
      isLoading: false,
      isMore: true
    }
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    const dispatchUrl = route.params.dynamicTopicId !== 'following' ? "dynamic/GET_DYNAMIC_LIST" : "dynamic/GET_DYNAMIC_LIST_ME"
    const isSort = ~['newest', 'hot'].indexOf(route.params.dynamicTopicId)
    return Promise.all([
      store.commit('dynamic/INIT_DYNAMIC_LIST'),
      store.dispatch(dispatchUrl,
        {
          topic_id: !isSort ? route.params.dynamicTopicId : '',
          sort: isSort ? route.params.dynamicTopicId : '',
          accessToken,
          isCommit: true
        })
    ]);
  },
  created () {
    this.$store.dispatch("dynamic/GET_DYNAMIC_TOPIC_INDEX") // 获取首页动态专题列表
  },
  methods: {
    dynamicSubmit () { // 评论提交的回调
      if (this.$route.params.dynamicTopicId !== 'following') { // 判断是不是关注页面，是则直接刷新
        this.$router.push({ name: 'dynamics', params: { dynamicTopicId: 'following' } })
      } else {
        window.location.reload()
      }
    },
    infiniteHandler () {
      this.isLoading = true;
      const dispatchUrl = this.$route.params.dynamicTopicId !== 'following' ? "dynamic/GET_DYNAMIC_LIST" : "dynamic/GET_DYNAMIC_LIST_ME"
      const isSort = ~['newest', 'hot'].indexOf(this.$route.params.dynamicTopicId)
      this.$store
        .dispatch(dispatchUrl, {
          topic_id: !isSort ? this.$route.params.dynamicTopicId : '',
          sort: isSort ? this.$route.params.dynamicTopicId : '',
          page: this.page,
          isCommit: true
        })
        .then(result => {
          this.isLoading = false;
          if (result.data.list.length === 10) {
            this.page += 1;
          } else {
            this.isMore = false;
          }
        })
        .catch(err => {
          this.isMore = false;
        });
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
    top: 89px;
    width: 110px;
    padding: 12px 10px;
    background: #fff;
    border-radius: 3px;
    transition: all 0.3s ease;
    box-shadow: 0 0px 3px rgba(67, 38, 100, 0.15);
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
          border-radius: 15px;
          color: #666;
          transition: background-color 0.2s, color 0.2s;
        }
        .current-active {
          color: rgba(0, 0, 0, 0.88);
          background: #ffd600;
          border-color: #ffd600;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .more {
      .more-view {
        border: 1px solid #e0e0e0;
        border-radius: 10px !important;
      }
    }
  }
  .dynamic-main {
    padding-left: 135px;
    margin-top: 25px;
    .stream-wrapper {
      margin-bottom: 8px;
      .dynamic-editor {
        box-shadow: 0 0px 3px rgba(67, 38, 100, 0.15);
        border-radius: 6px;
      }
    }
    .dy-item {
      position: relative;
      box-shadow: 0 0px 3px rgba(67, 38, 100, 0.15);
      border-radius: 6px;
      margin-bottom: 8px;
    }
  }
}
</style>