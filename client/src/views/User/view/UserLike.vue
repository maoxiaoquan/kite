<template>
    <div class="user-article-like">

        <ul class="user-article-like-view">
            <li v-for="(item,key) in user_like_article.article_list" :key="key">
                <LikeArticleItem :articleItem="item" :Key="key"/>
            </li>
        </ul>

        <Page :count="pagination" :page="Number($route.query.page)||1" @pageChange="pageChange"></Page>

    </div>
</template>

<script>
  import LikeArticleItem from '../component/LikeArticleItem'
  import { Page } from '@components'

  export default {
    name: 'UserLike',
    metaInfo () {
      return {
        title: '喜欢',
        htmlAttrs: {
          lang: 'zh'
        }
      }
    },
    async asyncData ({ store, route }) {
      return store.dispatch('user/GET_USER_LIKE_ARTICLE_LIST', {
        uid: route.params.uid,
        page: route.query.page || 1,
        pageSize: route.query.pageSize || 10,
      })
    },
    methods: {
      pageChange (val) {
        this.$router.push({
          name: 'userLike',
          query: {
            page: val
          }
        })
      },
    },
    computed: {
      personal_info () { // 登录后的个人信息
        return this.$store.state.personal_info || {}
      },
      user_info () { // 登录后的个人信息
        return this.$store.state.user.user_info || {}
      },
      pagination () { // 分页
        return Math.ceil(this.user_like_article.count / this.user_like_article.pageSize)
      },
      user_like_article () { // 用户的like
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
