<template>
  <div class="books">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-12 col-md-12">

          <div class="books-menu client-card">

            <nav class="column-menu">
              <ul class="nav-item-view">
                <li class="nav-item"
                    v-for="column_item in articleColumn.homeColumn"
                    :key="column_item.column_id">
                  <router-link :to="{name:'books',params:{columnEnName:column_item.en_name}}">
                    {{column_item.name}}
                  </router-link>
                </li>
                <li class="nav-item more">
                  <router-link :to="{name:'columnAll'}"> 更多...</router-link>
                </li>
              </ul>
            </nav>

            <div class="menu-main">
              <nav class="column-tag-menu"
                   v-if="childNavItem.tag&&childNavItem.tag.length>0">
                <ul class="nav-item-view">
                  <li class="nav-item"
                      v-for="(item,key) in childNavItem.tag"
                      :key="key"
                      :class="{'active':item.tag_id===$route.query.tagId}">
                    <router-link :to="{name:'books',query:{tagId:item.tag_id}}">
                      {{item.name}}
                    </router-link>
                  </li>
                </ul>
              </nav>

              <nav class="sort-list-menu clearfix">
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('')}">热门</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('new')}">最新</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('30day')}">近30天</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('7day')}">近7天</router-link>
                <span class="nav-item add-book"
                      @click="createBook">新增小书</span>
              </nav>
            </div>

          </div>

          <div class="books-list">
            <div class="row">

              <div class="col-xs-4 col-sm-4 col-md-4"
                   v-for="(booksItem,key) in books.booksList.list"
                   :key="key">
                <div class="library-item clearfix">
                  <div class="library-item__thumb">
                    <router-link :to="{name:'book',params:{books_id:booksItem.books_id}}">
                      <img v-lazy="booksItem.cover_img"
                           class="img-full"
                           lazy="loaded">
                    </router-link>
                  </div>
                  <div class="library-item__body">

                    <router-link class="library-item__title"
                                 :to="{name:'book',params:{books_id:booksItem.books_id}}">
                      {{booksItem.title}}
                      <span class="free"
                            :class="Number(booksItem.is_free)===isFree.free?'yes':''">{{isFreeText[booksItem.is_free]}}</span>
                    </router-link>

                    <div class="library-item__info">
                      <span><i class="el-icon-view"></i> {{booksItem.read_count||0}}
                      </span><span style="margin-left: 8px;">
                        <i class="el-icon-notebook-2"></i> {{booksItem.bookCount||0}}
                      </span>
                      <span class="attention"
                            v-if="~[statusList.reviewSuccess,statusList.freeReview].indexOf(booksItem.status)&&personalInfo.islogin"
                            @click="collectBooks(booksItem.books_id)"
                            :class="{'active':isCollect(booksItem).status}">{{isCollect(booksItem).text}}</span>
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
            <Page :total="Number(books.booksList.count)"
                  :pageSize="Number(books.booksList.pageSize)"
                  :page="Number($route.query.page)||1"
                  @pageChange="pageChange"></Page>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { share, baidu, google } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
import websiteNotice from '../Parts/websiteNotice'
import googleMixin from '@mixins/google'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText,
  payTypeText,
  isFree,
  isFreeText,
  modelType
} from '@utils/constant'


export default {
  name: "books",
  mixins: [googleMixin], //混合谷歌分析 
  metaInfo () {
    return {
      title: `小书-${this.website.meta.website_name}`,
      meta: [
        {
          // set meta
          name: "description",
          content: `小书-${this.website.meta.website_name}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("articleColumn/GET_ARTICLE_COLUMN_ALL"),
      store.dispatch('books/GET_BOOKS_LIST', {
        page: route.query.page || 1,
        columnEnName: route.params.columnEnName || '',
        tagId: route.query.tagId || '',
        sort: route.query.sort || '',
      })
    ]);
  },
  data () {
    return {
      childNavItem: '',
      isFree,
      isFreeText,
      modelType,
      statusList,
      statusListText,
    };
  },
  created () {
    this.initColumn()
  },
  watch: {
    $route (to, from) {
      this.initColumn()
    }
  },
  methods: {
    initColumn () {
      if (this.$route.params.columnEnName && this.$route.params.columnEnName !== 'all') {
        this.switchColumn(this.$route.params.columnEnName)
      } else {
        this.childNavItem = {}
      }
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
    createBook () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
      } else {
        this.$router.push({ name: 'booksWrite', params: { type: 'create' } })
      }
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
    switchColumn (val) {
      this.articleColumn.homeColumn.map(item => {
        if (item.en_name === val) {
          this.childNavItem = item || {}
        }
      })
    },
    sortMenu (sort) {
      let query = {
      }
      if (sort) {
        query.sort = sort
      }
      if (this.$route.query.tagId) {
        query.tagId = this.$route.query.tagId
      }
      return query
    },
    shareChange (val) { // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') { // 新浪
        share.shareToXl(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qzone') { // qq空间
        share.shareToQq(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qq') { // qq空间
        share.shareQQ(val.data.name, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      }
    },
    pageChange (val) {
      let query = {
        page: val
      }
      if (this.$route.query.tagId) {
        query.tagId = this.$route.query.tagId
      }
      if (this.$route.query.sort) {
        query.sort = this.$route.query.sort
      }
      this.$router.push({
        name: 'books',
        params: { columnEnName: this.$route.params.columnEnName },
        query
      })
    }
  },
  computed: {
    ...mapState(['website', 'books', 'articleColumn', 'personalInfo'])
  },
  components: {
    websiteNotice,
    Page
  }
};
</script>

<style scoped lang="scss">
.books {
  .books-menu {
    padding: 20px;
    margin-bottom: 10px;
    .column-menu {
      .nav-item-view {
        .nav-item {
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 8px;
          a {
            display: block;
            border: 1px solid #fff;
            padding: 2px 10px;
            font-size: 14px;
            &.current-active {
              color: #fd763a;
              font-weight: bold;
              border-bottom: 1px solid #fd763a;
            }
          }
        }
      }
    }

    .menu-main {
      border-top: 1px solid rgba(178, 186, 194, 0.15);
      padding: 15px 0 0;
      border-radius: 3px;
      margin-top: 15px;
      .column-tag-menu {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        .nav-item-view {
          .nav-item {
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 8px;
            a {
              display: block;
              border: 1px solid #e0e0e0;
              padding: 2px 10px;
              font-size: 14px;
              border-radius: 20px;
            }
            &.active {
              a {
                background: #fd763a;
                color: #fff;
                border: 1px solid #fd763a;
              }
            }
          }
        }
      }

      .sort-list-menu {
        display: block;
        padding-bottom: 15px;
        .nav-item {
          align-items: center;
          line-height: 1;
          position: relative;
          display: inline-block;
          font-size: 13px;
          margin-right: 15px;
          &.exact-active {
            color: #ea6f5a;
          }
        }
        .add-book {
          float: right;
          color: rgba(0, 0, 0, 0.88);
          background: #b7d6ec;
          border: 1px solid #b7d6ec;
          cursor: pointer;
          padding: 5px 12px;
          border-radius: 3px;
        }
      }
    }
  }

  .library-item {
    margin-bottom: 10px;
    padding: 16px;
    background: #fff;
    transition: all 0.3s ease;
    border-radius: 2px;
    box-sizing: border-box;
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
        height: 48px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 22px;
        font-weight: 700;
        word-break: break-all;
        display: -webkit-box;
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