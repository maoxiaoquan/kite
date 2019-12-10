<template>
  <section class="article-list-lay layout-content ">
    <div class="container box-container">
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

            <div class="list-container client-card">
              <ul class="trigger-menu">
                <!-- <li class=""><a href="/"><i class="iconfont ic-latestcomments"></i> 最新评论</a></li>-->
                <li class="active"><a href="javascript:;"><i class="iconfont ic-articles"></i> 文章</a></li>
                <!--<li class=""><a href="/"><i class="iconfont ic-hot"></i> 热门</a></li>-->
              </ul>
              <div class="article-view">
                <div class="article-item"
                     v-for="(item,key) in searchArticle.article_list">
                  <ArticleItem :articleItem="item"
                               :key="key" />
                </div>
              </div>

              <Page :total="Number(searchArticle.count)"
                    :pageSize="Number(searchArticle.pageSize)"
                    :page="Number($route.query.page)||1"
                    @pageChange="pageChange"></Page>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <website-notice />
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import ArticleItem from '@views/Article/component/ArticleItem'
import { Page } from '@components'
import websiteNotice from '../../Parts/websiteNotice'
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
    searchArticle () {
      return this.$store.state.search.searchArticle
    },
  },
  components: {
    ArticleItem,
    websiteNotice,
    Page
  }
}
</script>

<style scoped lang="scss">
.article-list-lay.layout-content {
  .article-list {
    .main-top {
      margin-bottom: 10px;
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
      padding: 20px;
      .article-view {
        /deep/ .article-item {
          padding: 20px 0;
          border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        }
      }
    }
  }
}
</style>
