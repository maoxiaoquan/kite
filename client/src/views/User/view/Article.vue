<template>
  <div class="user-center-article-view"
       v-loading="isLoading">
    <ul class="blog-list">
      <li class="title">个人专栏：</li>
      <li class="blog-list-item"
          :class="{
          current: !$route.query.blog_id || $route.query.blog_id === 'all'
        }">
        <router-link :to="{
            name: 'user',
            query: { blog_id: 'all' },
            params: { routeType: 'article' }
          }">
          <span class="name">全部</span>
        </router-link>
      </li>

      <li class="blog-list-item"
          v-for="(item, key) in userArticleBlogAll"
          :class="{ current: item.blog_id == $route.query.blog_id }"
          :key="key">
        <router-link :to="{
            name: 'user',
            query: { blog_id: item.blog_id },
            params: { routeType: 'article' }
          }"
                     class="avatar">
          <span class="name">{{ item.name }}</span>
        </router-link>
      </li>

      <template v-if="personalInfo.user.uid === user.user.uid">
        <li class="blog-list-item">
          <router-link class="btn-user-blog"
                       :to="{ name: 'user', params: { routeType: 'blog' } }">
            管理个人专栏
          </router-link>
        </li>
      </template>
    </ul>

    <ul class="article-type">
      <li v-for="(articleItem, key) in articleTypeList"
          :class="{
          active: $route.query.type === key,
          'index-active': !$route.query.type && key === '1'
        }"
          :key="key">
        <router-link :to="{
            name: 'user',
            query: { blog_id: $route.query.blog_id || 'all', type: key },
            params: { routeType: 'article' }
          }">
          <span class="name">{{ articleItem }}</span>
        </router-link>
      </li>
    </ul>

    <div class="list-container">
      <!-- 文章列表模块 -->
      <div class="article-view">
        <div class="article-item"
             v-for="(item, key) in myArticle.list"
             :key="key">
          <UserArticleItem @delete-change="updateArticleList"
                           :articleItem="item" />
        </div>
      </div>
      <Page :total="Number(myArticle.count)"
            :pageSize="Number(myArticle.pageSize)"
            :page="Number(myArticle.page) || 1"
            @pageChange="pageChange"></Page>
    </div>
  </div>
  <!--article-list-lay layout-content end-->
</template>

<script>
import UserArticleItem from '../component/UserArticleItem'
import { Page, UploadImage } from '@components'
import { mapState } from 'vuex'
import constant from '@utils/constant'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText
} from '@utils/constant'
export default {
  name: 'userArticle',
  data () {
    return {
      isCreateBlogShow: false,
      isLoading: false,
      articleType: articleType,
      articleTypeList: articleTypeText,
      myArticle: {
        // 用户的文章
        list: [],
        count: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.getUserArticleBlogList()
    this.getMyArticleList()
  },
  watch: {
    $route (to, from) {
      this.getMyArticleList()
    }
  },
  methods: {
    getMyArticleList () {
      this.isLoading = true
      this.$store
        .dispatch('user/USER_MY_ARTICLE', {
          uid: this.$route.params.uid,
          blog_id: this.$route.query.blog_id || 'all',
          type: this.$route.query.type || articleType.article,
          page: this.myArticle.page || 1,
          pageSize: this.myArticle.pageSize || 10
        })
        .then(result => {
          this.myArticle = result.data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    pageChange (val) {
      this.myArticle.page = val
      this.getMyArticleList()
    },
    updateArticleList () {
      this.getMyArticleList()
    },
    async getUserArticleBlogList () {
      await this.$store.dispatch('user/GET_USER_ARTICLE_BLOG_ALL', {
        uid: this.$route.params.uid
      })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']),
    currentBlogId () {
      return this.$route.query.blog_id || 'all'
    },
    userArticleBlogAll () {
      // 个人所有专栏
      return this.$store.state.user.user_article_blog || []
    }
  },
  components: {
    UserArticleItem,
    UploadImage,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-center-article-view {
  margin-top: 20px;
}

.article-type {
  border-bottom: 1px solid #f0f0f0;
  font-size: 0;
  list-style: none;
  li {
    position: relative;
    display: inline-block;
    padding: 8px 0;
    margin-bottom: -1px;
    &.index-active,
    &.active {
      border-bottom: 2px solid #646464;
      a {
        color: #646464;
      }
    }
    a {
      padding: 13px 20px;
      font-size: 13px;
      color: #969696;
      line-height: 25px;
      &:hover {
        color: #646464;
      }
    }
  }
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
    }
    &.current {
      a {
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
    }
  }
}
</style>
