<template>
    <!--home-lay layout-content start-->
    <section class="article-lay layout-content box-container" id="article-lay">
        <div class="container-article">
            <div class="row">
                <main class="lay-main col-xs-12 col-sm-12 col-md-12">
                    <div class="article-view">
                        <div class="article-title">
                            <h1>
                                {{article.title }}
                            </h1>
                            <div class="author">
                                <a class="avatar" href="/user/<%= data.article.uid %>/article/all">
                                    <img :src="article.user.avatar" alt="">
                                </a>
                                <div class="info">
                                    <div class="name">
                                        <a href="/user/<%= data.article.uid %>/article/all">
                                            {{article.user.nickname }}
                                        </a>
                                    </div>
                                    <!-- 文章数据信息 -->
                                    <div class="meta">
                                        <!-- 如果文章更新时间大于发布时间，那么使用 tooltip 显示更新时间 -->
                                        <span class="publish-time">{{article.create_at }}</span>
                                        <span class="views-count">阅读 {{article.read_count}}</span>
                                        <span class="comments-count">评论 {{comment_count}}</span>
                                        <span class="likes-count">喜欢 {{article.like_count}}</span>
                                    </div>
                                </div>
                                <!-- 如果是当前作者，加入编辑按钮 -->
                            </div>
                        </div>
                        <article class="article-content box-article-view" v-html="article.content"></article>
                        <!--article footer start-->
                        <!-- <div id="free-reward-panel" class="support-author">
                                    <p>小礼物走一走，来简书关注我</p>
                                    <div class="btn btn-pay">赞赏支持</div>
                                </div>-->

                        <div class="show-foot clearfix">
                            <div class="copyright">
                                © 著作权归作者所有
                            </div>
                            <!-- <div class="modal-wrap">
                                           <a id="report-modal">举报文章</a>
                                       </div>-->
                        </div>

                        <div class="follow-detail">
                            <div class="info">
                                <a class="avatar" href="/user/<%= data.article.uid %>/article/all">
                                    <img :src="article.user.avatar" alt="">
                                </a>
                                <a class="btn btn-success follow attention-article"
                                   v-if="personal_info.user.uid !== article.uid"
                                   :class="{'active':curr_user_info.attention_uid_arr.indexOf(article.uid)!==-1}"
                                   @click="post_user_attention" href="javascript:;">
                                    <i class="iconfont icon-tianjia"></i><span>关注</span>
                                </a>
                                <a class="title" href="/user/<%= data.article.uid %>/article/all">
                                    {{article.user.nickname }}
                                </a>
                                <p>一共有 {{article_user_info.user_article_count}} 篇文章 ，被
                                    {{article_user_info.other_user_attention_count}} 人关注</p>
                            </div>
                            <div class="signature">
                                {{article.user.introduction }}
                            </div>
                        </div>

                        <div class="meta-bottom clearfix">
                            <div class="like">
                                <div class="btn like-group"
                                     :class="{'active':curr_user_info.user_like_aid_arr.indexOf(article.uid)!==-1}"
                                     @click="post_user_like_article">
                                    <div class="btn-like"><a href="javascript:;"><i class="iconfont icon-xin"></i>喜欢</a>
                                    </div>
                                    <div class="modal-wrap"><a href="javascript:;">{{article.like_count}}</a></div>
                                </div>
                                <!---->
                            </div>
                            <!-- <div class="share-group">
                                           <a class="share-circle">
                                               <i class="iconfont ic-wechat"></i>
                                           </a>
                                           <a class="share-circle more-share" title="">更多分享</a>
                                       </div>-->
                        </div>
                        <!--article footer end-->

                    </div>
                </main>
            </div>

        </div>
    </section>
    <!--home-lay layout-content end-->
</template>

<script>
  export default {
    name: 'Article',
    asyncData ({ store, route }) {
      // 触发 action 后，会返回 Promise
      return Promise.all([
        store.dispatch('article/GET_ARTICLE', { aid: route.params.aid })
      ])
    },
    data: function () {
      return {
        curr_user_info: {
          attention_uid_arr: [],
          user_like_aid_arr: []
        },
        article_user_info: {
          attention_uid_arr: [],
          user_like_aid_arr: []
        },
      }
    },
    created: function () {
        this.get_curr_user_info() // 获取当前登录用户信息
        this.get_article_user_info() // 获取当前文章用户信息
        /*this.get_comment_list()*/ // 获取用户的评论
      },
    methods: {
      get_curr_user_info: function () {// 获取当前登录用户信息
        var that = this
        this.$store.dispatch('article/GET_USER_INFO_ALL', { uid: this.personal_info.user.uid })
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                that.curr_user_info = res.data
              }
            })
          })
      },
      get_article_user_info: function () {// 获取当前文章用户信息
        var that = this
        this.$store.dispatch('article/GET_USER_INFO_ALL', { uid: this.article.user.uid })
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                that.article_user_info = res.data
              }
            })
          })
      },
      post_user_attention: function () { /*用户关注用户*/
        var that = this
        _server.post_user_attention({
          attention_uid: this.article.user.uid
        })
          .then(function (res) {
            if (res.state === 'success') {
              that.get_curr_user_info()
              that.get_article_user_info()
              /*获取当前文章用户信息*/
            } else {
              alert(res.message)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      post_user_like_article: function () { /*用户like 文章*/
        var that = this
        _server.post_user_like_article({ aid: this.article.user.uid })
          .then(function (res) {
            if (res.state === 'success') {
              that.get_curr_user_info()
              that.get_article()
            } else {
              alert(res.message)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    },
    computed: {
      article () {
        return this.$store.state.article.article
      },
      personal_info () { // 登录后的个人信息
        return this.$store.state.personal_info
      },
    }
  }
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
                    .like {
                        display: inline-block;
                        .like-group {
                            position: relative;
                            padding: 13px 0 15px 0;
                            font-size: 0;
                            border: 1px solid #ea6f5a;
                            border-radius: 40px;
                            &.active {
                                background-color: #ea6f5a;
                                color: #fff;
                                .btn-like {
                                    a {
                                        color: #fff;
                                    }
                                    i {
                                        color: #fff;
                                    }
                                }
                                .modal-wrap {
                                    border-left-color: #fff;
                                    a {
                                        color: #fff;
                                    }
                                }
                            }
                            .btn-like {
                                display: inline-block;
                                font-size: 19px;
                                a {
                                    position: relative;
                                    padding: 18px 30px 18px 55px;
                                    color: #ea6f5a;
                                }
                                i {
                                    position: absolute;
                                    left: 25px;
                                    top: 15px;
                                    font-size: 20px;
                                }
                            }
                            .modal-wrap {
                                font-size: 18px;
                                border-left: 1px solid rgba(236, 97, 73, 0.4);
                                display: inline-block;
                                margin-left: -15px;
                                a {
                                    color: #ea6f5a;
                                    padding: 18px 26px 18px 18px;
                                }
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

        /deep/ .box-article-view {
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            .h1,
            .h2,
            .h3,
            .h4,
            .h5,
            .h6 {
                font-family: inherit;
                font-weight: 300;
                line-height: 1.1;
                color: inherit;
            }
            h1 small,
            h2 small,
            h3 small,
            h4 small,
            h5 small,
            h6 small,
            .h1 small,
            .h2 small,
            .h3 small,
            .h4 small,
            .h5 small,
            .h6 small,
            h1 .small,
            h2 .small,
            h3 .small,
            h4 .small,
            h5 .small,
            h6 .small,
            .h1 .small,
            .h2 .small,
            .h3 .small,
            .h4 .small,
            .h5 .small,
            .h6 .small {
                font-weight: normal;
                line-height: 1;
                color: #999;
            }
            h4,
            h5,
            h6 {
                margin-top: 10.5px;
                margin-bottom: 10.5px;
            }
            h1,
            .h1 {
                font-size: 39px;
            }
            h2,
            .h2 {
                font-size: 32px;
            }
            h3,
            .h3 {
                font-size: 26px;
            }
            h4,
            .h4 {
                font-size: 19px;
            }
            h5,
            .h5 {
                font-size: 15px;
            }
            h6,
            .h6 {
                font-size: 13px;
            }
            p {
                margin: 0 0 10.5px;
            }
            h1 {
                font-size: 2.6em;
            }
            h2 {
                font-size: 2.15em;
            }
            h3 {
                font-size: 1.7em;
            }
            h4 {
                font-size: 1.25em;
            }
            h5 {
                font-size: 1em;
            }
            h6 {
                font-size: 0.85em;
            }
            img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 15px auto;
            }
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-weight: bold;
                margin: 1.2em 0 0.6em 0;
            }
            fieldset {
                padding: 0;
                margin: 0;
                border: 0;
            }
            legend {
                display: block;
                width: 100%;
                padding: 0;
                margin-bottom: 21px;
                font-size: 22.5px;
                line-height: inherit;
                color: #333;
                border: 0;
                border-bottom: 1px solid #e5e5e5;
            }
            label {
                display: inline-block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            hr {
                margin-top: 21px;
                margin-bottom: 21px;
                border: 0;
                border-top: 1px solid rgba(102, 128, 153, 0.1);
            }
            hr {
                margin: 2em 0;
            }
            ul,
            ol {
                margin-top: 0;
                margin-bottom: 10.5px;
            }
            ul,
            ol {
                margin-bottom: 1.1em;
            }
            li,
            p {
                line-height: 1.6;
            }
            small,
            .small {
                font-size: 85%;
            }
            blockquote {
                padding: 10.5px 21px;
                margin: 0 0 21px;
                border-left: 5px solid rgba(102, 128, 153, 0.075);
            }
            blockquote p {
                font-size: 18.75px;
                font-weight: 300;
                line-height: 1.25;
            }
            blockquote p:last-child {
                margin-bottom: 0;
            }
            blockquote small,
            blockquote .small {
                display: block;
                line-height: 1.45;
                color: #999;
            }
            blockquote small:before,
            blockquote .small:before {
                content: '\2014 \00A0';
            }
            blockquote.pull-right {
                padding-right: 15px;
                padding-left: 0;
                border-right: 5px solid rgba(102, 128, 153, 0.075);
                border-left: 0;
            }
            blockquote.pull-right p,
            blockquote.pull-right small,
            blockquote.pull-right .small {
                text-align: right;
            }
            blockquote.pull-right small:before,
            blockquote.pull-right .small:before {
                content: '';
            }
            blockquote.pull-right small:after,
            blockquote.pull-right .small:after {
                content: '\00A0 \2014';
            }
            blockquote:before,
            blockquote:after {
                content: '';
            }
            blockquote {
                border-left-width: 10px;
                background-color: rgba(102, 128, 153, 0.05);
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                padding: 15px 20px;
                font-style: normal;
                &:after {
                    margin-left: 0;
                }
            }
            blockquote p {
                margin-bottom: 1.1em;
                font-size: 1em;
                line-height: 1.45;
            }
            blockquote ul:last-child,
            blockquote ol:last-child {
                margin-bottom: 0;
            }
            kbd {
                padding: 0.1em 0.6em;
                border: 1px solid rgba(44, 63, 81, 0.25);
                -webkit-box-shadow: 0 1px 0 rgba(44, 63, 81, 0.25);
                box-shadow: 0 1px 0 rgba(44, 63, 81, 0.25);
                font-size: 0.7em;
                font-family: sans-serif;
                background-color: #fff;
                color: #333;
                border-radius: 3px;
                display: inline-block;
                margin: 0 0.1em;
                white-space: nowrap;
            }
            blockquote h1,
            blockquote h2,
            blockquote h3,
            blockquote h4,
            blockquote h5,
            blockquote h6 {
                font-weight: bold;
                margin: 0.6em 0;
            }
            /* start*/
            table {
                width: 700px;
                padding: 0;
                margin: 0;
                border-left: 1px solid #bfcbd9;
            }
            th {
                font-size: 12px;
                color: #4f6b72;
                border-right: 1px solid #c1dad7;
                border-bottom: 1px solid #c1dad7;
                border-top: 1px solid #c1dad7;
                letter-spacing: 2px;
                text-transform: uppercase;
                text-align: left;
                padding: 6px 6px 6px 12px;
            }
            td {
                border-right: 1px solid #bfcbd9;
                border-bottom: 1px solid #bfcbd9;
                background: #fff;
                font-size: 11px;
                padding: 6px 6px 6px 12px;
                color: #4f6b72;
            }
            /*table end*/
            /*code start*/
            p,
            pre,
            pre.prettyprint,
            blockquote {
                margin: 0 0 1.1em;
            }
            pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                display: block;
            }
            code,
            pre {
                font-size: 0.9em;
            }
            pre,
            pre.prettyprint {
                text-align: start;
                border: 0;
                border-radius: 5px;
                word-break: break-all;
            }
            pre code,
            pre.prettyprint code {
                padding: 1.3em 2em !important;
            }
            pre code {
                font-size: inherit;
                white-space: pre-wrap;
                background: #23241f;
                display: block;
                color: #ffffff;
                border-radius: 3px;
            }
            code,
            kbd,
            pre,
            samp {
                font-family: Menlo, Monaco, Consolas, Courier New, monospace;
            }
            code,
            kbd,
            pre,
            samp {
                font-family: Menlo, Monaco, Consolas, Courier New, monospace;
                font-size: 1em;
            }
            /*code border end*/
            /*code start*/
            .hljs {
                display: block;
                overflow-x: auto;
                padding: 0.5em;
                background: #23241f;
            }
            .hljs,
            .hljs-tag,
            .hljs-subst {
                color: #f8f8f2;
            }
            .hljs-strong,
            .hljs-emphasis {
                color: #a8a8a2;
            }
            .hljs-bullet,
            .hljs-quote,
            .hljs-number,
            .hljs-regexp,
            .hljs-literal,
            .hljs-link {
                color: #ae81ff;
            }
            .hljs-code,
            .hljs-title,
            .hljs-section,
            .hljs-selector-class {
                color: #a6e22e;
            }
            .hljs-strong {
                font-weight: bold;
            }
            .hljs-emphasis {
                font-style: italic;
            }
            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-name,
            .hljs-attr {
                color: #f92672;
            }
            .hljs-symbol,
            .hljs-attribute {
                color: #66d9ef;
            }
            .hljs-params,
            .hljs-class .hljs-title {
                color: #f8f8f2;
            }
            .hljs-string,
            .hljs-type,
            .hljs-built_in,
            .hljs-builtin-name,
            .hljs-selector-id,
            .hljs-selector-attr,
            .hljs-selector-pseudo,
            .hljs-addition,
            .hljs-variable,
            .hljs-template-variable {
                color: #e6db74;
            }
            .hljs-comment,
            .hljs-deletion,
            .hljs-meta {
                color: #75715e;
            }
            /*code end*/
        }
    }
</style>
