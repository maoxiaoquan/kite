<template>
  <div class="user-article-like">

    <ul class="user-article-like-view row">
      <li class="col-xs-6 col-sm-6 col-md-6"
          v-for="(articleBlogItem,key) in articleBlog.list"
          :key="key">
        <LikeBlogItem :articleBlogItem="articleBlogItem"
                      @changeLike="getLikeArticleBlogList" />
      </li>
    </ul>

    <Page :total="articleBlog.count"
          :pageSize="Number(articleBlog.pageSize)"
          :page="Number(articleBlog.page)||1"
          @pageChange="pageChange"></Page>

  </div>
</template>

<script>
import LikeBlogItem from '../component/LikeBlogItem'
import { Page } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'UserLike',
  metaInfo () {
    return {
      title: '个人专栏-收藏集',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data () {
    return {
      articleBlog: {
        // 用户like文章
        list: [],
        count: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getLikeArticleBlogList()
  },
  methods: {
    getLikeArticleBlogList () {
      this.$store.dispatch('articleBlog/GET_LIKE_ARTICLE_BLOG_LIST', {
        uid: this.personalInfo.user.uid,
        page: this.articleBlog.page || 1,
        pageSize: this.articleBlog.pageSize || 10,
      }).then(result => {
        this.articleBlog = result.data
      })
    },
    pageChange (val) {
      this.articleBlog.page = val
      this.getLikeArticleBlogList()
    },
  },
  computed: {
    ...mapState(["personalInfo"])
  },
  components: {
    LikeBlogItem,
    Page
  }
}
</script>

<style scoped>
</style>
