<template>
  <div class="article-blog">
    <div class="container  box-container">
      <nav class="nav-list">
        <router-link class="nav-item"
                     :to="{name:'articleBlogs'}">全部</router-link>
        <router-link class="nav-item"
                     :to="{name:'articleBlogs',query:{type:'my'}}">我的关注</router-link>
      </nav>

      <div class="article-blog-list">
        <div class="col-xs-6 col-sm-3 col-md-3"
             v-for="(articleBlogItem,key) in articleBlog.blogs.list"
             :key="key">
          <router-link class="article-blog-item"
                       :to="{name:'articleBlog',params:{blogId:'my'}}">
            <el-image src=""
                      lazy></el-image>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
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
      store.dispatch('articleBlog/GET_ARTICLE_BLOG_LIST', {
        page: route.query.page || 1
      })
    ]);
  },
  data () {
    return {
    };
  },
  created () {
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
    ...mapState(['website', 'articleBlog'])
  },
  components: {
    Page
  }
};
</script>

<style scoped lang="scss">
.article-blog {
  .nav-list {
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
    .nav-item {
      display: inline-block;
      padding: 0 15px;
      &.exact-active {
        color: #fd5c2d;
      }
    }
  }
}
</style>