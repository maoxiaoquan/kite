<template>
  <article class="article">
    <div class="content-box content-box-index">
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

      <div class="ContentItem-actions">

        <button type="button"
                class="Button VoteButton">
          <i class="el-icon-thumb"></i>
          <span>赞 ​​{{articleItem.thumb_count}}​</span>
        </button>

        <router-link class="meta-item ContentItem-action"
                     v-if="articleItem.article_blog"
                     :to="{name:'articleBlog',params:{blogId:articleItem.article_blog.blog_id}}">
          {{articleItem.article_blog.name}}
        </router-link>

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

      </div>

    </div>

    <div class="thumb"
         v-if="articleItem.cover_img">
      <div class="RichContent-cover">
        <div class="RichContent-cover-inner">
          <img v-lazy="articleItem.cover_img"
               alt="cover">
        </div>
      </div>
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

import { Dropdown } from '@components'
import { share } from '@utils'
import { mapState } from 'vuex'

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
  },
  methods: {
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
  components: {
    'box-drop': Dropdown
  },
  computed: {
    ...mapState(['personalInfo', 'website'])
  },
}
</script>

<style scoped lang="scss">
.article {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  .content-box {
    display: block;
    flex: 1;
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
          font-size: 16px;
          line-height: 25px;
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

  .thumb {
    .RichContent-cover {
      position: relative;
      width: 120px;
      height: 80px;
      margin-top: -2px;
      margin-right: 15px;
      margin-left: 15px;
      float: left;
      overflow: hidden;
      background-position: 50%;
      background-size: cover;
      border-radius: 4px;
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
    @media (max-width: 575px) {
      .RichContent-cover {
        width: 60px;
        height: 60px;
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
    color: #646464;
    background: #fff;
    clear: both;
    margin-top: 10px;
    .meta-item {
      display: inline-block;
      padding: 0 16px;
      font-size: 13px;
      line-height: 32px;
      color: #8590a6;
      text-align: center;
      cursor: pointer;
      background: none;
      border: 1px solid;
      border-radius: 3px;
    }

    .ContentItem-action {
      margin-left: 20px;
      font-size: 13px;
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
      font-size: 13px;
      color: #b2bac2;
      border-radius: 1px;
      border: 1px solid #eaf9e3;
      color: #74cf59;
      background: #eaf9e3;
    }
    .AnnotationTag {
      padding: 0 10px;
      font-size: 13px;
      color: #b2bac2;
      border-radius: 1px;
      border: 1px solid #fd763a21;
      color: #ff700a;
      margin-left: 20px;
      background: #fd763a21;
    }
  }
}
</style>
