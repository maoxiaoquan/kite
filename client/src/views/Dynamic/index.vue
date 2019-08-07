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
            <!-- <li class="nav-item">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'following'}}"
                           class="nav-link">关注</router-link>
            </li> -->
          </ul>
          <ul class="nav-list">
            <li class="nav-item"
                v-for="(item,key) in dynamic.dynamicTopicIndex"
                :key="key">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:item.topic_id}}"
                           class="nav-link">{{item.name}}</router-link>
            </li>
            <li class="nav-item more">
              <router-link :to="{name:'dynamicTopic'}">
                <i class="el-icon-star-off"></i>
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
            <dynamic-wtite />
          </div>
          <ul>
            <li class="dy-item"
                v-for="(dynamicItem,key) in dynamic.dynamicList.list"
                :key="key">
              <dynamic-item :dynamicItem="dynamicItem" />
            </li>
          </ul>
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
import dynamicWtite from './component/dynamicWtite'
import dynamicAside from './component/dynamicAside'
import { mapState } from "vuex";
export default {
  name: 'dynamic',
  metaInfo () {
    return {
      title: `千言-${this.website.meta.website_name}`,
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("dynamic/GET_DYNAMIC_TOPIC_INDEX"), // 重置文章列表数据 
      store.dispatch("dynamic/GET_DYNAMIC_LIST", { topic_id: route.params.dynamicTopicId || '' })
    ]);
  },
  computed: {
    ...mapState(['home', 'dynamic', 'website', 'personalInfo'])
  },
  components: {
    dynamicItem,
    dynamicWtite,
    dynamicAside
  }
}
</script>

<style scoped lang="scss">
#dynamic {
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
      i {
        display: inline-block;
        margin-right: 5px;
        margin-top: -2px;
        vertical-align: top;
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
        border-radius: 3px;
      }
    }
    .dy-item {
      position: relative;
      box-shadow: 0 0px 3px rgba(67, 38, 100, 0.15);
      border-radius: 3px;
      margin-bottom: 8px;
    }
  }
}
</style>