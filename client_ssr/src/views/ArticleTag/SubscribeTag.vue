<template>
    <!--article-list-lay layout-content start-->
    <section class="subscribe-lay layout-content" id="subscribe-lay">
        <div class="container  box-container">

            <header class="list-header">
                <nav role="navigation" class="list-nav">
                    <ul class="nav-list">
                        <li class="nav-item" :class="{'active':$route.params.type==='all'}">
                            <router-link :to='{name:"subscribe_tag",params:{type:"all"}}'>
                                <span class="collection-name">全部</span>
                            </router-link>
                        </li>
                        <!--class active-->
                        <li class="nav-item" :class="{'active':$route.params.type==='subscribe'}" v-if="islogin">
                            <router-link :to='{name:"subscribe_tag",params:{type:"subscribe"}}'>
                                <span class="collection-name">已关注</span>
                            </router-link>
                        </li>

                        <li class="nav-item search" v-if="$route.params.type!=='subscribe'">
                            <form role="search" class="search-tag-from">
                                <input maxlength="32" placeholder="搜索标签" required="true" v-model="tag_name"
                                       class="search-tag-input">
                                <button class="search-tag-btn" type="button" @click="get_article_tag_list"><i
                                        class="iconfont icon-search"></i></button>
                            </form>
                        </li>
                    </ul>
                </nav>
            </header>

            <ul class="row tag-list">
                <li class="item  col-xs-12 col-sm-3 col-md-3 " v-for="item in article_tag_list">
                    <articleTagItem :articleTagItem="item"/>
                </li>
            </ul>

        </div>
    </section>
    <!--article-list-lay layout-content end-->
</template>

<script>
  import ArticleTagItem from '@views/ArticleTag/component/ArticleTagItem'

  export default {
    name: 'SubscribeTag',
    async beforeCreate () {
      // 特别注释 目前试了下，服务端渲染里执行的registerModule的module除了state,其他的都不会被客户端渲染的共享.
      // 所以部分vuex Module 放在  beforeCreate 中惰性注册
      await this.$store.dispatch('article_tag/GET_ARTICLE_TAG_LIST')
      await this.$store.dispatch('article_tag/MY_SUBSCRIBE_TAG_LIST')
    },
    data () {
      return {
        tag_name: ''
      }
    },
    methods: {
      get_article_tag_list () {
        this.$store.dispatch('article_tag/GET_ARTICLE_TAG_LIST', { tag_name: this.tag_name })
      }
    },
    computed: {
      article_tag_list () {
        return this.$store.state.article_tag.subscribe.article_tag_list || []
      },
      count () {
        return this.$store.state.article_tag.subscribe.count || 0
      },
      islogin () {
        return this.$store.state.personal_info.islogin
      }
    },
    components: {
      ArticleTagItem
    }
  }
</script>

<style scoped lang="scss">
    .subscribe-lay.layout-content {
        .list-header {
            padding: 0.5rem 0.4rem;
            .article-type {
                .article-topic {
                    display: inline-block;
                }
                .article-tag {
                    display: inline-block;
                }
            }
            .list-nav {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                .nav-list {
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    line-height: 1;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: end;
                    -ms-flex-pack: end;
                    justify-content: flex-end;
                    -ms-flex-wrap: wrap;
                    flex-wrap: wrap;
                    .nav-item {
                        position: relative;
                        cursor: pointer;
                        &.active a,
                        a:hover {
                            color: #007fff;
                        }
                        .search-tag-from {
                            position: relative;
                            .search-tag-input {
                                padding: 0.3rem;
                                font-size: 0.9rem;
                                border: 1px solid hsla(0, 0%, 59%, 0.2);
                                outline: none;
                            }
                            .search-tag-btn {
                                padding: 3px 10px;
                                background: #fff;
                                border: none;
                                border-radius: 3px;
                                position: absolute;
                                right: 1px;
                                top: 1px;
                                outline: 0;
                            }
                        }
                    }
                    .nav-item {
                        padding: 1rem 0.6rem;
                        margin-left: 0.8rem;
                        font-size: 1rem;
                        white-space: nowrap;
                    }
                }
            }
        }
        .tag-list {
            .item {
                margin-bottom: 1.3rem;
                padding: 0 0.7rem;
                box-sizing: border-box;
            }
        }
    }
</style>
