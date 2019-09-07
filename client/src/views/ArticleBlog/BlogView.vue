<template>
  <div class="article-blog">

  </div>
</template>

<script>
import { share } from '@utils'
import { mapState } from 'vuex'
export default {
  metaInfo () {
    return {
      title: this.article.title || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.article.excerpt || ""}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  name: "ArticleBlogView",
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([

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
    article () {
      return this.$store.state.article.article || {};
    },
    articleComment () {
      return this.$store.state.articleComment.article_comment || {};
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
    ...mapState(['website'])
  },
  components: {

  }
};
</script>

<style scoped lang="scss">
</style>