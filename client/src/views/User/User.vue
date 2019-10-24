<template>
  <client-only>
    <section class="user-lay layout-content"
             id="user-center-article">
      <div class="container  box-container">
        <div class="row">

          <div class="col-xs-12 col-sm-8 col-md-8 main">
            <div class="main-top clearfix">
              <router-link :to='{name:"user",params:{uid:user.user_info.user.uid,routeType:"article"}}'
                           class="avatar">
                <div class="avatar-img">
                  <img :src="user.user_info.user.avatar"
                       class="box-image"
                       alt="">
                </div>
              </router-link>

              <div class="title">
                <router-link :to='{name:"user",params:{uid:user.user_info.user.uid,routeType:"article"}}'
                             class="name">
                  {{ user.user_info.user.nickname }}
                </router-link>
              </div>

              <button v-if="(user.user_info.user.uid !== personalInfo.user.uid)&&personalInfo.islogin"
                      class="user-follow-button"
                      @click="onUserAttention(isAttention.is_attention)"
                      :class="isAttention.is_attention?'has':'no'">
                <i class="iconfont"></i>
                <span>{{isAttention.text}}</span>
              </button>

              <div class="info">
                <ul>
                  <li>
                    <div class="meta-block">
                      <router-link :to='{name:"user",params:{routeType:"attention"}, query:{any:"me"}}'>
                        <p>{{user.user_info.userAttentionCount}}</p>
                        <strong>
                          {{user.user_info.user.uid === personalInfo.user.uid?'我关注的人':'他关注的人'}}
                        </strong>
                      </router-link>
                    </div>
                  </li>
                  <li>
                    <div class="meta-block">
                      <router-link :to='{name:"user",params:{routeType:"attention"},query:{any:"other"}}'>
                        <p>{{user.user_info.otherUserAttentionCount}}</p>
                        <strong>粉丝</strong>
                      </router-link>
                    </div>
                  </li>
                  <li>
                    <div class="meta-block">
                      <router-link :to='{name:"user",params:{routeType:"article"}}'>
                        <p>{{user.user_info.userArticleCount}}</p>
                        <strong>文章</strong>
                      </router-link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <ul class="trigger-menu">
              <li>
                <router-link :to='{name:"user",params:{routeType:"article"}}'>
                  文章
                </router-link>
              </li>
              <li>
                <router-link :to='{name:"user",params:{routeType:"dynamic"}}'>
                  片刻
                </router-link>
              </li>
              <li>
                <router-link :to='{name:"user",params:{routeType:"books"}}'>
                  小书
                </router-link>
              </li>
              <li>
                <router-link :to='{name:"user",params:{routeType:"blog"}}'>
                  专栏
                </router-link>
              </li>
              <li>
                <router-link :to='{name:"user",params:{routeType:"attention"}}'>
                  关注
                </router-link>
              </li>
              <li v-if="personalInfo.islogin&&personalInfo.user.uid===user.user_info.user.uid">
                <router-link :to='{name:"user",params:{routeType:"message"}}'>
                  消息
                </router-link>
              </li>
            </ul>

            <BlogView v-if="$route.params.routeType==='blog'" />
            <booksView v-else-if="$route.params.routeType==='books'" />
            <DynamicView v-else-if="$route.params.routeType==='dynamic'" />
            <UserAttentionView v-else-if="$route.params.routeType==='attention'" />
            <UserMessageView v-else-if="$route.params.routeType==='message'" />
            <ArticleView v-else />
          </div>

          <div class="col-xs-12 col-sm-4 col-md-4 box-aside">
            <UserAside />
          </div>

        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import { mapState } from 'vuex'
import ClientOnly from 'vue-client-only'
import UserAside from './view/UserAside'
import ArticleView from './view/Article'
import BlogView from './view/Blog'
import booksView from './view/books'
import DynamicView from './view/Dynamic'
import UserAttentionView from './view/UserAttention'
import UserMessageView from './view/UserMessage'


export default {
  name: 'User',
  metaInfo () {
    return {
      title: '个人中心',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return Promise.all([
      store.dispatch('user/GET_USER_INFO_ALL', { uid: route.params.uid })
    ])
  },
  data () {
    return {
      personalUser: {}
    }
  },
  methods: {
    onUserAttention (type) { /*用户关注用户*/
      this.$confirm(type ? '是否取消关注?' : '是否关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('user/USER_ATTENTION', { attention_uid: this.$route.params.uid })
            .then(result => {
              if (result.state === 'success') {
                // window.location.reload()
                this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.$route.params.uid })
                this.$message.success(result.message)
                /*获取当前文章用户信息*/
              } else {
                this.$message.warning(result.message)
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        })
        .catch(() => {
        })
    },
  },
  computed: {
    ...mapState(['personalInfo', 'user']),  // personalInfo:个人信息  user:登录后的个人信息当前用户
    isAttention () { // 是否收藏
      let userAttentionIds = [] // 当前用户被其他的用户所关注的其他用户 所有 id

      this.user.user_info.user.userAttentionIds.map(item => {
        userAttentionIds.push(Number(item.uid))
      })

      if (~userAttentionIds.indexOf(Number(this.personalInfo.user.uid))) {
        return {
          is_attention: true,
          text: '已关注'
        }
      } else {
        return {
          is_attention: false,
          text: '关注'
        }
      }
    },
  },
  components: {
    UserAside,
    ClientOnly,
    ArticleView,
    BlogView,
    booksView,
    DynamicView,
    UserAttentionView,
    UserMessageView
  }
}
</script>

<style scoped lang="scss">
.user-lay.layout-content {
  .main {
    .main-top {
      margin-bottom: 20px;
      .avatar {
        float: left;
        width: 80px;
        height: 80px;
        margin-left: -2px;
        .avatar-img {
          border-radius: 160px;
          width: 80px;
          height: 80px;
          .box-image {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              border-radius: 80px;
            }
          }
        }
      }
      .title {
        padding: 0 0 0 100px;
        .name {
          display: inline;
          font-size: 21px;
          font-weight: 700;
          vertical-align: middle;
        }
      }
      .info {
        margin-top: 5px;
        padding-left: 100px;
        font-size: 14px;
        li {
          display: inline-block;
          .meta-block {
            font-size: 12px;
            margin: 0 7px 6px 0;
            padding: 0 7px 0 0;
            border-right: 1px solid #f0f0f0;
          }
          p {
            margin-bottom: -3px;
            font-size: 15px;
            color: #333;
          }
          strong {
            color: #999;
            font-weight: normal;
          }
          &:last-child {
            .meta-block {
              border-right: none;
            }
          }
        }
      }
      .user-follow-button {
        font-size: 14px;
        outline: 0;
        float: right;
        border: 1px solid #00bb29;
        border-radius: 30px;
        padding: 6px 30px;
        margin-right: 30px;
        color: #fff;
        display: inline-block;
        margin-left: 20px;
        &.off {
          background: #999;
          border: 1px solid #ccc;
        }
        &.has {
          background: #999;
          border: 1px solid #ccc;
        }
        &.no {
          background: #00bb29;
          border: 1px solid #00bb29;
        }
      }
    }
    .trigger-menu {
      border-bottom: 1px solid #f0f0f0;
      font-size: 0;
      list-style: none;
      li {
        position: relative;
        display: inline-block;
        padding: 8px 0;
        margin-bottom: -1px;
        .current-active {
          border-bottom: 2px solid #646464;
          color: #646464;
        }
        a {
          padding: 10px 20px;
          font-size: 15px;
          color: #969696;
          line-height: 25px;
          &:hover {
            color: #646464;
          }
        }
      }
    }
  }
  .article-list {
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  }
  .blog-modal {
    padding: 20px 30px;
    .form-group {
      label {
        font-size: 15px;
      }
      .form-control {
        font-size: 15px;
      }
    }
  }
  .blog-modal-create {
    margin-right: 6px;
    width: 100px;
    font-size: 14px;
  }
  .blog-modal-cancel {
    width: 100px;
    margin-left: 6px;
    font-size: 14px;
  }
}
</style>
