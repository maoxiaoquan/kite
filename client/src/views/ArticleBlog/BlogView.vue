<template>
  <div class="article-blog">

    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">

          <div class="article-blog-view client-card">

            <div class="article-blog-header">
              <div class="user-article-blog-top">
                <div class="article-blog-icon">
                  <img class="box-image"
                       v-lazy="articleBlog.blogInfo.icon"
                       alt="">
                </div>

                <div class="user-article-blog-info">
                  <div class="info-content">
                    <div class="name">
                      {{articleBlog.blogInfo.name}}
                    </div>
                    <ul class="statistics">
                      <li class="item item-icon like-article">
                        <i class="el-icon-document"></i>
                        <span class="article-count"> {{articleBlog.blogInfo.articleCount}}</span>
                      </li>
                      <li class="item item-icon read-count">
                        <i class="el-icon-view"></i>
                        <span v-text="articleBlog.blogInfo.read_count||0"></span>
                      </li>
                      <li class="item item-icon like-article">
                        <i class="el-icon-star-off"></i>
                        <span v-text="articleBlog.blogInfo.likeCount||0"></span>
                      </li>
                      <li class="item attention"
                          v-if="~[2,4].indexOf(Number(articleBlog.blogInfo.status))&&personalInfo.islogin"
                          @click="setLikeArticleBlog(articleBlog.blogInfo.blog_id)">
                        <span :class="{'active':isCollect(articleBlog.blogInfo).status}">{{isCollect(articleBlog.blogInfo).text}}</span>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>

              <div class="user-article-blog-tag">
                <div class="title">所属标签:
                  <template v-if="articleBlog.blogInfo.tag">
                    <router-link v-for="(itemArticleTag,key) in articleBlog.blogInfo.tag"
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

              <div class="user-article-blog-main">
                <p class="description">介绍：{{articleBlog.blogInfo.description||'暂时没有简介，输入简介更直观表达专栏内容'}}</p>
                <ul>
                  <li class="item item-icon read-count">
                    <img class="user-avatar"
                         v-lazy="articleBlog.blogInfo.user.avatar"
                         alt="">
                    <router-link :to='{name:"user",params:{uid:articleBlog.blogInfo.user.uid}}'
                                 class="nickname">{{articleBlog.blogInfo.user.nickname}}</router-link>
                  </li>
                  <li class="item item-icon">
                    <span class="time">{{setBlogTime(articleBlog.blogInfo)}}</span>
                  </li>
                </ul>
              </div>

            </div>

            <div class="article-blog-main">
              <div class="article-view">
                <div class="article-item"
                     v-for="(item,key) in articleBlog.blogArticleList.list"
                     :key="key">
                  <blogArticleItem :articleItem="item"
                                   :key="key" />
                </div>
              </div>
              <Page :total="Number(articleBlog.blogArticleList.count)"
                    :pageSize="Number(articleBlog.blogArticleList.pageSize)"
                    :page="Number($route.query.page)||1"
                    @pageChange="pageChange"></Page>
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
import { mapState } from 'vuex'
import { Page } from '@components'
import blogArticleItem from './component/blogArticleItem'
import websiteNotice from '@views/Parts/websiteNotice'
import { share, baidu, google } from '@utils'
import googleMixin from '@mixins/google'
import {
  modelType
} from '@utils/constant'
export default {
  name: "ArticleBlogView",
  mixins: [googleMixin], //混合谷歌分析  
  metaInfo () {
    return {
      title: this.articleBlog.blogInfo.name + '-' + this.website.meta.website_name || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.articleBlog.blogInfo.description || this.articleBlog.blogInfo.name}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config,
          random: this.$route.params.blogId
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: this.$route.params.blogId
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("articleBlog/GET_ARTICLE_BLOG_INFO", { blogId: route.params.blogId }),
      store.dispatch("articleBlog/GET_ARTICLE_BLOG_ARTICLE_LIST", { blogId: route.params.blogId }),
    ]);
  },
  data () {
    return {
      modelType
    }
  },
  methods: {
    setBlogTime (item) { // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },
    pageChange (val) {
      this.$router.push({
        name: 'articleBlog',
        params: {
          blogId: this.$route.params.blogId,
        },
        query: {
          page: val
        }
      })
    },
    shareChange (val) { // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') { // 新浪
        share.shareToXl(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qzone') { // qq空间
        share.shareToQq(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qq') { // qq空间
        share.shareQQ(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      }
    },
    setLikeArticleBlog (blog_id) { // 用户关注blog
      this.$store.dispatch('common/SET_COLLECT', {
        associate_id: blog_id,
        type: modelType.article_blog
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
    isCollect (item) { // 是否like
      let likeUserIds = []
      item.likeUserIds.map(item => {
        likeUserIds.push(item.uid)
      })
      if (~likeUserIds.indexOf(Number(this.personalInfo.user.uid))) {
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
    },
  },
  computed: {
    ...mapState(['website', 'articleBlog', 'personalInfo'])
  },
  components: {
    websiteNotice,
    blogArticleItem,
    Page
  }
};
</script>

<style scoped lang="scss">
.article-blog {
  .article-blog-view {
  }
  .article-blog-header {
    padding: 24px;
    overflow: hidden;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
    .user-article-blog-top {
      display: flex;
      .article-blog-icon {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        .article-blog-icon-img {
          width: 100%;
          height: 100%;
        }
      }
      .user-article-blog-info {
        flex: 1;
        padding-left: 10px;
        .info-content {
          .name {
            color: #333;
            font-size: 13px;
            &:hover {
              color: #0c7d9d;
            }
          }
          .statistics {
            li {
              display: inline-block;

              span {
                display: inline-block;
                font-size: 12px;
                color: #999;
                margin-right: 5px;
                vertical-align: middle;
              }
              i {
                font-size: 14px;
                color: #999;
              }
              .type {
                font-size: 12px;
                display: inline-block;
                margin-left: 3px;
              }
              .type {
                background: #fd763a;
                color: #fff;
                border-radius: 10px;
                line-height: 15px;
                padding: 1px 3px;
                &.true {
                  background: #41b883;
                }
              }
              &.attention {
                cursor: pointer;
                span {
                  font-size: 12px;
                  display: inline-block;
                  margin-left: 3px;
                  color: #333;
                  border-radius: 10px;
                  border: 1px solid #e0e0e0;
                  line-height: 15px;
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
        }
      }
      .operat-view {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 10px;
        right: 15px;
        text-align: center;
        cursor: pointer;
      }
    }
    .user-article-blog-tag {
      padding-top: 5px;
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
    .user-article-blog-main {
      // border-top: 1px dashed rgba(0, 0, 0, 0.08);
      margin-top: 8px;
      .description {
        font-size: 12px;
        background: #f3f3f3;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.56);
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 6px;
      }
      .item {
        display: inline-block;
        color: #b3bac1;
        font-size: 12px;
        &:after {
          display: inline-block;
          content: "\B7";
          margin: 0 1px;
          color: #b2bac2;
        }
        &:last-of-type {
          &:after {
            content: "";
          }
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 20px;
          vertical-align: middle;
          margin-right: 1px;
        }
        strong {
          font-weight: normal;
        }
        .nickname {
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
          color: #777;
          text-overflow: ellipsis;
          display: inline-block;
          vertical-align: middle;
        }
        .time {
          font-size: 12px;
        }
      }
    }
  }
  .article-blog-line {
    height: 20px;
    background: #f3f3f3
      linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      )
      center / 40px 40px;
  }
  .article-blog-main {
    overflow: hidden;
    padding: 0 20px 20px;
    .article-view {
      /deep/ .article-item {
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      }
    }
  }
  .article-blog-null-public {
    .info {
      text-align: center;
      font-size: 14px;
      padding: 15px;
      color: #666;
    }
  }
}
</style>