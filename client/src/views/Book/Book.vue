<template>
  <div class="book-view">
    <div class="container  box-container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="client-card">
            <div class="book-info">
              <div class="poster">
                <img :src="books.booksInfo.cover_img||''">
              </div>
              <div class="info">
                <div class="title-line">
                  <a href=""
                     class="title">
                    <span>{{books.booksInfo.title}}</span>
                  </a>
                </div>
                <div class="media">
                  <div class="desc">{{books.booksInfo.description}}</div>
                  <div class="author">
                    <div class="author-info">
                      <a href=""
                         target="_blank"
                         class="user">
                        <img class="lazy avatar hero loaded"
                             :src="books.booksInfo.user.avatar"
                             alt="">
                        <a href=""
                           target="_blank"
                           rel=""
                           class="username username">
                          {{books.booksInfo.user.nickname}}
                        </a>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="other">
                  <div class="not-buy">
                    <button class="button--buy"
                            @click="lookChapter"> 查看</button>
                    <router-link :to="{ name: 'booksWrite', params: { type: 'update' }, query: { books_id: books.booksInfo.books_id }}"
                                 class="button--buy"
                                 @click="lookChapter"> 修改</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="client-card">
            <div class="book-menu-wrap">
              <div class="book-menu">
                <div class="item"
                     @click="currentType='BookList'"
                     :class="{'active':currentType==='BookList'}"><span class="text">目录</span></div>
                <div class="item"
                     @click="currentType='BookInfo'"
                     :class="{'active':currentType==='BookInfo'}"><span class="text">介绍</span></div>
                <div class="item"
                     @click="currentType='BookComment'"
                     :class="{'active':currentType==='BookComment'}"><span class="text">评论</span>
                </div>
              </div>
            </div>
            <div class="book-content">
              <BookList v-show="currentType==='BookList'" />
              <BookInfo v-show="currentType==='BookInfo'" />
              <BookComment v-show="currentType==='BookComment'" />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <website-notice />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import websiteNotice from '@views/Parts/websiteNotice'
import BookList from './component/BookList'
import BookInfo from './component/BookInfo'
import BookComment from './component/BookComment'
import { mapState } from 'vuex'
export default {
  name: "NavSort",
  data () {
    return {
      currentType: "BookList"
    };
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("books/GET_BOOKS_INFO", { books_id: route.params.books_id }),
    ]);
  },
  mounted () {
    this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
  },
  methods: {
    lookChapter () {
      if (this.books.booksBookAll.length > 0) {
        this.$router.push({ name: 'BookView', params: { books_id: this.$route.params.books_id, book_id: this.books.booksBookAll[0].book_id } })
      } else {
        this.$message.warning('当前章节为空');
      }
    },
  },
  computed: {
    ...mapState(['books', 'personalInfo'])
  },
  components: {
    websiteNotice,
    BookList,
    BookInfo,
    BookComment
  }
};
</script>

<style scoped lang="scss">
.book-view {
  .book-info {
    padding: 20px;
    .poster {
      width: 130px;
      height: 182px;
      border-radius: 2px;
      background-repeat: no-repeat;
      float: left;
      margin-right: 20px;
    }
    .info {
      margin-left: 150px;
      font-size: 14px;
      min-height: 182px;
      .title-line {
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }
      }
      .media {
        display: flex;
        flex-direction: column;
        .desc {
          margin-top: 10px;
          min-height: 40px;
          line-height: 20px;
          overflow: hidden;
          color: #71777c;
        }
        .author {
          position: relative;
          display: flex;
          align-items: center;
          margin-top: 12px;
          .author-info {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            color: #333;
            .user {
              display: flex;
              align-items: center;
              color: #000;
              .hero {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
    .other {
      margin-top: 25px;
      position: relative;
      .not-buy {
        position: relative;
        .button--buy {
          height: 40px;
          font-size: 16px;
          padding-left: 30px;
          padding-right: 30px;
          background-color: #007fff;
          color: #fff;
          border: none;
          text-align: center;
        }
      }
    }
  }
  .book-menu-wrap {
    .book-menu {
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      height: 50px;
      line-height: 50px;
      position: relative;
      border-bottom: 1px solid #ecf0f3;
      .item {
        padding-left: 20px;
        padding-right: 20px;
        font-size: 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &.active {
          color: #007fff;
          border-bottom: 2px solid #007fff;
        }
      }
    }
  }
}
</style>
