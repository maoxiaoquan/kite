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
                 v-for="(articleBlogItem,key) in articleBlog.likeBlogArticleList.list"
                 :key="key">
              <LikeBlogItem :articleBlogItem="articleBlogItem" />
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
import LikeBlogItem from './component/LikeBlogItem'
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
  name: "LikeArticleBlog",
  mounted () {
    this.getLikeArticleBlogList()
  },
  watch: {
    $route (to, from) {
      this.getLikeArticleBlogList()
    }
  },
  methods: {
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
    getLikeArticleBlogList () { // 用户关注blog
      this.$store.dispatch('articleBlog/GET_LIKE_ARTICLE_BLOG_LIST', {
        page: this.$route.query.page || 1
      })
    },
    pageChange (val) {
      let query = {
        page: val
      }
      this.$router.push({
        name: 'articleBlogsLike',
        query
      })
    }
  },
  computed: {
    pagination () {
      // 分页
      return Math.ceil(this.articleBlog.likeBlogArticleList.count / this.articleBlog.likeBlogArticleList.pageSize);
    },
    ...mapState(['website', 'articleBlog', 'articleColumn', 'personalInfo'])
  },
  components: {
    websiteNotice,
    LikeBlogItem,
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