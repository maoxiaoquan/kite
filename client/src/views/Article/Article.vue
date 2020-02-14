<template>
  <section class="article layout-content container">
    <div class="article-lay row">
      <div class="col-xs-12 col-sm-8--4 col-md-8--4">

        <main class="main client-card">
          <div class="article-view"
               v-if="article.aid">
            <div class="article-title">
              <h1>{{ article.title }}</h1>
              <div class="author">
                <router-link :to="{
                  name: 'user',
                  params: { uid: article.user.uid, routeType: 'article' }
                }"
                             class="avatar">
                  <img v-lazy="article.user.avatar"
                       alt />
                </router-link>
                <div class="info">
                  <div class="name">
                    <router-link :to="{
                      name: 'user',
                      params: { uid: article.user.uid, routeType: 'article' }
                    }">{{ article.user.nickname }}</router-link>
                  </div>
                  <!-- 文章数据信息 -->
                  <div class="meta">
                    <span class="publish-time">{{ article.create_dt }}</span>
                    <span class="views-count">阅读 {{ article.read_count }}</span>
                    <span class="comments-count">评论 {{ article.comment_count }}</span>
                    <span class="likes-count">点赞 {{ article.thumb_count }}</span>
                    <span class="source">{{ sourceTypeList[article.source] }}
                      {{ articleTypeList[article.type] }}</span>
                  </div>
                </div>
              </div>
            </div>
            <article class="article-content box-article-view"
                     v-html="article.content"></article>

            <div class="show-foot clearfix">
              <div class="copyright">© 著作权归作者所有</div>
            </div>

            <div class="meta-bottom clearfix">
              <div class="meta-bottom-item like"
                   @click="onUserThumbArticle"
                   :class="{ active: isThumb(article) }">
                <i :class="
                  isThumb(article) ? 'el-icon-thumb' : 'el-icon-thumb'
                "></i>
              </div>
              <div class="meta-bottom-item share">
                <Dropdown>
                  <div class="el-dropdown-link"
                       slot="button">
                    <i class="el-icon-share"></i>
                  </div>
                  <div class="dropdown-menu-view">
                    <div class="dropdown-menu-item"
                         @click="shareChange({ type: 'qq', data: article })">
                      分享到QQ
                    </div>
                    <div class="dropdown-menu-item"
                         @click="shareChange({ type: 'sina', data: article })">
                      分享到新浪
                    </div>
                    <div class="dropdown-menu-item"
                         @click="shareChange({ type: 'qzone', data: article })">
                      分享到QQ空间
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
            <!--article footer end-->
            <!--文章评论-->
            <ArticleComment />
          </div>
          <p class="no-aricle"
             v-else>文章不存在</p>
        </main>
      </div>
      <div class="col-xs-12 col-sm-3--6 col-md-3--6 aside">
        <ArticleAside />
      </div>
    </div>
  </section>
  <!--home-lay layout-content end-->
</template>

<script>
import ArticleComment from '@views/Comment/ArticleComment'
import ArticleAside from '@views/Article/component/ArticleAside'
import { share, baidu, google } from '@utils'
import { mapState } from 'vuex'
import googleMixin from '@mixins/google'
import { Dropdown } from '@components'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText,
  modelType
} from '@utils/constant'
export default {
  name: 'Article',
  mixins: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: this.article.title || '',
      titleTemplate: `%s - ${this.website.meta.website_name || ''}`,
      meta: [
        {
          // set meta
          name: 'description',
          content: `${this.article.excerpt || ''}`
        },
        {
          // og:site_name
          property: 'og:site_name',
          content: this.website.meta.website_name
        },
        {
          // og:site_name
          property: 'og:image',
          content: this.article.cover_img || this.website.meta.logo
        },
        {
          // og:type
          property: 'og:type',
          content: `article`
        },
        {
          // og:title
          property: 'og:title',
          content: this.article.title
        },
        {
          // og:description
          property: 'og:description',
          content: this.article.excerpt
        },
        {
          // og:url
          property: 'og:url',
          content: `${this.website.meta.domain_name}/p/${this.article.aid}`
        }
      ],
      htmlAttrs: {
        lang: 'zh'
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config,
          random: this.article.aid
        }),
        ...google.statisticsCode({
          route: this.$route,
          googleCode: this.website.config.googleCode,
          random: this.$route.params.blogId
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  asyncData ({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch('article/GET_ARTICLE', { aid: route.params.aid, accessToken })
    ])
  },
  data () {
    return {
      sourceTypeList: ['', '原创', '转载'],
      articleTypeList: articleTypeText
    }
  },
  methods: {
    getArticle () {
      this.$store.dispatch('article/GET_ARTICLE', {
        aid: this.$route.params.aid
      })
    },
    isThumb (item) {
      // 是否收藏
      if (this.personalInfo.islogin) {
        if (
          this.user.associateInfo.articleThumdId &&
          ~this.user.associateInfo.articleThumdId.indexOf(item.aid)
        ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    onUserThumbArticle () {
      /*用户like 文章*/
      this.$store
        .dispatch('common/SET_THUMB', {
          associate_id: this.article.aid,
          type: modelType.article
        })
        .then(result => {
          if (result.state === 'success') {
            this.$store.dispatch('user/GET_ASSOCIATE_INFO')
          } else {
            this.$message.warning(result.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    shareChange (val) {
      // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') {
        // 新浪
        share.shareToXl(
          val.data.title,
          urlOrigin + '/p/' + val.data.aid,
          this.website.meta.logo
        )
      } else if (val.type === 'qzone') {
        // qq空间
        share.shareToQq(
          val.data.title,
          urlOrigin + '/p/' + val.data.aid,
          this.website.meta.logo
        )
      } else if (val.type === 'qq') {
        // qq空间
        share.shareQQ(
          val.data.title,
          urlOrigin + '/p/' + val.data.aid,
          this.website.meta.logo
        )
      }
    }
  },
  computed: {
    article () {
      return this.$store.state.article.article || {}
    },
    ...mapState(['website', 'personalInfo', 'user'])
  },
  components: {
    ArticleComment,
    Dropdown,
    ArticleAside
  }
}
</script>

<style scoped lang="scss">
.article.layout-content {
  margin-bottom: 12px;
  .main {
    width: 100%;
    flex: 1;
    padding: 30px;
    .article-view {
      .article-title {
        margin-bottom: 40px;
        > h1 {
          text-align: left;
          max-width: 100%;
          margin-top: 15px;
          margin-bottom: 10px;
          position: static;
          color: #48494d;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.3;
        }
        .author {
          margin: 30px 0 40px;
          .avatar {
            width: 48px;
            height: 48px;
            vertical-align: middle;
            display: inline-block;
            img {
              width: 100%;
              height: 100%;
              border: 1px solid #ddd;
              border-radius: 50%;
            }
          }
          .info {
            vertical-align: middle;
            display: inline-block;
            margin-left: 8px;
            .name {
              margin-right: 3px;
              font-size: 16px;
              vertical-align: middle;
            }
            .follow {
              padding: 0 7px 0 5px;
              font-size: 12px;
              border-color: #42c02e;
              border-radius: 40px;
              color: #fff;
              background-color: #42c02e;
              line-height: 1;
              &.active {
                background: #999999;
                border-color: #999999;
              }
            }
            .meta {
              margin-top: 5px;
              font-size: 12px;
              color: #969696;
              span {
                padding-right: 5px;
              }
              .source {
                background: #ea6f5a;
                padding: 1px 5px;
                border-radius: 3px;
                color: #fff;
              }
            }
          }
        }
      }
      .support-author {
        min-height: 144px;
        padding: 20px 0;
        text-align: center;
        clear: both;
        p {
          padding: 0 30px;
          margin-bottom: 20px;
          min-height: 24px;
          font-size: 17px;
          font-weight: 700;
          color: #969696;
        }
        .btn-pay {
          margin-bottom: 20px;
          padding: 8px 25px;
          font-size: 16px;
          color: #fff;
          background-color: #ea6f5a;
          border-radius: 20px;
        }
      }
      .show-foot {
        margin-bottom: 30px;
        .copyright {
          float: right;
          margin-top: 5px;
          font-size: 12px;
          line-height: 1.7;
          color: #c8c8c8;
        }
        .modal-wrap {
          float: right;
          margin-top: 5px;
          margin-right: 20px;
          font-size: 12px;
          line-height: 1.7;
          > a {
            color: #c8c8c8;
          }
        }
      }
      .meta-bottom {
        margin-top: 40px;
        margin-bottom: 80px;
        text-align: center;
        .meta-bottom-item {
          display: inline-block;
          width: 45px;
          height: 45px;
          line-height: 45px;
          border: 1px solid #e0e0e0;
          text-align: center;
          margin: 0 8px;
          cursor: pointer;
          border-radius: 90px;
          i {
            font-size: 18px;
            color: #333;
          }
          &.active {
            border: 1px solid #e67e7e;
            i {
              color: #e67e7e;
            }
          }
        }
      }
      .share-group {
        float: right;
        margin-top: 6px;
        .share-circle {
          width: 50px;
          height: 50px;
          margin-left: 5px;
          text-align: center;
          border: 1px solid #dcdcdc;
          border-radius: 50%;
          vertical-align: middle;
          display: inline-block;
          position: relative;
        }
        .more-share {
          width: auto;
          padding: 4px 18px;
          font-size: 14px;
          color: #9b9b9b;
          line-height: 40px;
          border-radius: 50px;
        }
      }
    }
  }
  .no-aricle {
    width: 100%;
    padding: 30px;
    border-radius: 5px;
    background: #ea6f5a;
    color: #fff;
    text-align: center;
    font-size: 25px;
    margin: 20px 0;
  }
}
</style>
