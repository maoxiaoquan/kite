<template>
  <div class="article-blog">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">

          <div class="article-blog-menu">
            <router-link :to="{name:'articleBlogs',params:{columnEnName:'all'}}"
                         class="menu-blog-home">专栏主页</router-link>
            <span class="menu-like-blog">我的关注</span>
          </div>

          <div class="article-blog-list row">
            <div class="col-xs-6 col-sm-6 col-md-6"
                 v-for="(articleBlogItem,key) in articleBlog.blogs.list"
                 :key="key">
              <BlogItem :articleBlogItem="articleBlogItem" />
            </div>
          </div>

          <Page :count="pagination"
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
      title: '专栏',
      meta: [
        {
          // set meta
          name: "description",
          content: `专栏`
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
    pagination () {
      // 分页
      return Math.ceil(this.articleBlog.blogs.count / this.articleBlog.blogs.pageSize);
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
    ...mapState(['website', 'articleBlog', 'articleColumn'])
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
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
    a,
    span {
      display: inline-block;
      padding: 0 15px;
      font-size: 14px;
    }
    .menu-blog-home {
    }
    .menu-like-blog {
      color: #ea6f5a;
    }
  }
}
</style>