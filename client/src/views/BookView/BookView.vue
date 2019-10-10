<template>
  <div class="book-read-view">
    <div class="book-section">
      <div class="book-summary">
        <div class="book-summary-inner">
          <div class="book-summary__header">
            <a href="/"
               class="logo"><img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg">
            </a>
            <div class="label">小册</div>
          </div>
          <div class="book-summary-btn">
            <div class="section-buy"
                 @click="writeChapter('create')">创建</div>
          </div>
          <div class="book-directory bought">
            <router-link class="section"
                         :to="{name:'BookView', params: { books_id: $route.params.books_id, book_id: bookItem.book_id}}"
                         v-for="(bookItem,key) in books.booksBookAll"
                         :key="key">
              <div class="step">
                <div class="step-btn">{{key+1}}</div>
              </div>
              <div class="center">
                <div class="title">{{bookItem.title}} <i class="el-icon-edit-outline"
                     @click="writeChapter(bookItem.book_id)"></i> </div>
              </div>
            </router-link>
          </div>
          <div class="book-summary__footer"></div>
        </div>

      </div>
      <div class="book-content">
        <div class="book-content-inner">
          <div class="book-content__header">
            <div class="switch"><img src="https://b-gold-cdn.xitu.io/v3/static/img/icon.3e69d5a.svg"></div>
            <div class="menu"><img src="https://b-gold-cdn.xitu.io/v3/static/img/menu.74b9add.svg"></div>
            <div class="title">
              <router-link :to="{name:'book',params:{books_id:$route.params.books_id}}">{{books.booksInfo.title}}</router-link>
            </div>
            <div class="user-auth user-auth">
              <div class="nav-item auth">
                <span class="login">登录</span>
                <span class="register">注册</span>
              </div>
            </div>
          </div>
          <div class="book-body transition--next">
            <div class="section-view book-section-content">
              <div class="section-content">
                <div class="section-page book-section-view">
                  <div class="entry-content article-content box-article-view"
                       v-html="book.bookInfo.content">
                  </div>
                  <div class="book-comments">
                    <div class="box-title">留言</div>
                    <div class="comment-box">
                      <div class="comment-form comment-form unauthorized"
                           id="comment">
                        <div class="unauthorized-panel">
                          <button class="authorize-btn">登录</button>
                          <div class="placeholder">评论将在后台进行审核，审核通过后对所有人可见</div>
                        </div>
                      </div>
                    </div>

                    <BookComment />

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="book-handle book-direction">
            <div class="step-btn step-btn--prev"><img src="https://b-gold-cdn.xitu.io/v3/static/img/prev.87ad47e.svg"></div>
            <div class="step-btn step-btn--next"><img src="https://b-gold-cdn.xitu.io/v3/static/img/next.54d8a35.svg"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BookComment from "@views/Comment/BookComment";
export default {
  name: "BookInfo",
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("PERSONAL_INFO", { accessToken }),
      store.dispatch("book/GET_BOOK_INFO", { book_id: route.params.book_id }),
    ]);
  },
  data () {
    return {
      BookInfo: {}
    };
  },
  mounted () {
    this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
  },
  methods: {
    writeChapter (book_id) {
      this.$router.push({ name: 'WriteBookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
  },
  computed: {
    ...mapState(['books', 'book', 'personalInfo'])
  },
  components: {
    BookComment
  }
};
</script>

<style scoped lang="scss">
.book-read-view {
  position: relative;
  overflow: hidden;
  .book-section {
    position: relative;
    display: flex;
    .book-summary {
      width: 320px;
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      cursor: default;
      flex-shrink: 0;
      z-index: 2;
      border-right: 1px solid #ddd;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: left;
      .book-summary-inner {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: #f0f1f4;
        position: relative;
        z-index: 1;
        height: 100%;
        .book-summary__header {
          height: 60px;
          display: flex;
          padding-left: 16px;
          align-items: center;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
          .logo {
            height: 30px;
            img {
              height: 100%;
            }
          }
          .label {
            margin-left: 13px;
            margin-right: 25px;
            padding-left: 10px;
            padding-right: 10px;
            height: 24px;
            line-height: 24px;
            font-size: 15px;
            font-weight: 500;
            color: #007fff;
            position: relative;
            background-color: rgba(0, 127, 255, 0.1);
            &:after {
              content: "";
              position: absolute;
              bottom: 0;
              right: 0;
              width: 0;
              height: 0;
              border-color: rgba(0, 127, 255, 0.2) #fff #fff
                rgba(0, 127, 255, 0.2);
              border-style: solid;
              border-width: 5px;
            }
          }
        }
        .book-summary-btn {
          height: 60px;
          .section-buy {
            height: 60px;
            cursor: pointer;
            background-color: #007fff;
            color: #fff;
            font-size: 18px;
            line-height: 60px;
            text-align: center;
          }
        }

        .book-directory {
          overflow-y: auto;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          height: calc(100% - 180px);
          &.bought {
            height: calc(100% - 120px);
          }
          .section {
            position: relative;
            min-height: 75px;
            cursor: default;
            padding-left: 20px;
            padding-right: 35px;
            border-radius: 2px;
            font-size: 14px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #8f9193;
          }
          .section {
            min-height: 60px;
            padding-left: 16px;
            &.section-link {
              cursor: pointer;
            }
            &.read {
              color: #333;
            }
            .step {
              align-items: center;
              display: flex;
              margin-right: 15px;
              align-self: stretch;
              position: relative;
            }
            .step {
              margin-right: 10px;
              .step-btn {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 50%;
                border: 2px solid #b5b7ba;
                color: #b5b7ba;
                box-sizing: border-box;
                text-align: center;
                background-color: #fff;
                z-index: 1;
              }
              .step-btn {
                width: 30px;
                height: 30px;
                font-size: 14px;
              }
            }
            .step:after,
            .step:before {
              z-index: 0;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              width: 2px;
              background-color: #b5b7ba;
              height: 50%;
              content: "";
            }
            .step:after {
              top: 50%;
            }
            .step:before {
              top: 0;
            }

            &.read .step:after,
            &.read .step:before,
            &.route-active .step:after,
            &.route-active .step:before {
              background-color: #007fff;
            }
            &:first-child {
              .step {
                &:before {
                  top: 0;
                  content: "";
                  display: none;
                }
              }
            }
            &:last-child {
              .step {
                &:after {
                  top: 0;
                  content: "";
                  display: none;
                }
              }
            }
          }
        }
      }
    }
    .book-content {
      width: 100%;
      margin-left: 320px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      .book-content-inner {
        position: relative;
        .book-content__header {
          position: fixed;
          right: 0;
          left: 319px;
          min-width: 320px;
          background-color: #fff;
          z-index: 2;
          border-bottom: 1px solid #ddd;
          height: 60px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 20px;
          padding-right: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 18px;
          .switch {
            display: none;
            padding-left: 15px;
            margin-right: 10px;
            background-image: url(https://b-gold-cdn.xitu.io/v3/static/img/more.3f349bb.svg);
            background-repeat: no-repeat;
            background-position: 0;
            background-size: 16px;
            img {
              width: 30px;
              vertical-align: middle;
            }
          }
          .menu {
            width: auto;
            height: 20px;
            margin-right: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            img {
              vertical-align: top;
            }
          }
          .title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 700;
          }
          .user-auth {
            position: relative;
            right: 0;
            margin-left: 10px;
            margin-right: 5px;
            flex-shrink: 0;
            .nav-item {
              color: #71777c;
              font-size: 1.33rem;
              margin: 0;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }
          }
        }
        .book-body {
          min-height: 100vh;
          box-sizing: border-box;
          padding-top: 90px;
          position: relative;
          background-color: #e6e7e9;
          padding-bottom: env(safe-area-inset-bottom);
          .section-page {
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            padding: 20px 60px 40px;
            box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
            background-color: #fff;
            border-radius: 2px;
            box-sizing: border-box;
            .article-content {
              word-break: break-word;
              line-height: 1.75;
              font-weight: 400;
              font-size: 15px;
              overflow-x: hidden;
            }
            .book-comments {
              padding-top: 30px;
              .box-title {
                margin: 1.3rem 0;
                text-align: center;
                color: #909090;
                font-weight: 500;
                font-size: 16px;
              }
              .comment-box {
                padding-bottom: 1rem;
                .comment-form {
                  position: relative;
                  padding: 1.3rem 1.3rem 1.3rem 6rem;
                  background-color: #f8f9fa;
                  border: 1px solid #f1f1f1;
                  border-radius: 4px;
                  .unauthorized-panel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2.5rem 1rem;
                    .authorize-btn {
                      padding: 0.5rem 1rem;
                      font-size: 1rem;
                      color: #007fff;
                      background-color: transparent;
                      border: 1px solid;
                      border-radius: 3px;
                    }
                    .placeholder {
                      margin-left: 1.3rem;
                      font-size: 1.167rem;
                      font-weight: 500;
                      color: #4a4a4a;
                    }
                  }
                }
              }
            }
          }
        }
        .book-handle {
          position: fixed;
          width: 100%;
          left: 50%;
          max-width: calc(100vw - 340px);
          bottom: 70px;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          margin-left: 160px;
          max-width: 980px;
          .step-btn {
            cursor: pointer;
            position: absolute;
            bottom: 0;
            z-index: 10;
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            border-radius: 50%;
            background-color: #007fff;
            color: #fff;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            &.step-btn--prev {
              left: 10px;
            }
            &.step-btn--next {
              right: 10px;
            }
            img {
              width: 32px;
            }
          }
        }
      }
    }
  }
}
</style>
