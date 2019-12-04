<template>
  <div class="user-books"
       v-loading="isLoading">

    <button class="btn create-book"
            @click="createBooks">创建小书</button>

    <div class="user-books-view row">
      <div class="col-xs-12 col-sm-6 col-md-6"
           v-for="(booksItem,key) in books.list"
           :key="key">

        <div class="library-item clearfix">
          <div class="operat-view"
               v-if="personalInfo.islogin&&personalInfo.user.uid===booksItem.user.uid">
            <Dropdown>
              <div class="el-dropdown-link"
                   slot="button">
                <i class="el-icon-more"></i>
              </div>
              <div class="dropdown-menu-view">
                <div class="dropdown-menu-item"
                     @click="commandChange({type:'edit',booksItem})">
                  修改
                </div>
                <div class="dropdown-menu-item"
                     @click="commandChange({type:'delete',booksItem})">
                  删除
                </div>
              </div>
            </Dropdown>
          </div>
          <div class="library-item__thumb">
            <router-link :to="{name:'book',params:{books_id:booksItem.books_id}}">
              <img v-lazy="booksItem.cover_img"
                   class="img-full"
                   lazy="loaded">
            </router-link>
          </div>
          <div class="library-item__body">
            <div class="library-item__title">
              <router-link class="link-dark-major"
                           :to="{name:'book',params:{books_id:booksItem.books_id}}">
                {{booksItem.title}}
                <span class="free"
                      :class="Number(booksItem.is_free)===isFree.free?'yes':''">{{isFreeText[booksItem.is_free]}}</span>
              </router-link>
            </div>
            <div class="library-item__info">
              <span><i class="el-icon-view"></i> {{booksItem.read_count||0}}
              </span><span style="margin-left: 8px;">
                <i class="el-icon-notebook-2"></i> {{booksItem.bookCount||0}}
              </span>
              <span class="public-tag"
                    v-if="!booksItem.is_public">未公开</span>
            </div>
            <div class="library-item-tag">
              <template v-if="booksItem.tag">
                <router-link v-for="(itemArticleTag,key) in booksItem.tag"
                             class="tag-class frontend"
                             :key="key"
                             :to="{name:'article_tag',params:{en_name:itemArticleTag.en_name}}">{{itemArticleTag.name}}</router-link>
              </template>
              <template v-else>
                <span class="hint">
                  暂时没有加入标签，加入标签更能容易被搜索到
                </span>
              </template>

            </div>
          </div>
        </div>

      </div>
    </div>

    <Page :total="Number(books.count)"
          :pageSize="Number(books.pageSize)"
          :page="Number(books.page)||1"
          @pageChange="pageChange"></Page>

  </div>
</template>

<script>
import { Page, UploadImage, Dropdown } from '@components'
import { mapState } from 'vuex'

import {
  statusList,
  statusListText,
  payTypeText,
  isFree,
  isFreeText,
  productType
} from '@utils/constant'

export default {
  name: 'Books',
  data () {
    return {
      isLoading: false,
      isFree,
      isFreeText,
      books: {
        // 个人中心小书列表
        count: 0,
        list: [],
        page: 1,
        pageSize: 10
      },
    }
  },
  mounted () {
    this.getBooksList()
    this.$store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
  },
  methods: {
    getBooksList () {
      this.isLoading = true
      this.$store.dispatch('user/GET_BOOKS_LIST', {
        uid: this.$route.params.uid,
        page: this.books.page || 1,
        pageSize: this.books.pageSize || 10,
      }).then(result => {
        this.books = result.data
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    createBooks () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
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
            this.getBooksList()
          } else {
            this.$message.warning(result.message);
          }
        })
    },
    pageChange (val) {
      this.books.page = val
      this.getBooksList()
    }
  },
  computed: {
    ...mapState(['user', 'personalInfo']),
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all;
    },
  },
  components: {
    Page,
    UploadImage,
    Dropdown
  }
}
</script>

<style scoped lang="scss">
.user-books {
  .create-book {
    border-radius: 15px;
    background: #ffd600;
    padding: 3px 13px;
    font-size: 14px;
    border-color: #ffd600;
    color: #333;
    margin-top: 20px;
  }
  .user-books-view {
    padding-top: 20px;

    .library-item {
      margin-bottom: 10px;
      padding: 16px;
      background: #fff;
      transition: all 0.3s ease;
      border: 1px solid rgba(178, 186, 194, 0.15);
      .library-item__thumb {
        float: left;
        width: 88px;
        margin-right: 8px;
        img {
          border-radius: 4px;
          border: 1px solid #f1f1f1;
          height: 120px;
        }
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
      .library-item__body {
        .library-item__title {
          height: 48px;
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 22px;
          font-weight: 700;
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          .free {
            font-size: 12px;
            background: #fd763a;
            border-radius: 3px;
            line-height: 18px;
            color: #fff;
            padding: 1px 3px;
            display: inline-block;
            &.yes {
              background: #41b883;
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
            border: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            border-radius: 3px;
            line-height: 15px;
            padding: 2px 5px;
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
          .public-tag {
            background: #fd763a;
            font-size: 12px;
            border-radius: 3px;
            display: inline-block;
            margin-left: 5px;
            line-height: 14px;
            color: #fff;
            padding: 1px 2px;
          }
        }
      }
    }
  }
}
</style>
