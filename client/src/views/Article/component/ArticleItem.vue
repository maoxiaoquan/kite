<template>
  <article class="content-box content-box-index">
    <div class="info-box"
         v-if="articleItem.aid">
      <div class="info-row title-row">
        <router-link class="title"
                     :to="{name:'article',params:{aid:articleItem.aid}}">{{articleItem.title}}</router-link>
      </div>

      <div class="info-row meta-row">
        <ul class="meta-list">
          <li class="item"
              v-if="!articleItem.article_blog">
            <router-link :to="{name:'user',params:{uid:articleItem.user.uid,routeType:'article'}}"
                         class="name">{{articleItem.user.nickname}}</router-link>
          </li>
          <li class="item">
            <time>{{articleItem.create_dt}}</time>
          </li>
          <li class="item item-icon read-count">
            <i class="el-icon-view"></i>
            <strong v-text="articleItem.read_count"></strong>
          </li>
          <li class="item item-icon like-article">
            <i class="el-icon-star-off"></i>
            <strong v-text="articleItem.like_count"></strong>
          </li>
          <li class="item item-icon comment-count">
            <i class="el-icon-chat-dot-round"></i>
            <strong v-text="articleItem.comment_count"></strong>
          </li>
          <li class="item"
              v-if="articleItem.tag_ids">
            <router-link v-for="(itemTag,key) in articleItem.tag"
                         class="tag-class frontend"
                         :key="key"
                         :to="{name:'article_tag',params:{en_name:itemTag.en_name}}">{{itemTag.name}}</router-link>

          </li>
          <li class="item"
              v-if="String(articleItem.type)==='2'">
            {{articleTypeList[String(articleItem.type)]}}
          </li>
        </ul>
      </div>

      <div class="info-row footer-view"
           v-if="articleItem.article_blog">
        <router-link :to="{name:'user',params:{uid:articleItem.user.uid,routeType:'article'}}"
                     class="avatar">
          <img v-lazy="articleItem.user.avatar"
               alt="">
        </router-link>
        <router-link :to="{name:'user',params:{uid:articleItem.user.uid,routeType:'article'}}"
                     class="name">{{articleItem.user.nickname}}</router-link>
        <span>发布于专栏</span>
        <router-link class="article-blog"
                     v-if="articleItem.article_blog"
                     :to="{name:'articleBlog',params:{blogId:articleItem.article_blog.blog_id}}">
          {{articleItem.article_blog.name}}
        </router-link>
        <span class="article-blog"
              v-else>正在审核中的专栏</span>
      </div>

    </div>
    <div class="thumb"
         v-if="articleItem.cover_img">
      <img class="box-image"
           v-lazy="articleItem.cover_img"
           alt="">
    </div>
  </article>
</template>

<script>
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText
} from '@utils/constant'

export default {
  name: "ArticleItem",
  props: {
    articleItem: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      articleTypeList: articleTypeText,
    }
  }
}
</script>

<style scoped lang="scss">
.content-box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 0.8rem 0;
  min-height: 5.75rem;
  .info-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    min-width: 0;
    .title-row {
      margin: 0.5rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .title {
        font-size: 16px;
        letter-spacing: 1px;
        font-weight: 600;
        line-height: 1.2;
        color: #333;
      }
    }
    .content-text {
      font-size: 13px;
      line-height: 24px;
      color: #999;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .meta-row {
      margin-bottom: 5px;
      .meta-list {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: baseline;
        -ms-flex-align: baseline;
        align-items: baseline;
        white-space: nowrap;
        .item {
          display: inline-block;
          color: #b3bac1;
          font-size: 12px;
          &:after {
            display: inline-block;
            content: "\B7";
            margin: 0 4px;
            color: #b2bac2;
          }
          &:last-of-type {
            &:after {
              content: "";
            }
          }
          a,
          span {
            font-size: 12px;
          }
          a {
            color: #b3bac1;
          }
          .tag-class {
            padding: 0.38rem 0;
            font-size: 12px;
            text-align: center;
            line-height: 1;
            border-radius: 2px;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #b3bac1;
            &:after {
              content: "/";
              color: #b3bac1;
              margin: 0 3px;
            }
            &:last-of-type {
              &:after {
                content: "";
              }
            }
          }
        }
        .item-icon {
          display: inline-block;
          font-size: 12px;
          color: #b4b4b4;
          &:hover {
            color: #333;
          }
          strong {
            margin-left: 2px;
            font-weight: normal;
          }
          &.like-article {
            cursor: pointer;
          }
          &.like-article-off {
            color: #00bb29;
          }
        }
      }
    }
    .footer-view {
      display: flex;
      align-items: center;
      span,
      a {
        font-size: 12px;
        display: inline-block;
        color: #999;
        margin-right: 10px;
        line-height: 18px;
      }
      .name,
      .article-blog {
        color: #009a61;
      }
      .avatar {
        margin-right: 6px;
        img {
          width: 26px;
          height: 26px;
          border-radius: 52px;
          overflow: hidden;
        }
      }
    }
  }
  .thumb {
    position: relative;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 7.5rem;
    height: 4.5rem;
    margin-left: 2rem;
    border-radius: 2px;
    .box-image {
      width: 7.5rem;
      height: 4.5rem;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }
  &.article-list {
    padding-left: 0;
    padding-right: 0;
  }
  &.content-box-index {
    .thumb {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 10px;
      .box-image {
        width: 4.5rem;
        height: 4.5rem;
      }
    }
  }

  @media (max-width: 767px) {
    &.content-box-index {
      .thumb {
        display: none;
      }
    }
  }
}
</style>
