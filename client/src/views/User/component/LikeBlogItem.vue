<template>
  <div class="user-article-blog-item">

    <template v-if="articleBlogItem.articleBlog">
      <div class="user-article-blog-top">
        <router-link class="article-blog-icon"
                     :to="{name:'articleBlog',params:{blogId:articleBlogItem.articleBlog.blog_id}}">
          <img v-lazy="articleBlogItem.articleBlog.icon"
               class="article-blog-icon-img"
               alt="">
        </router-link>

        <div class="user-article-blog-info">
          <div class="info-content">
            <router-link class="name"
                         :to="{name:'articleBlog',params:{blogId:articleBlogItem.articleBlog.blog_id}}">
              {{articleBlogItem.articleBlog.name}}
            </router-link>
          </div>
        </div>

      </div>

      <div class="user-article-blog-main">
        <ul class="user-info">
          <li class="item item-icon read-count">
            <img v-lazy="articleBlogItem.user.avatar"
                 class="user-avatar"
                 alt="">
            <router-link :to='{name:"user",params:{uid:articleBlogItem.user.uid}}'
                         class="nickname">{{articleBlogItem.user.nickname}}</router-link>
          </li>
          <li class="item item-icon">
            <span class="time">{{setBlogTime(articleBlogItem.articleBlog)}}</span>
          </li>
        </ul>
        <p class="description">介绍：{{articleBlogItem.articleBlog.description||'暂时没有简介，输入简介更直观表达专栏内容'}}</p>
      </div>

      <div class="user-article-blog-footer">
        <ul class="statistics">
          <li class="item item-icon">
            <i class="el-icon-document"></i>
            <span v-text="articleBlogItem.articleCount||0"></span>
          </li>
          <li class="item item-icon read-count">
            <i class="el-icon-view"></i>
            <span v-text="articleBlogItem.read_count||0"></span>
          </li>
          <li class="item item-icon like-article">
            <i class="el-icon-star-off"></i>
            <span v-text="articleBlogItem.likeCount||0"></span>
          </li>
          <li class="item attention"
              v-if="~[statusList.reviewSuccess,statusList.freeReview].indexOf(articleBlogItem.articleBlog.status)&&personalInfo.islogin"
              @click="setLikeArticleBlog(articleBlogItem)">
            <span>取消收藏</span>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="user-article-blog-null">
        <span class="info">此专栏暂时不可见，原因有，1.专栏主人正在装修专栏中，2.由于未知原因，专栏被个人或者官方下架，你可以等待，或者点击下方的</span>
        <span class="cancel-attention"
              @click="setLikeArticleBlog(articleBlogItem)">取消关注</span>
      </div>
    </template>

  </div>
</template>


<script>
import { share } from '@utils'
import { mapState } from 'vuex'
import { Page } from "@components";
import {
  statusList,
  statusListText,
  modelType
} from '@utils/constant'



export default {
  name: "articleBlogItem",
  data () {
    return {
      statusList,
      modelType
    }
  },
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
    setLikeArticleBlog (articleBlogItem) { // 用户关注blog
      this.$store.dispatch('common/SET_COLLECT', {
        associate_id: articleBlogItem.associate_id,
        type: modelType.article_blog
      })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message);
            this.$emit('changeLike')
          } else {
            this.$message.warning(result.message);
          }
        })
    },
    setBlogTime (item) { // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },
  },
  computed: {
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
  height: 220px;
  padding: 20px;
  border: 1px solid #f0f0f0;
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
      height: 42px;
    }
    .user-info {
      margin-bottom: 10px;
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

  .user-article-blog-footer {
    .statistics {
      li {
        display: inline-block;
        font-size: 12px;
        color: #999;

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
          padding: 2px 3px;
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
            border-radius: 3px;
            border: 1px solid #e0e0e0;
            line-height: 12px;
            padding: 1px 3px;
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
  .user-article-blog-null {
    .info {
      font-size: 13px;
      display: block;
    }
    .cancel-attention {
      width: 100px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      font-size: 13px;
      border: 1px solid #e0e0e0;
      color: #666;
      display: block;
      margin: 10px auto 0;
    }
  }
}
</style>

