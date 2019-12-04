<template>
  <article>
    <div class="content-box content-box-index">
      <div class="thumb"
           v-if="articleItem.cover_img">
        <div class="RichContent-cover">
          <div class="RichContent-cover-inner">
            <img v-lazy="articleItem.cover_img"
                 alt="cover">
          </div>
        </div>
      </div>
      <div class="info-box"
           v-if="articleItem.aid">
        <div class="info-row title-row">
          <router-link class="title"
                       :to="{name:'article',params:{aid:articleItem.aid}}">{{articleItem.title}}</router-link>
        </div>

        <ul class="meta-list">
          <li class="item">
            <router-link :to="{name:'user',params:{uid:articleItem.user.uid,routeType:'article'}}"
                         class="name">{{articleItem.user.nickname}}</router-link>
          </li>
          <li class="item">
            <time>{{articleItem.create_dt}}</time>
          </li>
          <li class="item tag-view"
              v-if="articleItem.tag_ids">
            <router-link v-for="(itemTag,key) in articleItem.tag"
                         class="tag-class frontend"
                         :key="key"
                         :to="{name:'article_tag',params:{en_name:itemTag.en_name}}">{{itemTag.name}}</router-link>

          </li>
        </ul>

      </div>
    </div>

    <div class="ContentItem-actions">

      <button type="button"
              class="Button VoteButton">
        <i class="el-icon-star-off"></i>
        <span>​
        </span>赞 ​​{{articleItem.thumb_count}}
      </button>

      <button type="button"
              class="meta-item ContentItem-action">
        <i class="el-icon-chat-dot-round"></i>
        <span>​​{{articleItem.comment_count}} 条评论</span>
      </button>

      <button type="button"
              class="meta-item ContentItem-action">
        <i class="el-icon-view"></i>
        <span>​{{articleItem.read_count}} 阅读</span>
      </button>

      <button type="button"
              class="meta-item ContentItem-action">
        <i class="el-icon-s-promotion"></i>
        <span>​分享</span>
      </button>

      <router-link class="AnnotationTag"
                   v-if="articleItem.article_blog"
                   :to="{name:'articleBlog',params:{blogId:articleItem.article_blog.blog_id}}">
        {{articleItem.article_blog.name}}
      </router-link>

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
    min-width: 0;
    .title-row {
      margin-bottom: 10px;
      .title {
        color: #1a1a1a;
        font-size: 18px;
        line-height: 28px;
        max-height: 56px;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: 600;
        font-synthesis: style;
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
    }
  }
  .thumb {
    .RichContent-cover {
      position: relative;
      width: 190px;
      height: 105px;
      margin-top: -2px;
      margin-right: 18px;
      margin-bottom: 4px;
      float: left;
      overflow: hidden;
      background-position: 50%;
      background-size: cover;
      border-radius: 4px;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      .RichContent-cover-inner {
        position: absolute;
        top: 50%;
        left: 0;
        height: 100%;
        width: 100%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        overflow: hidden;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          -webkit-transform: translate3d(-50%, -50%, 0);
          transform: translate3d(-50%, -50%, 0);
        }
      }
    }
  }
  &.article-list {
    padding-left: 0;
    padding-right: 0;
  }

  @media (max-width: 577px) {
    &.content-box-index {
      .thumb {
        display: none;
      }
    }
  }
}

.ContentItem-actions {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 10px 20px;
  margin: 0 -20px -10px;
  color: #646464;
  background: #fff;
  clear: both;
  .meta-item {
    display: inline-block;
    padding: 0 16px;
    font-size: 14px;
    line-height: 32px;
    color: #8590a6;
    text-align: center;
    cursor: pointer;
    background: none;
    border: 1px solid;
    border-radius: 3px;
  }

  .ContentItem-action {
    margin-left: 24px;
    font-size: 14px;
    height: auto;
    padding: 0;
    line-height: inherit;
    background-color: transparent;
    border: none;
    border-radius: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .VoteButton {
    padding: 0 10px;
    color: #0084ff;
    font-size: 14px;
    background: rgba(0, 132, 255, 0.1);
    border-color: transparent;
  }
  .AnnotationTag {
    margin-left: auto;
    padding: 0 12px;
    max-width: 136px;
    font-size: 14px;
    line-height: 30px;
    color: grey;
    background-color: #f6f6f6;
    border-radius: 4px;
  }
}
</style>
