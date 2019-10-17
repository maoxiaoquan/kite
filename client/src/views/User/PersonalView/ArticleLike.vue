<template>
  <div class="user-article-like"
       v-loading="isLoading">

    <ul class="user-article-like-view">
      <li v-for="(item,key) in articleList.article_list"
          :key="key">
        <LikeArticleItem :articleItem="item"
                         @likeArticle="getUserLikeArticleList"
                         :Key="key" />
      </li>
    </ul>

    <Page :total="articleList.count"
          :pageSize="articleList.pageSize"
          :page="Number(articleList.page)||1"
          @pageChange="pageChange"></Page>

  </div>
</template>

<script>
import LikeArticleItem from '../component/LikeArticleItem'
import { Page } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'UserLike',
  metaInfo () {
    return {
      title: '文章-收藏集',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data () {
    return {
      articleList: {
        // 用户like文章
        article_list: [],
        count: 0,
        page: 1,
        pageSize: 10
      },
      isLoading: false
    }
  },
  mounted () {
    this.getUserLikeArticleList()
  },
  methods: {
    getUserLikeArticleList () {
      this.isLoading = true
      this.$store.dispatch('user/GET_USER_LIKE_ARTICLE_LIST', {
        uid: this.$route.params.uid,
        page: this.articleList.page || 1,
        pageSize: this.articleList.pageSize || 10,
      }).then(result => {
        this.articleList = result.data
        this.isLoading = false
      }).catch(err => {
        this.isLoading = true
      })
    },
    pageChange (val) {
      this.articleList.page = val
      this.getUserLikeArticleList()
    },
  },
  computed: {
    ...mapState(["personalInfo"]),
    userInfo () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
    userLikeArticle () { // 用户的like
      return this.$store.state.user.user_like_article || {}
    },
  },
  components: {
    LikeArticleItem,
    Page
  }
}
</script>

<style scoped>
</style>
