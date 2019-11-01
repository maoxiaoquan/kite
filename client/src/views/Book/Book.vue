<template>
  <div class="book-view">
    <div class="container  box-container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="client-card">
            <div class="book-info">
              <div class="poster">
                <img v-lazy="books.booksInfo.cover_img||''">
              </div>
              <div class="info">
                <div class="title-line">
                  <a href="javascript:;"
                     class="title">
                    <span>{{books.booksInfo.title}}</span>
                  </a>
                  <span class="attention"
                        v-if="~[statusList.reviewSuccess,statusList.freeReview].indexOf(books.booksInfo.status)&&personalInfo.islogin"
                        @click="collectBooks(books.booksInfo.books_id)"
                        :class="{'active':isCollect(books.booksInfo).status}">{{isCollect(books.booksInfo).text}}</span>
                </div>
                <div class="media">
                  <div class="desc">{{books.booksInfo.description}}</div>
                  <div class="author">
                    <div class="author-info">
                      <router-link :to="{name:'user',params:{uid:books.booksInfo.user.uid,routeType:'article'}}"
                                   class="user">
                        <img class="lazy avatar hero loaded"
                             v-lazy="books.booksInfo.user.avatar"
                             alt="">
                        <span class="username username">
                          {{books.booksInfo.user.nickname}}
                        </span>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="other">
                  <button class="btn button-look"
                          @click="lookChapter"> 查看</button>
                  <router-link v-if="personalInfo.islogin"
                               :to="{ name: 'booksWrite', params: { type: 'update' }, query: { books_id: books.booksInfo.books_id }}"
                               class="btn button-update"
                               @click="lookChapter"> 修改</router-link>
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
import { share, baidu, google } from '@utils'
import googleMixin from '@mixins/google'
import {
  statusList,
  statusListText,
} from '@utils/constant'

export default {
  name: "NavSort",
  mixins: [googleMixin], //混合谷歌分析  
  metaInfo () {
    return {
      title: this.books.booksInfo.title || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.books.booksInfo.title || ""}`
        },
        {
          // og:site_name
          property: "og:site_name",
          content: this.website.meta.website_name
        },
        {
          // og:site_name
          property: "og:image",
          content: this.books.booksInfo.cover_img || this.website.meta.logo
        },
        {
          // og:type
          property: "og:type",
          content: `article`
        },
        {
          // og:title
          property: "og:title",
          content: this.books.booksInfo.title
        },
        {
          // og:description
          property: "og:description",
          content: this.books.booksInfo.description
        },
        {
          // og:url
          property: "og:url",
          content: `${this.website.meta.domain_name}/dynamic/${this.books.booksInfo.books_id}`
        },
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config,
          random: this.books.booksInfo.books_id
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: this.books.booksInfo.books_id
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  data () {
    return {
      currentType: "BookList",
      statusList,
      statusListText,
    };
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("books/GET_BOOKS_INFO", { books_id: route.params.books_id, type: 'look' }),
    ]);
  },
  mounted () {
    this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
  },
  methods: {
    collectBooks (books_id) { // 用户收藏小书
      this.$store.dispatch('books/COLLECT_BOOKS', {
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
    isCollect (item) { // 是否收藏
      let collectUserIds = []
      if (item.collectUserIds && item.collectUserIds.length > 0) {
        item.collectUserIds.map(item => {
          collectUserIds.push(item.uid)
        })
        if (~collectUserIds.indexOf(Number(this.personalInfo.user.uid))) {
          return {
            status: true,
            text: '已收藏'
          }
        } else {
          return {
            status: false,
            text: '收藏'
          }
        }
      } else {
        return {
          status: false,
          text: '收藏'
        }
      }
    },
    lookChapter () {
      if (this.books.booksBookAll.length > 0) {
        this.$router.push({ name: 'BookView', params: { books_id: this.$route.params.books_id, book_id: this.books.booksBookAll[0].book_id } })
      } else {
        this.$message.warning('当前章节为空');
      }
    },
  },
  computed: {
    ...mapState(['books', 'personalInfo', 'website'])
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
      .title-line {
        .title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
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
      margin-top: 15px;
      position: relative;
      .button-look {
        padding: 5px 13px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.88);
        background: #ffd600;
        border-color: #ffd600;
        margin-right: 10px;
      }
      .button-update {
        background: #fff;
        border: 1px solid #e67e7e;
        color: #e67e7e;
        font-size: 14px;
        padding: 5px 12px;
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
