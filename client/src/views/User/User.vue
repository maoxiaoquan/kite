<template>
  <client-only>
    <section class="user-lay layout-content" id="user-center-article">
      <div class="container  box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8 main">
            <div class="client-card">
              <div class="main-top clearfix">
                <router-link
                  :to="{
                    name: 'user',
                    params: { uid: user.user.uid, routeType: 'article' }
                  }"
                  class="avatar"
                >
                  <div class="avatar-img">
                    <img v-lazy="user.user.avatar" class="box-image" alt="" />
                  </div>
                </router-link>

                <div class="title">
                  <router-link
                    :to="{
                      name: 'user',
                      params: { uid: user.user.uid, routeType: 'article' }
                    }"
                    class="name"
                  >
                    {{ user.user.nickname }}
                    <i class="level-num">Lv{{ getLevel() }}</i>
                    <i
                      v-if="~[1, 2].indexOf(user.user.sex)"
                      :class="
                        user.user.sex === 1
                          ? 'male el-icon-male'
                          : 'female el-icon-female'
                      "
                    ></i>
                  </router-link>
                </div>

                <div
                  class="btn-group"
                  v-if="user.user.uid !== personalInfo.user.uid"
                >
                  <button class="btn btn-private-chat" @click="privateChat">
                    <i class="iconfont"></i>
                    <span>私聊</span>
                  </button>
                  <button
                    class="btn"
                    @click="onUserAttention(isAttention.is_attention)"
                    :class="isAttention.is_attention ? 'has' : 'no'"
                  >
                    <i class="iconfont"></i>
                    <span>{{ isAttention.text }}</span>
                  </button>
                </div>

                <div class="info">
                  <ul>
                    <li>
                      <div class="meta-block">
                        <router-link
                          :to="{
                            name: 'user',
                            params: { routeType: 'attention' },
                            query: { any: 'me' }
                          }"
                        >
                          <p>{{ user.userAttentionCount }}</p>
                          <strong>
                            关注的人
                          </strong>
                        </router-link>
                      </div>
                    </li>
                    <li>
                      <div class="meta-block">
                        <router-link
                          :to="{
                            name: 'user',
                            params: { routeType: 'attention' },
                            query: { any: 'other' }
                          }"
                        >
                          <p>{{ user.otherUserAttentionCount }}</p>
                          <strong>粉丝</strong>
                        </router-link>
                      </div>
                    </li>
                    <li>
                      <div class="meta-block">
                        <router-link
                          :to="{
                            name: 'user',
                            params: { routeType: 'article' }
                          }"
                        >
                          <p>{{ user.userArticleCount }}</p>
                          <strong>文章</strong>
                        </router-link>
                      </div>
                    </li>

                    <li
                      v-if="
                        user.user.uid === personalInfo.user.uid &&
                          personalInfo.islogin
                      "
                    >
                      <div class="meta-block">
                        <router-link :to="{ name: 'shellDetail' }">
                          <p>{{ user.user_info.shell_balance || 0 }}</p>
                          <strong>贝壳余额</strong>
                        </router-link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="client-card">
              <ul class="trigger-menu">
                <li>
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'article' } }"
                  >
                    文章
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'dynamic' } }"
                  >
                    片刻
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'books' } }"
                  >
                    小书
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'blog' } }"
                  >
                    个人专栏
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'attention' } }"
                  >
                    关注
                  </router-link>
                </li>
                <li
                  v-if="
                    personalInfo.islogin &&
                      personalInfo.user.uid === user.user.uid
                  "
                >
                  <router-link
                    :to="{ name: 'user', params: { routeType: 'message' } }"
                  >
                    消息
                  </router-link>
                </li>
              </ul>

              <BlogView v-if="$route.params.routeType === 'blog'" />
              <BooksView v-else-if="$route.params.routeType === 'books'" />
              <DynamicView v-else-if="$route.params.routeType === 'dynamic'" />
              <UserAttentionView
                v-else-if="$route.params.routeType === 'attention'"
              />
              <UserMessageView
                v-else-if="$route.params.routeType === 'message'"
              />
              <ArticleView v-else />
            </div>
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
import BooksView from './view/Books'
import DynamicView from './view/Dynamic'
import UserAttentionView from './view/UserAttention'
import UserMessageView from './view/UserMessage'
import { modelType, userLevel } from '@utils/constant'

export default {
  name: 'User',
  metaInfo() {
    return {
      title: this.user.user.nickname,
      titleTemplate: `%s - ${this.website.meta.website_name || ''}`,
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data() {
    return {
      modelType,
      userLevel
    }
  },
  async asyncData({ store, route }) {
    return Promise.all([
      store.dispatch('user/GET_USER_INFO_ALL', { uid: route.params.uid })
    ])
  },
  methods: {
    privateChat() {
      if (!this.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
        return false
      }
      if (this.user.user.uid === this.personalInfo.user.uid) {
        this.$message.error('自己不能和自己私聊')
        return false
      }
      this.$router.push({
        name: 'privateChat',
        query: { uid: this.user.user.uid, nickname: this.user.user.nickname }
      })
    },
    getLevel() {
      let l = 0
      let x = this.user.user_info.experience
      if (x < this.userLevel.one) {
        l = 0
      } else if (x < this.userLevel.two && x > this.userLevel.one) {
        l = 1
      } else if (x < this.userLevel.three && x > this.userLevel.two) {
        l = 2
      } else if (x < this.userLevel.four && x > this.userLevel.three) {
        l = 3
      } else if (x < this.userLevel.five && x > this.userLevel.four) {
        l = 4
      } else if (x >= this.userLevel.five) {
        l = 5
      }
      return l
    },
    onUserAttention(type) {
      if (!this.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
        return false
      }
      if (this.user.user.uid === this.personalInfo.user.uid) {
        this.$message.error('自己不能关注自己')
        return false
      }
      /*用户关注用户*/
      this.$confirm(type ? '是否取消关注?' : '是否关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store
          .dispatch('common/SET_ATTENTION', {
            associate_id: this.$route.params.uid,
            type: modelType.user
          })
          .then(result => {
            if (result.state === 'success') {
              this.$store.dispatch('user/GET_ASSOCIATE_INFO')
              this.$message.success(result.message)
            } else {
              this.$message.warning(result.message)
            }
          })
      })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user', 'website']), // personalInfo:个人信息  user:登录后的个人信息当前用户
    isAttention() {
      // 是否关注
      if (
        ~this.user.associateInfo.userAttentionId.indexOf(
          String(this.$route.params.uid)
        )
      ) {
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
    }
  },
  components: {
    UserAside,
    ClientOnly,
    ArticleView,
    BlogView,
    BooksView,
    DynamicView,
    UserAttentionView,
    UserMessageView
  }
}
</script>

<style scoped lang="scss">
.user-lay.layout-content {
  .client-card {
    margin-bottom: 10px;
    padding: 20px;
  }
  .main {
    .main-top {
      .avatar {
        text-align: center;
        display: block;
        margin-top: 10px;
        margin-bottom: 15px;
        .avatar-img {
          border-radius: 160px;
          width: 80px;
          height: 80px;
          display: inline-block;
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
        text-align: center;
        .name {
          display: inline;
          font-size: 21px;
          font-weight: 700;
          vertical-align: middle;
        }
        .male {
          color: #4285f4;
        }
        .female {
          color: #f442a3;
        }
        .level-num {
          display: inline-block;
          font-size: 12px;
          background: #fa6116de;
          border-radius: 3px;
          line-height: 18px;
          color: #fff;
          padding: 0 3px;
          vertical-align: middle;
        }
      }
      .btn-group {
        text-align: center;
        .btn {
          display: inline-block;
          font-size: 14px;
          outline: 0;
          border: 1px solid #00bb29;
          border-radius: 30px;
          padding: 3px 20px;
          color: #888585;
          margin: 14px auto;
          &.btn-private-chat {
            background: #fff;
            color: #00bb29;
          }
          &.off {
            background: #999;
            border: 1px solid #ccc;
          }
          &.has {
            background: #ccc;
            color: #666;
            border: 1px solid #ccc;
          }
          &.no {
            background: #00bb29;
            color: #fff;
            border: 1px solid #00bb29;
          }
        }
      }
      .info {
        margin-top: 5px;
        text-align: center;
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
