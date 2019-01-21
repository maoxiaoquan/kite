<template>
    <!--article-list-lay layout-content start-->
    <section class="tag-lay layout-content">
        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-sm-12 col-md-12">
                    <div class="article-list">
                        <div class="main-top">
                            <div class="lazy thumb loaded"
                                 v-if="article_tag.article_tag_icon_type==='1'"
                                 :style="{'background-image':`url(${article_tag.article_tag_icon})`}">
                            </div>

                            <div class="tag-icon" v-else>
                                <i class="iconfont" :class="article_tag.article_tag_icon"></i>
                            </div>

                            <div class="title">
                                <a class="name" href="/c/e048f1a72e3d">
                                    {{article_tag.article_tag_name}}</a>
                            </div>
                            <div class="info">
                                收录了
                                {{count}} 篇文章 ·
                                {{subscribe_count}} 人关注
                            </div>
                        </div>
                        <ul class="trigger-menu">
                            <!-- <li class=""><a href="/"><i class="iconfont ic-latestcomments"></i> 最新评论</a></li>-->
                            <li class="active"><a href="/"><i class="iconfont ic-articles"></i> 最新收录</a></li>
                            <!-- <li class=""><a href="/"><i class="iconfont ic-hot"></i> 热门</a></li>-->
                        </ul>
                        <div class="list-container">
                            <div class="article-view">
                                <div class="article-item" v-for="item in article_list">
                                    <ArticleItem :articleItem="item"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!--article-list-lay layout-content end-->
</template>

<script>
  import ArticleItem from '@views/Article/component/ArticleItem'

  export default {
    name: 'ArticleTag',
    async beforeCreate () {
      // 特别注释 目前试了下，服务端渲染里执行的registerModule的module除了state,其他的都不会被客户端渲染的共享.
      // 所以部分vuex Module 放在  beforeCreate 中惰性注册
      await this.$store.dispatch('article_tag/GET_ARTICLE_TAG', { article_tag_id: this.$route.params.article_tag_id })
    },
    computed: {
      count () {
        return this.$store.state.article_tag.tag.count
      },
      subscribe_count () {
        return this.$store.state.article_tag.tag.subscribe_count
      },
      article_tag () {
        return this.$store.state.article_tag.tag.article_tag
      },
      article_list () {
        return this.$store.state.article_tag.tag.article_list
      },
    },
    components: {
      ArticleItem
    }
  }
</script>

<style scoped lang="scss">
    .tag-lay.layout-content {
        padding-bottom: 50px;
        .main-top {
            margin-top: 30px;
            margin-bottom: 10px;
            text-align: center;

            .thumb {
                width: 100px;
                height: 100px;
                margin: 0 auto;
                background-position: 50%;
                background-repeat: no-repeat;
                background-size: contain;
            }
            .tag-img-icon {
                width: 80px;
                height: 80px;
                display: inline-block;
                background-color: #fff;
                background-position: 50%;
                background-repeat: no-repeat;
            }
            .tag-font-icon {
                display: inline-block;
                width: 80px;
                height: 80px;
                line-height: 80px;
                i {
                    font-size: 35px;
                }
            }

            .title {
                padding: 10px 0 0 0;
                .name {
                    display: inline;
                    font-size: 21px;
                    font-weight: 700;
                    vertical-align: middle;
                }
            }
            .info {
                margin-top: 10px;
                font-size: 14px;
                color: #969696;
            }
        }
        .trigger-menu {
            margin-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0;
            list-style: none;
            li {
                position: relative;
                display: inline-block;
                padding: 8px 0;
                margin-bottom: -1px;
                a {
                    padding: 13px 20px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #969696;
                    line-height: 25px;
                }
                &.active {
                    border-bottom: 2px solid #646464;
                }
            }
        }
        .list-container {
            .article-view {
                > .article-item {
                    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
                    &:hover {
                        background: #f9f9f9;
                    }
                }
            }
        }
    }

</style>
