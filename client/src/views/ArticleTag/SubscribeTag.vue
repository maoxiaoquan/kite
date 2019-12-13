<template>
  <!--article-list-lay layout-content start-->
  <section class="subscribe-lay layout-content"
           id="subscribe-lay">
    <div class="container box-container client-card">
      <nav class="switch-list-nav">
        <div class="nav-list">
          <router-link class="nav-item"
                       :to="{name:'columnAll'}">专栏</router-link>
          <router-link class="nav-item"
                       :to="{name:'subscribe_tag',params:{type:'all'}}">全部标签</router-link>
        </div>
      </nav>

      <header class="list-header">
        <nav role="navigation"
             class="list-nav">
          <ul class="nav-list">
            <li class="nav-item"
                :class="{'active':$route.params.type==='all'}">
              <router-link :to="{name:'subscribe_tag',params:{type:'all'}}">全部</router-link>
            </li>
            <!--class active-->
            <li class="nav-item"
                :class="{'active':$route.params.type==='my'}"
                v-if="personalInfo.islogin">
              <router-link :to="{name:'subscribe_tag',params:{type:'my'}}">已关注</router-link>
            </li>

            <li class="nav-item search"
                v-if="$route.params.type!=='my'">
              <form role="search"
                    class="search-tag-from">
                <input maxlength="32"
                       placeholder="搜索标签"
                       required="true"
                       v-model="tag_name"
                       class="search-tag-input" />
                <button class="search-tag-btn"
                        type="button"
                        @click="getArticleTagList">
                  <i class="el-icon-search"></i>
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </header>

      <div class="row tag-list">
        <div class="item col-xs-12 col-sm-3 col-md-3"
             v-for="(item,key) in subscribe.article_tag_list"
             :key="key">
          <articleTagItem :articleTagItem="item" />
        </div>
      </div>

      <Page :total="Number(subscribe.count)"
            :pageSize="Number(subscribe.pageSize)"
            :page="Number($route.query.page)||1"
            @pageChange="pageChange"></Page>
    </div>
  </section>
  <!--article-list-lay layout-content end-->
</template>

<script>
import ArticleTagItem from "@views/ArticleTag/component/ArticleTagItem";
import { Page } from "@components";
import { mapState } from "vuex";
import { share, baidu, google } from '@utils'
import googleMixin from '@mixins/google'

export default {
  name: "SubscribeTag",
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: "订阅",
      titleTemplate: `%s - ${this.website.meta.website_name}`,
      meta: [
        {
          // set meta
          name: "description",
          content: `订阅-${this.website.meta.website_name}`
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
  async asyncData ({ store, route, accessToken = "" }) {
    return Promise.all([
      store.dispatch("articleTag/MY_SUBSCRIBE_TAG_LIST", { accessToken }),
      store.dispatch("articleTag/GET_ARTICLE_TAG_LIST", {
        tag_name: route.query.tag_name,
        tag_type: route.params.type,
        page: route.query.page || 1,
        accessToken
      })
    ]);
  },
  data () {
    return {
      tag_name: ""
    };
  },
  methods: {
    pageChange (val) {
      this.$router.push({
        name: "subscribe_tag",
        params: { type: this.$route.params.type },
        query: {
          tag_name: this.$route.query.tag_name,
          tag_type: this.$route.params.type,
          page: val,
          uid: this.personalInfo.user.uid
        }
      });
    },
    getArticleTagList () {
      if (!this.tag_name) {
        this.$message.warning("请输入搜索内容");
        return false
      }
      this.$store.dispatch("articleTag/GET_ARTICLE_TAG_LIST", {
        tag_name: this.tag_name,
        tag_type: this.$route.params.type,
        page: this.$route.query.page || 1
      });
    }
  },
  computed: {
    ...mapState(["website"]),
    subscribe () {
      return this.$store.state.articleTag.subscribe || [];
    },
    personalInfo () {
      return this.$store.state.personalInfo;
    }
  },
  components: {
    ArticleTagItem,
    Page
  }
};
</script>

<style scoped lang="scss">
.subscribe-lay.layout-content {
  .client-card {
    padding: 25px 38px;
  }
  .switch-list-nav {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
    margin-bottom: 25px;
    .nav-list {
      align-items: center;
      line-height: 1;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      .current-active {
        color: #ea6f5a;
      }
    }
    .nav-item {
      padding: 0 15px;
      font-size: 14px;
      border-right: 1px solid hsla(0, 0%, 59.2%, 0.2);
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border-right: none;
      }
    }
  }

  .list-header {
    padding: 0.5rem 0.4rem;
    .article-type {
      .article-blog {
        display: inline-block;
      }
      .article-tag {
        display: inline-block;
      }
    }
    .list-nav {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .nav-list {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        line-height: 1;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-bottom: 20px;
        .nav-item {
          position: relative;
          cursor: pointer;
          margin-right: 15px;
          a {
            padding: 5px 10px;
            font-size: 14px;
            display: block;
          }
          &.active a,
          a:hover {
            color: #ff4d4f;
            border: 1px solid #ff4d4f;
            border-radius: 15px;
          }
          .search-tag-from {
            position: relative;
            .search-tag-input {
              padding: 8px 10px;
              font-size: 12px;
              border: 1px solid hsla(0, 0%, 59%, 0.2);
              outline: none;
              border-radius: 5px;
            }
            .search-tag-btn {
              padding: 3px 10px;
              background: #fff;
              border: none;
              border-radius: 3px;
              position: absolute;
              right: 1px;
              top: 5px;
              outline: 0;
            }
          }
        }
      }
    }
  }
  .tag-list {
    .item {
      margin-bottom: 1.3rem;
      padding: 0 0.7rem;
      box-sizing: border-box;
    }
  }
}
</style>
