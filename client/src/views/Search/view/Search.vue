<template>
  <section class="article-list-lay layout-content">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="article-list">
            <div class="main-top">
              <div class="title">
                <a class="name"
                   href="javascript:;">搜索：
                  {{$route.query.query}}</a>
              </div>
              <div class="info">
                一共有
                {{searchArticle.count}} 条结果
              </div>
            </div>
            <ul class="trigger-menu">
              <!-- <li class=""><a href="/"><i class="iconfont ic-latestcomments"></i> 最新评论</a></li>-->
              <li class="active"><a href="javascript:;"><i class="iconfont ic-articles"></i> 文章</a></li>
              <!--<li class=""><a href="/"><i class="iconfont ic-hot"></i> 热门</a></li>-->
            </ul>
            <div class="list-container">
              <div class="article-view">
                <div class="article-item"
                     v-for="(item,key) in searchArticle.article_list">
                  <ArticleItem :articleItem="item"
                               :key="key" />
                </div>
              </div>

              <Page :count="pagination"
                    :page="Number($route.query.page)||1"
                    @pageChange="pageChange"></Page>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="box-aside">
            <div class="notice"
                 v-if="website.notice.length>0">
              <a class="notice-item"
                 v-for="(item,key) in website.notice"
                 v-if="item.enable"
                 :href="item.link"
                 :key="key">{{item.title}}</a>
            </div>

            <div class="advertise"
                 v-if="website.advertise.length>0">
              <div class="advertise-item"
                   v-for="(advertiseItem,key) in website.advertise"
                   v-if="advertiseItem.enable"
                   :key="key">
                <a class="advertise-img"
                   :href="advertiseItem.link||'javascript:;'"
                   v-if="advertiseItem.img_url">
                  <img :src="advertiseItem.img_url"
                       alt="">
                </a>
                <a class="advertise-text"
                   :href="advertiseItem.link||'javascript:;'"
                   v-else>
                  {{advertiseItem.title}}
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import ArticleItem from '@views/Article/component/ArticleItem'
import { Page } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'Search',
  metaInfo () {
    return {
      title: '搜索',
      titleTemplate: `%s - ${this.$route.query.query}`,
      meta: [{                 // set meta
        name: 'description',
        content: `搜索-${this.$route.query.query}`,
      }],
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return store.dispatch('search/GET_ARTICLE_SEARCH',
      {
        search: route.query.query || '',
        page: route.query.page || 1
      }
    )
  },
  methods: {
    pageChange (val) {
      this.$router.push({
        search: this.$route.query.query || '',
        page: this.$route.query.page || 1
      })
    }
  },
  computed: {
    ...mapState(['home', 'website']),
    pagination () { // 分页
      return Math.ceil(this.searchArticle.count / this.searchArticle.pageSize)
    },
    searchArticle () {
      return this.$store.state.search.searchArticle
    },
  },
  components: {
    ArticleItem,
    Page
  }
}
</script>

<style scoped lang="scss">
.article-list-lay.layout-content {
  padding-bottom: 50px;
  .article-list {
    .main-top {
      margin-top: 30px;
      margin-bottom: 20px;
      background: #ffc107;
      padding: 10px 20px;
      border-radius: 3px;
      .title {
        .name {
          display: inline;
          font-size: 21px;
          font-weight: 700;
          color: #fff;
          vertical-align: middle;
        }
      }
      .info {
        font-size: 14px;
        color: #fff;
      }
    }
    .trigger-menu {
      margin-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0;
      list-style: none;
      li {
        position: relative;
        display: inline-block;
        padding: 8px 0;
        margin-bottom: -1px;
        a {
          padding: 13px 20px;
          font-size: 15px;
          font-weight: 700;
          color: #969696;
          line-height: 25px;
        }
        &.active {
          border-bottom: 2px solid #646464;
        }
      }
    }
    .list-container {
      .article-view {
        > .article-item {
          border-bottom: 1px solid rgba(178, 186, 194, 0.15);
          &:hover {
            background: #f9f9f9;
          }
        }
      }
    }
  }
  .box-aside {
    margin-top: 30px;

    .notice {
      padding: 15px 12px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 12px;
      background-color: #fcf8e3;
      border-color: #faebcc;
      color: #8a6d3b;
      .notice-item {
        display: block;
        line-height: 20px;
        color: #8a6d3b;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .advertise {
      .advertise-item {
        overflow: hidden;
        margin-bottom: 10px;
        .advertise-img {
          border-radius: 12px;
          overflow: hidden;
          display: block;
        }
        .advertise-text {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>
