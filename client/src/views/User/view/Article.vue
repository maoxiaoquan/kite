<template>

  <div class="user-center-article-view">

    <ul class="blog-list">
      <li class="title">个人专栏：</li>
      <li class="blog-list-item"
          :class="{'current':!$route.query.blog_id||$route.query.blog_id==='all'}">
        <router-link :to='{name:"userArticle",query:{blog_id:"all"}}'>
          <span class="name">全部</span>
        </router-link>
      </li>

      <li class="blog-list-item"
          v-for="(item,key) in userArticleBlogAll"
          :class="{'current':item.blog_id==$route.query.blog_id}"
          :key="key">
        <router-link :to='{name:"userArticle",query:{blog_id:item.blog_id}}'
                     class="avatar">
          <span class="name">{{ item.name }}</span>
          <i class="is-public"
             :class="{'true':item.is_public}">{{ item.is_public?'公开':'个人' }}</i>
        </router-link>
      </li>

      <template v-if="personalInfo.user.uid===userInfo.user.uid">
        <li class="blog-list-item">
          <router-link class="btn-user-blog"
                       :to='{name:"userBlog"}'>
            管理个人专栏
          </router-link>
        </li>
      </template>
    </ul>

    <div class="list-container">
      <!-- 文章列表模块 -->
      <div class="article-view">
        <div class="article-item"
             v-for="(item,key) in myArticle.article_list"
             :key="key">
          <BlogArticleItem @delete-change="updateArticleList"
                           :articleItem="item" />
        </div>
      </div>
      <Page :count="pagination"
            :page="Number($route.query.page)||1"
            @pageChange="pageChange"></Page>
    </div>

  </div>
  <!--article-list-lay layout-content end-->
</template>

<script>

import BlogList from '../component/BlogList'
import BlogArticleItem from '../component/BlogArticleItem'
import { Page, UploadImage } from '@components'

export default {
  name: 'Blog',
  metaInfo () {
    return {
      title: '个人专栏',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return store.dispatch('user/USER_MY_ARTICLE', {
      uid: route.params.uid,
      blog_id: route.query.blog_id || 'all',
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  data () {
    return {
      isCreateBlogShow: false
    }
  },
  created () {
    this.getUserArticleBlogList()
  },
  methods: {
    updateArticleList () {
      this.$store.dispatch('user/USER_MY_ARTICLE', {
        uid: this.$route.params.uid,
        blog_id: this.$route.query.blog_id || 'all',
        page: this.$route.query.page || 1,
        pageSize: 10,
      })
    },
    async getUserArticleBlogList () {
      await this.$store.dispatch('user/GET_USER_ARTICLE_BLOG_ALL', { uid: this.$route.params.uid })
    },
    pageChange (val) {
      this.$router.push({
        name: 'userArticle',
        query: {
          blog_id: this.currentBlogId,
          page: val
        }
      })
    }
  },
  computed: {
    personalInfo () { // 登录后的个人信息
      return this.$store.state.personalInfo || {}
    },
    userInfo () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
    pagination () { // 分页
      return Math.ceil(this.myArticle.count / this.myArticle.pageSize)
    },
    myArticle () { // 用户个人的文章
      return this.$store.state.user.my_article || {}
    },
    currentBlogId () {
      return this.$route.query.blog_id || 'all'
    },
    userArticleBlogAll () { // 个人所有专栏
      return this.$store.state.user.user_article_blog || []
    },
  },
  components: {
    BlogList,
    BlogArticleItem,
    UploadImage,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-center-article-view {
  margin-top: 20px;
}

.blog-list {
  .blog-list-item {
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 8px;
    a {
      border: 1px solid #e0e0ee;
      padding: 2px 10px;
      display: block;
      border-radius: 20px;
      .name {
        font-size: 13px;
        vertical-align: middle;
        display: inline-block;
        padding: 0 3px;
        font-weight: bold;
      }
      .is-public {
        background: #fd763a;
        font-size: 12px;
        vertical-align: middle;
        display: inline-block;
        border-radius: 10px;
        padding: 0 3px;
        color: #fff;
        &.active {
          background: #41b883;
        }
      }
      &.exact-active {
        background: #eb6f5a;
        border: 1px solid #eb6f5a;
        .name {
          color: #fff;
        }
      }
    }
    .btn-user-blog {
      background: #e67e7e;
      color: #fff;
      font-size: 13px;
      padding: 5px 10px;
    }
  }
  li {
    &.title {
      display: inline-block;
      color: #999999;
      margin-right: 6px;
      font-size: 14px;
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
</style>
