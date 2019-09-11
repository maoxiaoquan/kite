<template>
  <div class="article-blog">

    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8">

          <div class="article-blog-header">
            <div class="user-article-blog-top">
              <router-link class="article-blog-icon"
                           :to="{name:'articleBlog',params:{blogId:articleBlog.blogInfo.blog_id}}">
                <el-image class="article-blog-icon-img"
                          :src="articleBlog.blogInfo.icon"
                          lazy></el-image>
              </router-link>

              <div class="user-article-blog-info">
                <div class="info-content">
                  <router-link class="name"
                               :to="{name:'articleBlog',params:{blogId:articleBlog.blogInfo.blog_id}}">
                    {{articleBlog.blogInfo.name}}
                    <span class="article-count"> {{articleBlog.blogInfo.articleCount}}</span>
                  </router-link>
                  <ul class="statistics">
                    <li class="item item-icon read-count">
                      <i class="el-icon-reading"></i>
                      <span v-text="articleBlog.blogInfo.read_count||0"></span>
                    </li>
                    <li class="item item-icon like-article">
                      <i class="el-icon-star-off"></i>
                      <span v-text="articleBlog.blogInfo.likeCount||0"></span>
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
                               :to="{name:'article_tag',params:{article_tag_en_name:itemArticleTag.article_tag_en_name}}">{{itemArticleTag.article_tag_name}}</router-link>
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
                  <el-image class="user-avatar"
                            :src="articleBlog.blogInfo.user.avatar"
                            lazy></el-image>
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
            <div class="list-container">
              <div class="article-view">
                <div class="article-item"
                     v-for="(item,key) in articleBlog.blogArticleList.list"
                     :key="key">
                  <blogArticleItem :articleItem="item"
                                   :key="key" />
                </div>
              </div>
              <Page :count="pagination"
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
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from '@components'
import blogArticleItem from './component/blogArticleItem'
import websiteNotice from '@views/Parts/websiteNotice'
export default {
  metaInfo () {
    return {
      title: this.articleBlog.blogInfo.name || "",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.articleBlog.blogInfo.name || ""}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  name: "ArticleBlogView",
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("articleBlog/GET_ARTICLE_BLOG_INFO", { blogId: route.params.blogId }),
      store.dispatch("articleBlog/GET_ARTICLE_BLOG_ARTICLE_LIST", { blogId: route.params.blogId }),
    ]);
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
    }
  },
  computed: {
    pagination () { // 分页
      return Math.ceil(this.articleBlog.blogArticleList.count / this.articleBlog.blogArticleList.pageSize)
    },
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
  .article-blog-header {
    box-shadow: 0 0 3px rgba(67, 38, 100, 0.15);
    background: #f8f8f8;
    overflow: hidden;
    transition: all 0.3s ease;
    border-radius: 3px;
    padding-bottom: 12px;
    position: relative;
    display: block;
    height: 250px;
    padding: 24px;
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
            .article-count {
              display: inline-block;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.88);
              background: #ffd600;
              border-radius: 4px;
              padding: 0 6px;
              margin-left: 10px;
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
      border-top: 1px dashed rgba(0, 0, 0, 0.08);
      padding-top: 8px;
      margin-top: 8px;
      .description {
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.56);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        height: 56px;
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
          width: 50px;
          display: inline-block;
          vertical-align: middle;
        }
        .time {
          font-size: 12px;
        }
      }
    }
  }
  .article-blog-main {
  }
}
</style>