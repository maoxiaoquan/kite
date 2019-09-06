<template>
  <section class="article-lay layout-content box-container"
           id="article-lay">
    <div class="container-article">
      <div class="row">
        <main class="lay-main col-xs-12 col-sm-12 col-md-12"
              v-if="article.aid">
          <div class="article-view">
            <div class="article-title">
              <h1>{{article.title }}</h1>
              <div class="author">
                <router-link :to="{name:'user',params:{uid:article.user.uid}}"
                             class="avatar">
                  <img :src="article.user.avatar"
                       alt />
                </router-link>
                <div class="info">
                  <div class="name">
                    <router-link :to="{name:'user',params:{uid:article.user.uid}}">{{article.user.nickname }}</router-link>
                  </div>
                  <!-- 文章数据信息 -->
                  <div class="meta">
                    <span class="publish-time">{{article.create_at}}</span>
                    <span class="views-count">阅读 {{article.read_count}}</span>
                    <span class="comments-count">评论 {{articleComment.count}}</span>
                    <span class="likes-count">喜欢 {{article.like_count}}</span>
                    <span class="source">{{typeList[article.type]}}</span>
                  </div>
                </div>
              </div>
            </div>
            <article class="article-content box-article-view"
                     v-html="article.content"></article>

            <div class="show-foot clearfix">
              <div class="copyright">© 著作权归作者所有</div>
            </div>

            <div class="follow-detail">
              <div class="info">
                <router-link :to="{name:'user',params:{uid:article.user.uid}}"
                             class="avatar">
                  <img :src="article.user.avatar"
                       alt />
                </router-link>
                <a class="btn btn-success follow attention-article"
                   v-if="personalInfo.user.uid !== article.uid"
                   :class="{'active':currUserInfo.attention_uid_arr.indexOf(article.uid)!==-1}"
                   @click="onUserAttention"
                   href="javascript:;">
                  <i class="iconfont icon-tianjia"></i>
                  <span>关注</span>
                </a>
                <router-link :to="{name:'user',params:{uid:article.user.uid}}"
                             class="title">{{article.user.nickname }}</router-link>
                <p>
                  一共有 {{articleUserInfo.user_article_count}} 篇文章 ，被
                  {{articleUserInfo.other_user_attention_count}} 人关注
                </p>
              </div>
              <div class="signature"
                   v-if="article.user.introduction">{{article.user.introduction }}</div>
            </div>

            <div class="meta-bottom clearfix">
              <div class="meta-bottom-item like"
                   @click="onUserLikeArticle"
                   :class="{'active':~currUserInfo.user_like_aid_arr.indexOf(String(article.aid))}">
                <i :class="~currUserInfo.user_like_aid_arr.indexOf(String(article.aid))?'el-icon-star-on':'el-icon-star-off'"></i>
              </div>
              <div class="meta-bottom-item share">
                <el-dropdown trigger="click"
                             @command="shareChange">
                  <div class="el-dropdown-link">
                    <i class="el-icon-share"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{type:'qq',data:article}">分享到QQ</el-dropdown-item>
                    <el-dropdown-item :command="{type:'sina',data:article}">分享到新浪</el-dropdown-item>
                    <el-dropdown-item :command="{type:'qzone',data:article}">分享到QQ空间</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <!--article footer end-->
            <!--文章评论-->
            <ArticleComment />
          </div>
        </main>

        <main class="lay-main col-xs-12 col-sm-12 col-md-12"
              v-else>
          <p class="no-aricle">文章不存在</p>
        </main>
      </div>
    </div>
  </section>
  <!--home-lay layout-content end-->
</template>

<script>
import ArticleComment from "@views/Comment/ArticleComment";
import { share } from '@utils'
import { mapState } from 'vuex'
export default {
  metaInfo () {
    return {
      title: this.article.title || "文章不存在",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.article.excerpt || "文章不存在"}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  name: "Article",
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("article/GET_ARTICLE", { aid: route.params.aid })
    ]);
  },
  data () {
    return {
      typeList: ["", "原创", "转载"],
      currUserInfo: {
        attention_uid_arr: [],
        user_like_aid_arr: []
      },
      articleUserInfo: {
        attention_uid_arr: [],
        user_like_aid_arr: []
      }
    };
  },
  created () {
    if (this.article.aid) {
      this.getCurrUserInfo(); // 获取当前登录用户信息
      this.getArticleUserInfo(); // 获取当前文章用户信息
      /*this.getCommentList()*/ // 获取用户的评论
    }
  },
  methods: {
    getCurrUserInfo () {
      // 获取当前登录用户信息
      var that = this;
      this.$store
        .dispatch("article/GET_USER_INFO_ALL", {
          uid: this.personalInfo.user.uid
        })
        .then(function (res) {
          that.$nextTick(function () {
            if (res.state === "success") {
              that.currUserInfo = res.data;
            }
          });
        });
    },
    getArticleUserInfo () {
      // 获取当前文章用户信息
      var that = this;
      this.$store
        .dispatch("article/GET_USER_INFO_ALL", { uid: this.article.user.uid })
        .then(function (res) {
          that.$nextTick(function () {
            if (res.state === "success") {
              that.articleUserInfo = res.data;
            }
          });
        });
    },
    onUserAttention () {
      /*用户关注用户*/
      this.$store
        .dispatch("user/USER_ATTENTION", {
          attention_uid: this.article.user.uid
        })
        .then(res => {
          if (res.state === "success") {
            this.getCurrUserInfo();
            this.getArticleUserInfo();
            /*获取当前文章用户信息*/
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    onUserLikeArticle () {
      /*用户like 文章*/
      this.$store
        .dispatch("user/USER_LIKE_ARTICLE", {
          aid: this.article.aid,
          uid: this.article.uid
        })
        .then(res => {
          if (res.state === "success") {
            this.getCurrUserInfo();
            if (res.data.type === "like") {
              this.$store.state.article.article.like_count =
                Number(this.$store.state.article.article.like_count) + 1;
            } else if (res.data.type === "cancel") {
              this.$store.state.article.article.like_count -= 1;
            }
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
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
    article () {
      return this.$store.state.article.article || {};
    },
    articleComment () {
      return this.$store.state.articleComment.article_comment || {};
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
    ...mapState(['website'])
  },
  components: {
    ArticleComment
  }
};
</script>

<style scoped lang="scss">
.article-lay.layout-content {
  .lay-main {
    .article-view {
      .article-title {
        margin-bottom: 40px;
        > h1 {
          text-align: left;
          max-width: 100%;
          margin-top: 30px;
          margin-bottom: 20px;
          position: static;
          color: #48494d;
          font-size: 34px;
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
      .follow-detail {
        padding: 20px;
        background: #f7f7f7;
        border-radius: 10px;
        font-size: 12px;
        .info {
          min-height: 47px;
          .avatar {
            float: left;
            margin-right: 10px;
            width: 48px;
            height: 48px;
            img {
              width: 100%;
              height: 100%;
              border: 1px solid #ddd;
              border-radius: 50%;
            }
          }
          .btn {
            float: right;
            margin-top: 4px;
            padding: 8px 0;
            width: 100px;
            font-size: 16px;
            line-height: 1.2;
            border-radius: 20px;
            color: #fff;
            border-color: #42c02e;
            background: #42c02e;
            &.active {
              background: #999999;
              border-color: #999999;
            }
          }
          .title {
            margin-right: 3px;
            font-size: 17px;
            line-height: 1.8;
            vertical-align: middle;
          }
          p {
            margin-bottom: 0;
            color: #969696;
            font-size: 12px;
          }
        }
        .signature {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e1e1e1;
          color: #969696;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
