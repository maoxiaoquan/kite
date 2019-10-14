<template>
  <div class="article-blog">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">

          <div class="article-blog-menu">

            <nav class="column-menu">
              <ul class="nav-item-view">
                <li class="nav-item">
                  <router-link :to="{name:'articleBlogs',params:{columnEnName:'all'}}">热门</router-link>
                </li>
                <li class="nav-item"
                    v-for="column_item in articleColumn.homeColumn"
                    :key="column_item.article_column_id">
                  <router-link :to="{name:'articleBlogs',params:{columnEnName:column_item.article_column_en_name}}">
                    {{column_item.article_column_name}}
                  </router-link>
                </li>
                <li class="nav-item more">
                  <router-link :to="{name:'columnAll'}"> 更多...</router-link>
                </li>
              </ul>
            </nav>

            <div class="article-blog-menu-main">
              <nav class="column-tag-menu"
                   v-if="childNavItem.tag&&childNavItem.tag.length>0">
                <ul class="nav-item-view">
                  <!-- <li class="nav-item">
                    <router-link :to="{name:'articleBlogs',params:{columnEnName:$router.params.columnEnName||''}}">
                      全部
                    </router-link>
                  </li> -->
                  <li class="nav-item"
                      v-for="(item,key) in childNavItem.tag"
                      :key="key"
                      :class="{'active':item.article_tag_id===$route.query.tagId}">
                    <router-link :to="{name:'articleBlogs',query:{tagId:item.article_tag_id}}">
                      {{item.article_tag_name}}
                    </router-link>
                  </li>
                </ul>
              </nav>

              <nav class="sort-list-menu">
                <router-link class="nav-item"
                             :to="{name:'articleBlogs',query:sortMenu('')}">热门</router-link>
                <router-link class="nav-item"
                             :to="{name:'articleBlogs',query:sortMenu('new')}">最新</router-link>
                <router-link class="nav-item"
                             :to="{name:'articleBlogs',query:sortMenu('30day')}">近30天</router-link>
                <router-link class="nav-item"
                             :to="{name:'articleBlogs',query:sortMenu('7day')}">近7天</router-link>
                <router-link class="nav-item"
                             :to="{name:'articleBlogsLike'}"
                             v-if="personalInfo.islogin">我的关注</router-link>
              </nav>
            </div>

          </div>

          <div class="article-blog-list row">
            <div class="col-xs-6 col-sm-6 col-md-6"
                 v-for="(articleBlogItem,key) in articleBlog.blogs.list"
                 :key="key">
              <BlogItem :articleBlogItem="articleBlogItem" />
            </div>
          </div>

          <Page :total="articleBlog.blogs.count"
                :pageSize="articleBlog.blogs.pageSize"
                :page="Number($route.query.page)||1"
                @pageChange="pageChange"></Page>

        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <website-notice />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
import websiteNotice from '../Parts/websiteNotice'
import BlogItem from './component/BlogItem'
export default {
  metaInfo () {
    return {
      title: `专栏-${this.website.meta.website_name}`,
      meta: [
        {
          // set meta
          name: "description",
          content: `专栏-${this.website.meta.website_name}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  name: "ArticleBlog",
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("articleColumn/GET_ARTICLE_COLUMN"),
      store.dispatch('articleBlog/GET_ARTICLE_BLOG_LIST', {
        page: route.query.page || 1,
        columnEnName: route.params.columnEnName || '',
        tagId: route.query.tagId || '',
        sort: route.query.sort || '',
      })
    ]);
  },
  data () {
    return {
      childNavItem: ''
    };
  },
  created () {
    this.initColumn()
  },
  watch: {
    $route (to, from) {
      this.initColumn()
    }
  },
  methods: {
    initColumn () {
      if (this.$route.params.columnEnName && this.$route.params.columnEnName !== 'all') {
        this.switchColumn(this.$route.params.columnEnName)
      } else {
        this.childNavItem = {}
      }
    },
    switchColumn (val) {
      this.articleColumn.homeColumn.map(item => {
        console.log(item.article_column_en_name, val)
        if (item.article_column_en_name === val) {
          this.childNavItem = item || {}
        }
      })
    },
    sortMenu (sort) {
      let query = {
      }
      if (sort) {
        query.sort = sort
      }
      if (this.$route.query.tagId) {
        query.tagId = this.$route.query.tagId
      }

      return query
    },
    shareChange (val) { // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') { // 新浪
        share.shareToXl(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qzone') { // qq空间
        share.shareToQq(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qq') { // qq空间
        share.shareQQ(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      }
    },
    pageChange (val) {
      let query = {
        page: val
      }
      if (this.$route.query.tagId) {
        query.tagId = this.$route.query.tagId
      }
      if (this.$route.query.sort) {
        query.sort = this.$route.query.sort
      }
      this.$router.push({
        name: 'articleBlogs',
        params: { columnEnName: this.$route.params.columnEnName },
        query
      })
    }
  },
  computed: {
    ...mapState(['website', 'articleBlog', 'articleColumn', 'personalInfo'])
  },
  components: {
    websiteNotice,
    BlogItem,
    Page
  }
};
</script>

<style scoped lang="scss">
.article-blog {
  .article-blog-menu {
    .column-menu {
      .nav-item-view {
        .nav-item {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 8px;
          a {
            display: block;
            border: 1px solid #e0e0e0;
            padding: 2px 10px;
            font-size: 14px;
            border-radius: 3px;
            &.current-active {
              background: #fd763a;
              color: #fff;
              border: 1px solid #fd763a;
            }
          }
        }
      }
    }

    .article-blog-menu-main {
      border-top: 1px solid rgba(178, 186, 194, 0.15);
      padding: 15px 0 0;
      border-radius: 3px;
      margin-top: 15px;
      .column-tag-menu {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        .nav-item-view {
          .nav-item {
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 8px;
            a {
              display: block;
              border: 1px solid #e0e0e0;
              padding: 2px 10px;
              font-size: 14px;
              border-radius: 20px;
            }
            &.active {
              a {
                background: #fd763a;
                color: #fff;
                border: 1px solid #fd763a;
              }
            }
          }
        }
      }

      .sort-list-menu {
        display: flex;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        .nav-item {
          align-items: center;
          line-height: 1;
          position: relative;
          display: flex;
          font-size: 13px;
          margin-right: 15px;
          &.exact-active {
            color: #ea6f5a;
          }
        }
      }
    }
  }
}
</style>