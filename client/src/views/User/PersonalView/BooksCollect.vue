<template>
  <section class="collect-books-lay layout-content">

    <div class="books-list row">
      <div class="col-xs-6 col-sm-6 col-md-6"
           v-for="(booksItem,key) in collectBooksInfo.list"
           :key="key">
        <div class="library-item clearfix">
          <div class="library-item__thumb">
            <router-link :to="{name:'book',params:{books_id:booksItem.books.books_id}}">
              <img v-lazy="booksItem.books.cover_img"
                   class="img-full"
                   lazy="loaded">
            </router-link>
          </div>
          <div class="library-item__body">
            <div class="library-item__title">
              <router-link class="link-dark-major"
                           :to="{name:'book',params:{books_id:booksItem.books.books_id}}">
                {{booksItem.books.title}}
              </router-link>
            </div>
            <div class="library-item__info">
              <span><i class="el-icon-view"></i> {{booksItem.books.read_count||0}}
              </span><span style="margin-left: 8px;">
                <i class="el-icon-notebook-2"></i> {{booksItem.bookCount||0}}
              </span>
              <span class="attention"
                    v-if="~[2,4].indexOf(booksItem.books.status)&&personalInfo.islogin"
                    @click="collectBooks(booksItem.books.books_id)">取消收藏</span>
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

    <Page :total="Number(collectBooksInfo.count)"
          :pageSize="collectBooksInfo.pageSize"
          :page="Number(collectBooksInfo.page)||1"
          @pageChange="pageChange"></Page>
  </section>
</template>

<script>

import { mapState } from 'vuex'
import { Page } from '@components'
import {
  modelType
} from '@utils/constant'

export default {
  name: 'Collect',
  metaInfo () {
    return {
      title: '小书-收藏集',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data () {
    return {
      modelType,
      collectBooksInfo: {
        count: 0,
        list: [],
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getCollectBooksList()
  },
  methods: {
    pageChange (val) {
      this.collectBooksInfo.page = 1
      this.getCollectBooksList()
    },
    getCollectBooksList (page) {
      this.$store.dispatch('books/GET_COLLECT_BOOKS_LIST', {
        page: this.collectBooksInfo.page || 1,
        uid: this.personalInfo.user.uid,
      }).then(result => {
        this.collectBooksInfo = result.data
      })
    },
    collectBooks (books_id) { // 用户收藏小书
      this.$store.dispatch('common/SET_COLLECT', {
        associate_id: books_id,
        type: modelType.books
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
  },
  computed: {
    ...mapState(['personalInfo', 'user']),  // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    Page
  }
}
</script>

<style scoped lang="scss">
.collect-books-lay {
  .library-item {
    margin-bottom: 24px;
    padding: 16px;
    background: #fff;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
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
    .library-item__body {
      .library-item__title {
        height: 50px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 22px;
        font-weight: 700;
        word-break: break-all;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
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
      }
      .attention {
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        margin-left: 3px;
        color: #333;
        border-radius: 3px;
        border: 1px solid #e0e0e0;
        line-height: 12px;
        padding: 2px 3px;
        &.active {
          color: #fff;
          background: #41b883;
          border: 1px solid #41b883;
        }
      }
    }
  }
}
</style>
