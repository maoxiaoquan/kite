<template>
  <div class="user-books">

    <el-button size="small"
               class="create-book"
               type="primary"
               @click="createBooks">创建小书</el-button>

    <div class="user-books-view row">
      <div class="col-xs-12 col-sm-4 col-md-4"
           v-for="(articleBlogItem,key) in 10"
           :key="key">
        <div class="library-item bbt-clearfix">
          <div class="library-item__thumb">
            <a href="/doc/3627"
               class=""
               target="_blank">
              <img src="http://bbtcdn.8btc.com/source/plugin/doc/data/201906/18/1560838285888/1.png"
                   class="img-full"
                   data-src="http://bbtcdn.8btc.com/source/plugin/doc/data/201906/18/1560838285888/1.png"
                   lazy="loaded">
            </a>
          </div>
          <div class="library-item__body">
            <div class="library-item__title">
              <a href="/doc/3627"
                 class="link-dark-major"
                 target="_blank">
                Telegram（电报）白皮书（中文版）
              </a>
            </div>
            <div class="library-item__info"><span>
                <i class="el-icon-view"></i> 16
              </span><span style="margin-left: 8px;">
                <i class="el-icon-notebook-2"></i> 27
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <Page :count="pagination"
          :page="Number($route.query.page)||1"
          @pageChange="pageChange"></Page>

    <!-- use the modal component, pass in the prop -->

  </div>
</template>

<script>
import { Page, UploadImage } from '@components'
import { mapState } from 'vuex'
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
    return store.dispatch('user/GET_USER_ARTICLE_BLOG_LIST', {
      uid: route.params.uid,
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  data () {
    return {
      isCreateBlogShow: false,
      isCreate: true,
    }
  },
  mounted () {
    this.$store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
  },
  methods: {
    createBooks () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$store.commit('SET_IS_LOGIN', true)
      } else {
        this.$router.push({ name: 'booksWrite', params: { type: 'create' } })
      }
    },
    changeArticleBlogImg ({ formData, config }) {
      this.$store.dispatch('articleBlog/UPLOAD_ARTICLE_BLOG_IMG', formData)
        .then(result => {
          if (result.state === 'success') {
            this.blogForm.icon = result.data.img
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    setBlogTime (item) { // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },

    deleteArticleBlog (blog_id) { // 删除文章的个人专栏
      this.$store.dispatch('user/DELETE_ARTICLE_BLOG', {
        blog_id,
      })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message);
            window.location.reload()
          } else {
            this.$message.warning(result.message);
          }
        })
    },


    pageChange (val) {
      this.$router.push({
        name: 'userBlog',
        query: {
          page: val
        }
      })
    }
  },
  computed: {
    ...mapState(['user', 'personalInfo']),
    pagination () { // 分页
      return Math.ceil(this.user.articleBlog.count / this.user.articleBlog.pageSize)
    },
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all;
    },
  },
  components: {
    Page,
    UploadImage
  }
}
</script>

<style scoped lang="scss">
.user-books {
  .create-book {
    margin-top: 20px;
  }
  .user-books-view {
    padding-top: 35px;
    .library-item {
      margin-bottom: 30px;
      background: #fff;
      border-radius: 4px;
      position: relative;
      transition: all 0.3s ease;
      &:after,
      &:before {
        transition: all 0.3s ease;
        position: absolute;
        display: table;
        height: 240px;
        background: #fff;
        border-radius: 4px;
        content: "";
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06),
          0 1px 10px 0 rgba(0, 0, 0, 0.04), 0 0 3px -1px rgba(0, 0, 0, 0.08);
      }
      &:before {
        width: 95%;
        top: -8px;
        left: 2.5%;
        z-index: -1;
      }
      &:after {
        width: 90%;
        top: -16px;
        left: 5%;
        z-index: -2;
      }
      .library-item__thumb {
        width: 100%;
        img {
          border-radius: 4px;
          border: 1px solid #f1f1f1;
        }
      }
      .library-item__body {
        .library-item__title {
          height: 44px;
          margin: 8px 0;
          font-size: 13px;
          line-height: 22px;
          font-weight: 700;
          word-break: break-all;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          .link-dark-major {
            color: rgba(0, 0, 0, 0.88);
            transition: all 0.3s ease;
          }
        }
      }
      .library-item__info {
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.56);
        margin-bottom: 8px;
      }
    }
  }
}
</style>
