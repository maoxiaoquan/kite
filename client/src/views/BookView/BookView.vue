<template>
  <client-only>
    <div class="book-read-view">
      <div class="book-section"
           :class="{'fold-pc':!isShowAside}">
        <div class="book-summary">
          <div class="book-summary-inner">
            <div class="book-summary__header">
              <router-link :to="{name:'home'}"
                           class="navbar-brand logo"
                           v-if="website.meta.logo"
                           :style="{'background-image':'url('+website.meta.logo+')'}"></router-link>
              <router-link :to="{name:'home'}"
                           class="navbar-brand logo-text"
                           v-else>{{website.meta.website_name}}</router-link>
              <div class="label">小书</div>
            </div>
            <div class="book-summary-btn"
                 v-if="personalInfo.islogin&&book.bookInfo.uid===personalInfo.user.uid">
              <div class="section-buy"
                   @click="writeChapter('create')">创建新章节</div>
            </div>
            <div class="book-directory"
                 :class="{'bought':personalInfo.islogin}">
              <router-link class="section"
                           :to="{name:'BookView', params: { books_id: $route.params.books_id, book_id: bookItem.book_id}}"
                           v-for="(bookItem,key) in books.booksBookAll"
                           :key="key">
                <div class="step">
                  <div class="step-btn">{{key+1}}</div>
                </div>
                <div class="center">
                  <div class="title">{{bookItem.title}} <span class="read"
                          v-if="Number(books.booksInfo.is_free)===isFree.pay&&bookItem.trial_read===trialRead.yes">可试读</span></div>
                </div>
              </router-link>
            </div>
            <div class="book-summary__footer"></div>
          </div>
        </div>
        <div class="book-content">
          <div class="book-content-inner">
            <div class="book-content__header">
              <div class="menu"
                   @click="isShowAside=!isShowAside"><i class="el-icon-s-operation"></i></div>
              <div class="title">
                <router-link :to="{name:'book',params:{books_id:$route.params.books_id}}">{{books.booksInfo.title}}</router-link>
              </div>
              <div class="user-auth">
                <div class="nav-item auth"
                     v-if="!personalInfo.islogin">
                  <div class="nav-item-view"
                       v-if="website.config.on_login==='yes'">
                    <router-link class="btn btn-sm sign-btn btn-block"
                                 :to="{ name: 'signIn' }">登录</router-link>
                  </div>
                  <div class="nav-item-view"
                       v-if="website.config.on_register==='yes'">
                    <router-link class="btn s-btn--primary btn-sm sign-btn btn-outline-warning"
                                 :to="{ name: 'signIn' }">注册</router-link>
                  </div>
                </div>
                <div class="nav-item dropdown"
                     v-else>
                  <Dropdown placement="right">
                    <div class="el-dropdown-link"
                         slot="button">
                      <div class="avatar-img">
                        <img v-lazy="personalInfo.user.avatar"
                             class="box-image"
                             alt="">
                      </div>
                    </div>
                    <div class="dropdown-menu-view">
                      <router-link class="dropdown-menu-item"
                                   :to="{name:'user',params:{uid:personalInfo.user.uid,routeType:'article'}}">
                        我的主页</router-link>
                      <router-link class="dropdown-menu-item"
                                   :to="{name:'setting'}">
                        设置</router-link>
                      <div class="dropdown-menu-item"
                           @click="escLogin">
                        退出
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div class="book-body transition--next">
              <div class="section-content">
                <div class="clearfix">
                  <div class="btn edit-outline"
                       v-if="personalInfo.islogin&&book.bookInfo.uid===personalInfo.user.uid"
                       @click="writeChapter(book.bookInfo.book_id)">
                    编辑当前章节
                  </div>
                </div>
                <div class="entry-content article-content box-article-view"
                     v-if="book.bookInfo.isLook"
                     v-html="book.bookInfo.content">
                </div>
                <div v-else
                     class="no-read">
                  <p>当前章节需要购买此小书后，方可继续阅读</p>
                </div>
                <div class="book-comments">
                  <div class="comment-box"
                       v-if="!personalInfo.islogin">
                    <div class="comment-form comment-form unauthorized"
                         id="comment">
                      <div class="unauthorized-panel">
                        <router-link class="authorize-btn"
                                     :to="{ name: 'signIn' }">登录</router-link>
                        <div class="placeholder">评论将在后台进行审核，审核通过后对所有人可见</div>
                      </div>
                    </div>
                  </div>
                  <BookComment />
                </div>
              </div>
            </div>
            <div class="book-handle book-direction">
              <div class="step-btn step-btn--prev"
                   v-show="bookInfoOther.prev"
                   @click="lookChapter(bookInfoOther.prev.book_id)"><i class="el-icon-arrow-left"></i></div>
              <div class="step-btn step-btn--next"
                   v-show="bookInfoOther.next"
                   @click="lookChapter(bookInfoOther.next.book_id)"><i class="el-icon-arrow-right"></i></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapState } from 'vuex'
import BookComment from "@views/Comment/BookComment";
import { cookie } from '../../utils/cookie.js';
import ClientOnly from 'vue-client-only'
import { baidu, google } from '@utils'
import googleMixin from '@mixins/google'
import { Dropdown } from '@components'
import {
  trialRead,
  trialReadText,
  isFree
} from '@utils/constant'
export default {
  name: "BookInfo",
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: this.book.bookInfo.title || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.book.bookInfo.title || ""}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("PERSONAL_INFO", { accessToken }),
      store.dispatch('website/GET_WEBSITE_INFO'),
      store.dispatch("books/GET_BOOKS_INFO", { books_id: route.params.books_id, type: 'info', accessToken }),
      store.dispatch("book/GET_BOOK_INFO", { book_id: route.params.book_id, accessToken }),
    ]);
  },
  data () {
    return {
      trialRead,
      isFree,
      isShowAside: true, // 是否显示侧栏
      bookInfoOther: { // 当前小书章节的其他信息
        prev: {},
        next: {}
      }
    };
  },
  watch: {
    $route (to, from) {
      this.getBookNextPrev()
    }
  },
  mounted () {
    this.getBooksBookAll()
    this.getBookNextPrev()
  },
  methods: {
    commandChange (val) {
      if (val.name !== "esc") {
        this.$router.push(val);
      } else {
        this.escLogin();
      }
    },
    escLogin () {
      this.$message.warning("已退出当前账户，请重新登录");
      cookie.delete("accessToken");
      window.location.reload();
    },
    lookChapter (book_id) {
      this.$router.push({ name: 'BookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
    writeChapter (book_id) {
      this.$router.push({ name: 'WriteBookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
    getBooksBookAll () {
      this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
    },
    getBookNextPrev () {
      this.$store.dispatch("book/BOOK_NEXT_PREV", { book_id: this.$route.params.book_id, books_id: this.$route.params.books_id }).then(result => {
        this.bookInfoOther = result.data
      })
    }
  },
  computed: {
    ...mapState(['books', 'book', 'personalInfo', 'website'])
  },
  components: {
    BookComment,
    ClientOnly,
    Dropdown
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
    &.fold-pc .book-summary {
      left: -320px;
    }
    &.fold-pc .book-content {
      margin-left: 0;
      .book-content-inner {
        .book-content__header {
          left: 0;
        }
      }
      .book-content-inner .book-handle .step-btn.step-btn--prev {
        left: -150px;
      }
      .book-content-inner .book-handle .step-btn.step-btn--next {
        right: 170px;
      }
    }
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
            background-size: 100% 100%;
            display: block;
            width: 90px;
            height: 32px;
            left: 10%;
          }
          .logo-text {
            font-size: 25px;
            color: #e67e7e;
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
            font-size: 14px;
            line-height: 60px;
            text-align: center;
          }
        }

        .book-directory {
          overflow-y: auto;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          height: calc(100% - 60px);
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
            cursor: pointer;
            &.current-active {
              color: #333;
              background: rgba(0, 0, 0, 0.1);
            }
            .title {
              .read {
                color: #fff;
                background: lightcoral;
                font-size: 12px;
                border-radius: 3px;
                line-height: 18px;
                padding: 1px 3px;
                cursor: pointer;
              }
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
              .avatar-img {
                display: inline-block;
                position: relative;
                width: 36px;
                height: 36px;
                border-radius: 72px;
                .box-image {
                  width: 36px;
                  height: 36px;
                  border-radius: 4px;
                  overflow: hidden;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 80px;
                  }
                }
              }
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
          padding-bottom: 30px;
          .section-content {
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            padding: 30px;
            box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
            background-color: #fff;
            border-radius: 2px;
            box-sizing: border-box;
            position: relative;
            .edit-outline {
              color: rgba(0, 0, 0, 0.88);
              background: #ffd600;
              border-color: #ffd600;
              margin-bottom: 15px;
              padding: 5px 10px;
              font-size: 14px;
              float: right;
              cursor: pointer;
            }
            .article-content {
              word-break: break-word;
              line-height: 1.75;
              font-weight: 400;
              font-size: 15px;
              overflow-x: hidden;
            }
            .no-read {
              padding-top: 50px;
              padding-bottom: 50px;
              p {
                text-align: center;
                font-weight: bold;
              }
            }
            .book-comments {
              padding-top: 30px;
              .comment-box {
                padding-bottom: 1rem;
                .comment-form {
                  position: relative;
                  padding: 30px;
                  background-color: #f8f9fa;
                  border: 1px solid #f1f1f1;
                  border-radius: 4px;
                  .unauthorized-panel {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .authorize-btn {
                      padding: 5px 13px;
                      font-size: 1rem;
                      color: #007fff;
                      background-color: transparent;
                      border: 1px solid;
                      border-radius: 3px;
                    }
                    .placeholder {
                      margin-left: 1.3rem;
                      font-size: 14px;
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
