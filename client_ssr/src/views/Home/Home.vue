<template>
    <div class="home-lay index-box-container" id="index">

        <NavHeader :navItem="article_column"/> <!--头部导航栏-->

        <div class="index-container">

            <div class="row">
                <div class="col-xs-12 col-sm-8 col-md-8">

                    <div class="bannerBox clearfix">
                        <div class="bannerBox-img" v-for="item in home_banner">
                            <a :href="item.article_url" target="_blank" v-if="item.id">
                                <img :src="item.img_url">
                                <div class="bannerDescription">
                                    <span v-text="item.title"></span>
                                </div>
                            </a>
                            <a :href="'/article/'+item.aid" target="_blank" v-else>
                                <img :src="item.cover_img?item.cover_img:'/default/img/default_banner.jpg'">
                                <div class="bannerDescription">
                                    <span v-text="item.title"></span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!--home-lay layout-content start-->
                    <section class="layout-content ">

                        <nav class="list-nav">
                            <ul class="nav-list left">
                                <li class="nav-item active"><a href="/column/<%= data.column_id %>?sort=popular">热门</a>
                                </li>
                                <li class="nav-item"><a href="/column/<%= data.column_id %>?sort=newest">最新</a></li>
                                <li class="nav-item"><a href="/column/<%= data.column_id %>?sort=comment">评论</a></li>
                            </ul>
                            <ul class="nav-list right">
                                <li class="nav-item"><a href="/column/<%= data.column_id %>?sort=hottest">全部</a></li>
                                <li class="nav-item"><a href="/column/<%= data.column_id %>?sort=weeklyHottest">本周最热</a>
                                </li>
                                <li class="nav-item"><a
                                        href="/column/<%= data.column_id %>?sort=monthlyHottest">本月最热</a>
                                </li>
                            </ul>
                        </nav>


                        <ul class="article-list">
                            <li v-for="item in article_list">
                                <!--第一页之后ajax渲染-->
                                <article class="content-box content-box-index">
                                    <div class="info-box">

                                        <div class="info-row title-row">
                                            <a :href="article_href(item.aid)" class="title" target="_blank"
                                               v-text="item.title"></a>
                                        </div>

                                        <div class="info-row meta-row">
                                            <ul class="meta-list">
                                                <li class="item username clickable">
                                                    <a href="" v-text="item.user.nickname"></a>
                                                </li>
                                                <li class="item item-icon like-article">
                                                    <i class="iconfont icon-love"></i>
                                                    <strong v-text="item.like_count"></strong>
                                                </li>
                                                <li class="item item-icon comment-count">
                                                    <i class="iconfont icon-pinglun"></i>
                                                    <strong v-text="item.comment_count"></strong>
                                                </li>
                                                <li class="item" v-text="item.create_at"></li>
                                                <li class="item" v-if="item.tag_ids">
                                                    <a v-for="item_article_tag in article_tag_filter(item.tag_ids)"
                                                       class="tag-class frontend"
                                                       :href="tag_href(item_article_tag.article_tag_id)"
                                                       v-text="item_article_tag.article_tag_name">
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>


                                    </div>
                                    <div class="lazy thumb thumb loaded" v-if="item.cover_img"
                                         style="background-size: cover;"
                                         :style="{'background-image':'url('+item.cover_img+')'}">
                                    </div>
                                </article>
                            </li>
                        </ul>


                        <div class="article-footer">
                            <button class="reading-more" @click="get_index_article_list" v-if="loading_btn">阅读更多
                            </button>
                            <span class="reading-null" v-else>没有更多...</span>
                        </div>

                    </section>
                    <!--home-lay layout-content end-->


                </div>
                <div class="col-xs-12 col-sm-4 col-md-4">
                    <!--aside.html start-->
                    <HomeAside/>
                    <!--aside.html end-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import HomeAside from '@views/Home/HomeAside'
  import NavHeader from '@views/Home/NavHeader'

  export default {
    async asyncData ({ store, route, accessToken = '' }) {
      await store.commit('SET_CURRENT_ARTICLE_COLUMN', '')
      return Promise.all([
        store.dispatch('GET_ARTICLE_COLUMN'),
        store.dispatch('GET_HOME_BANNER')
      ])
    },
    name: 'Home',
    data () {
      return {
        message: 'Hello Vue!',
        page: 2,
        pageSize: 25,
        column_id: '<%= data.column_id %>',
        sort: '<%= data.sort %>',
        tag_all: '',
        article_list: [],
        loading_btn: Number('<%= data.count %>') >= 25,
        banner: []
      }
    },
    methods: {
      get_index_article_list: function () {
        var params = {
          page: this.page,
          column_id: this.column_id,
          sort: this.sort,
        }
        var that = this
        _server.get_index_article_list(params)
          .then(function (res) {
            that.$nextTick(function () {
              if (res.data.article_list.length > 0) {
                that.article_list = that.article_list.concat(res.data.article_list)
              }
              if (res.data.article_list.length < that.pageSize) {
                this.loading_btn = false
              } else {
                this.loading_btn = true
              }
              that.article_tag = res.data.article_tag
              that.page = Number(res.data.page) + 1
            })
          })
      },
      article_tag_filter: function (val) {
        var _arr = []
        this.article_tag.map(function (item, key) {
          if (val.split(',')
            .indexOf(String(item.article_tag_id)) !== -1) {
            _arr.push(item)
          }
        })
        return _arr
      },
      get_home_banner: function () {
        var that = this
        _server.get_home_banner()
          .then(function (res) {
            console.log('res', res)
            that.banner = res.data.banner
          })
          .catch(function (err) {

          })
      }
    },
    computed: {
      article_column () { // 文章的专栏
        return this.$store.state.article_column
      },
      c_column_us_name () { // 当前的专栏
        return this.$store.state.c_column_us_name
      },
      home_banner () { // 当前的专栏
        return this.$store.state.home_banner
      },
    },
    components: {
      HomeAside,
      NavHeader
    }
  }
</script>

<style scoped lang="scss">

    .home-lay {

        .bannerBox {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;

            .bannerBox-img {
                position: relative;
                height: 110px;
                width: 100%;
                flex: 1;
                border-radius: 10px;
                overflow: hidden;
                &:first-child {
                    flex: 2;
                }
                &:nth-of-type(2) {
                    margin-left: 8px;
                }
                .bannerDescription {
                    width: 100%;
                    height: 48px;
                    box-sizing: border-box;
                    padding: 8px 12px;
                    background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0, #000 100%);
                    font-weight: 700;
                    font-size: 12px;
                    color: #fff;
                    line-height: 16px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        .main-top {
            width: 100%;
            padding: 15px 20px;
            background: #fff;
            margin-bottom: 15px;
            box-shadow: 0 1px 3px rgba(27, 95, 160, .1);
            .main-top-img {
                width: 50px;
                height: 50px;
                margin-right: 15px;
                border-radius: 10px;
                float: left;
                overflow: hidden;
                .column-img-icon {
                    width: 100%;
                    height: 50px;
                    background-color: #fff;
                    background-position: 50%;
                    background-repeat: no-repeat;
                    background-size: contain;
                }
                .column-font-icon {
                    text-align: center;
                    line-height: 50px;
                    i {
                        font-size: 28px;
                    }
                }
            }
            .main-top-view {
                padding-left: 70px;
                > h3 {
                    font-weight: bold;
                }
                .info {
                    color: #999;
                    font-size: 14px;
                }
            }
        }

        .layout-content {
            position: relative;
            background: #fff;
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(27, 95, 160, .1);
            .list-nav {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid rgba(178, 186, 194, 0.15);
                padding: 0 5px;
                .nav-list {
                    align-items: center;
                    line-height: 1;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    padding: 20px 0;
                }
                .left {
                    .nav-item {
                        padding: 0 15px;
                        font-size: 14px;
                        border-right: 1px solid hsla(0, 0%, 59.2%, .2);
                        &:last-child {
                            border-right: none;
                        }
                    }
                }
                .right {
                    .nav-item {
                        font-size: 14px;
                        padding: 0 10px;
                        position: relative;
                    }
                    .nav-item:not(:last-child):after {
                        width: 2px;
                        height: 2px;
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        content: "";
                        position: absolute;
                        left: 100%;
                        top: 50%;
                        background-color: #2b445d;
                        transform: translateY(-50%);
                        opacity: .5;
                    }
                }
            }
            .article-list {
                > li {
                    padding: 0 24px;
                    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
                    &:hover {
                        background: #f9f9f9;
                    }
                }
            }
        }

        .article-footer {
            margin-top: 30px;
            padding-bottom: 30px;
            .reading-more {
                width: 100%;
                height: 39px;
                border: none;
                background: #999;
                text-align: center;
                color: #fff;
                border-radius: 3px;
                font-size: 14px;
                &:hover {
                    background: #f46e65;
                }
            }
            .reading-null {
                text-align: center;
                display: block;
                color: #f7e1b5;
            }
        }
    }
</style>
