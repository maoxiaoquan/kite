<template>
  <div class="books">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">

          <div class="books-menu">

            <nav class="column-menu">
              <ul class="nav-item-view">
                <li class="nav-item">
                  <router-link :to="{name:'books',params:{columnEnName:'all'}}">热门</router-link>
                </li>
                <li class="nav-item"
                    v-for="column_item in articleColumn.homeColumn"
                    :key="column_item.article_column_id">
                  <router-link :to="{name:'books',params:{columnEnName:column_item.article_column_en_name}}">
                    {{column_item.article_column_name}}
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
                  <!-- <li class="nav-item">
                    <router-link :to="{name:'books',params:{columnEnName:$router.params.columnEnName||''}}">
                      全部
                    </router-link>
                  </li> -->
                  <li class="nav-item"
                      v-for="(item,key) in childNavItem.tag"
                      :key="key"
                      :class="{'active':item.article_tag_id===$route.query.tagId}">
                    <router-link :to="{name:'books',query:{tagId:item.article_tag_id}}">
                      {{item.article_tag_name}}
                    </router-link>
                  </li>
                </ul>
              </nav>

              <nav class="sort-list-menu">
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('')}">热门</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('new')}">最新</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('30day')}">近30天</router-link>
                <router-link class="nav-item"
                             :to="{name:'books',query:sortMenu('7day')}">近7天</router-link>
              </nav>
            </div>

          </div>

          <div class="books-list row">
            <div class="col-xs-4 col-sm-4 col-md-4"
                 v-for="(booksItem,key) in books.booksList.list"
                 :key="key">
              <div class="library-item bbt-clearfix">
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
                                 :to="{name:'book',params:{books_id:booksItem.books_id}}">
                      {{booksItem.name}}
                    </router-link>
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

        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <website-notice />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
import websiteNotice from '../Parts/websiteNotice'
export default {
  metaInfo () {
    return {
      title: `专栏-${this.website.meta.website_name}`,
      meta: [
        {
          // set meta
          name: "description",
          content: `专栏-${this.website.meta.website_name}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  name: "books",
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("articleColumn/GET_ARTICLE_COLUMN"),
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
      childNavItem: ''
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
    switchColumn (val) {
      this.articleColumn.homeColumn.map(item => {
        console.log(item.article_column_en_name, val)
        if (item.article_column_en_name === val) {
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
    pagination () {
      // 分页
      return Math.ceil(this.books.booksList.count / this.books.booksList.pageSize);
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
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
    .column-menu {
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
            border-radius: 3px;
            &.current-active {
              background: #fd763a;
              color: #fff;
              border: 1px solid #fd763a;
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
        display: flex;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
        .nav-item {
          align-items: center;
          line-height: 1;
          position: relative;
          display: flex;
          font-size: 13px;
          margin-right: 15px;
          &.exact-active {
            color: #ea6f5a;
          }
        }
      }
    }
  }
  .books-list {
    padding-top: 40px;
  }

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
</style>