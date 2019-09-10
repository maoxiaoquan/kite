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

            <nav class="column-tag-menu"
                 v-if="childNavItem.tag&&childNavItem.tag.length>0">
              <ul>
                <li v-for="(item,key) in childNavItem.tag"
                    :key="key">
                  <router-link :to="{name:'articleBlogs',params:{columnEnName:$route.params.columnEnName},query:{tagId:item.article_tag_id}}">
                    {{item.article_tag_name}}
                  </router-link>
                </li>
              </ul>
            </nav>
          </div>

          <nav class="nav-list">
            <router-link class="nav-item"
                         :to="{name:'articleBlogs',query:{type:'all'}}">热门</router-link>
            <router-link class="nav-item"
                         :to="{name:'articleBlogs',query:{type:'all'}}">最新</router-link>
            <router-link class="nav-item"
                         :to="{name:'articleBlogs',query:{type:'all'}}">近30天</router-link>
            <router-link class="nav-item"
                         :to="{name:'articleBlogs',query:{type:'all'}}">近7天</router-link>
            <router-link class="nav-item"
                         :to="{name:'articleBlogs',query:{type:'my'}}">我的关注</router-link>
          </nav>

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
import navHeader from './component/navHeader'
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
    navHeader,
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