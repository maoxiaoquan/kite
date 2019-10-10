<template>
  <div class="user-books">

    <el-button size="small"
               class="create-book"
               type="primary"
               @click="createBooks">创建小书</el-button>

    <div class="user-books-view row">
      <div class="col-xs-12 col-sm-4 col-md-4"
           v-for="(booksItem,key) in user.books.list"
           :key="key">
        <div class="library-item bbt-clearfix">
          <div class="operat-view"
               v-if="personalInfo.islogin&&personalInfo.user.uid===booksItem.user.uid">
            <el-dropdown trigger="click"
                         @command="commandChange">
              <div class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit"
                                  :command="{type:'edit',booksItem}">修改</el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete"
                                  :command="{type:'delete',booksItem}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="library-item__thumb">
            <router-link :to="{name:'book',params:{books_id:booksItem.books_id}}">
              <img :src="booksItem.cover_img"
                   class="img-full"
                   lazy="loaded">
            </router-link>
          </div>
          <div class="library-item__body">
            <div class="library-item__title">

              <router-link class="link-dark-major"
                           :to="{name:'book',params:{books_id:booksItem.books_id}}">{{booksItem.title}}</router-link>

            </div>
            <div class="library-item-tag">
              <template v-if="booksItem.tag">
                <router-link v-for="(itemArticleTag,key) in booksItem.tag"
                             class="tag-class frontend"
                             :key="key"
                             :to="{name:'article_tag',params:{article_tag_en_name:itemArticleTag.article_tag_en_name}}">{{itemArticleTag.article_tag_name}}</router-link>
              </template>
              <template v-else>
                <span class="hint">
                  暂时没有加入标签，加入标签更能容易被搜索到
                </span>
              </template>

            </div>
            <div class="library-item__info"><span>
                <i class="el-icon-view"></i> {{booksItem.read_count||0}}
              </span><span style="margin-left: 8px;">
                <i class="el-icon-notebook-2"></i> {{booksItem.bookCount||0}}
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
  name: 'Books',
  metaInfo () {
    return {
      title: '小书',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return store.dispatch('user/GET_BOOKS_LIST', {
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
    commandChange (val) {
      if (val.type === 'edit') {
        this.$router.push({ name: 'booksWrite', params: { type: 'update' }, query: { books_id: val.booksItem.books_id } })
      } else if (val.type === 'delete') {
        this.$confirm('此操作将永久删除该小书, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteBooks(val.booksItem.books_id);
        }).catch(() => {
        });
      }
    },
    deleteBooks (books_id) {
      this.$store.dispatch('books/DELETE_BOOKS', {
        books_id,
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
      return Math.ceil(this.user.books.count / this.user.books.pageSize)
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
      .operat-view {
        position: absolute;
        width: 30px;
        height: 28px;
        top: 10px;
        right: 15px;
        text-align: center;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        i {
          color: #fff;
        }
      }
      .library-item__thumb {
        width: 100%;
        height: 220px;
        overflow: hidden;
        border: 1px solid #f1f1f1;
        border-radius: 4px;
        img {
          height: 100%;
        }
      }
      .library-item__body {
        .library-item__title {
          height: 22px;
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
      .library-item-tag {
        height: 50px;
        .title {
          display: inline-block;
          font-size: 12px;
        }
        a {
          display: inline-block;
          background: #fd763a;
          font-size: 12px;
          color: #fff;
          border-radius: 10px;
          line-height: 15px;
          padding: 1px 3px;
          margin-right: 5px;
        }
        .hint {
          font-size: 12px;
          color: #999;
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
