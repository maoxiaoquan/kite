<template>
  <div class="user-article-blog-item clinet-card">

    <div class="user-article-blog-top">
      <router-link class="article-blog-icon"
                   :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">
        <el-image class="article-blog-icon-img"
                  :src="articleBlogItem.icon"
                  lazy></el-image>
      </router-link>

      <div class="user-article-blog-info">
        <div class="info-content">
          <router-link class="name"
                       :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">
            {{articleBlogItem.name}}
          </router-link>

          <div class="statistics-info">
            <ul class="statistics">
              <li class="item item-icon like-article">
                <i class="el-icon-document"></i>
                <span class="article-count"> {{articleBlogItem.articleCount}}</span>
              </li>
              <li class="item item-icon read-count">
                <i class="el-icon-view"></i>
                <span v-text="articleBlogItem.read_count||0"></span>
              </li>
              <li class="item item-icon like-article">
                <i class="el-icon-star-off"></i>
                <span v-text="articleBlogItem.likeCount||0"></span>
              </li>
              <li class="item item-icon like-article">
                <span class="attention"
                      v-if="~[2,4].indexOf(articleBlogItem.status)&&personalInfo.islogin&&articleBlogItem.is_public"
                      @click="setLikeArticleBlog(articleBlogItem.blog_id)"
                      :class="{'active':isLike(articleBlogItem).status}">{{isLike(articleBlogItem).text}}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>

    <div class="user-article-blog-main">
      <p class="description">介绍：{{articleBlogItem.description||'暂时没有简介，输入简介更直观表达专栏内容'}}</p>
    </div>

    <div class="user-article-blog-tag">
      <div class="title">所属标签:
        <template v-if="articleBlogItem.tag">
          <router-link v-for="(itemArticleTag,key) in articleBlogItem.tag"
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

    <div class="user-article-blog-footer">
      <ul class="user-info">
        <li class="item item-icon read-count">
          <el-image class="user-avatar"
                    :src="articleBlogItem.user.avatar"
                    lazy></el-image>
          <router-link :to='{name:"user",params:{uid:articleBlogItem.user.uid}}'
                       class="nickname">{{articleBlogItem.user.nickname}}</router-link>
        </li>
        <li class="item item-icon">
          <span class="time">{{setBlogTime(articleBlogItem)}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
export default {
  name: "articleBlogItem",
  props: ['articleBlogItem'],
  methods: {
    shareChange (val) { // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') { // 新浪
        share.shareToXl(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qzone') { // qq空间
        share.shareToQq(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      } else if (val.type === 'qq') { // qq
        share.shareQQ(val.data.title, urlOrigin + '/p/' + val.data.aid, this.website.meta.logo)
      }
    },
    setBlogTime (item) { // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },
    setLikeArticleBlog (blog_id) { // 用户关注blog
      this.$store.dispatch('articleBlog/LIKE_ARTICLE_BLOG', {
        blog_id,
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
    isLike (item) { // 是否like
      let likeUserIds = []
      item.likeUserIds.map(item => {
        likeUserIds.push(item.uid)
      })
      if (~likeUserIds.indexOf(Number(this.personalInfo.user.uid))) {
        return {
          status: true,
          text: '已关注'
        }
      } else {
        return {
          status: false,
          text: '关注'
        }
      }
    },
  },
  computed: {
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
    ...mapState(['website', 'personalInfo'])
  },
  components: {
    Page
  }
};
</script>

<style scoped lang="scss">
.user-article-blog-item {
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 25px;
  border-radius: 3px;
  padding-bottom: 12px;
  position: relative;
  display: block;
  height: 215px;
  padding: 15px;
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
      position: relative;
      .info-content {
        .name {
          color: #333;
          display: block;
          font-size: 13px;
          line-height: 18px;
          &:hover {
            color: #0c7d9d;
          }
        }
        .statistics-info {
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
    height: 45px;
    .title {
      display: inline-block;
      font-size: 12px;
    }
    a {
      display: inline-block;
      /* background: #fd763a; */
      border: 1px solid #fd763a;
      font-size: 12px;
      color: #fd763a;
      border-radius: 3px;
      line-height: 12px;
      padding: 1px 3px;
      margin-bottom: 5px;
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
      line-height: 18px;
      color: rgba(0, 0, 0, 0.56);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      height: 35px;
    }
  }

  .user-article-blog-footer {
    .user-info {
      margin-bottom: 10px;
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
}
</style>

