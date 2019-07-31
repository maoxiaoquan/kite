<template>

  <section class="user-lay layout-content"
           id="user-center-article">
    <div class="container  box-container">
      <div class="row">

        <div class="col-xs-12 col-sm-8 col-md-8 main">
          <div class="main-top clearfix">
            <router-link :to='{name:"user",params:{uid:user.user_info.user.uid}}'
                         class="avatar">
              <div class="avatar-img">
                <el-image :src="user.user_info.user.avatar"
                          lazy></el-image>
              </div>
            </router-link>

            <div class="title">
              <router-link :to='{name:"user",params:{uid:user.user_info.user.uid}}'
                           class="name">
                {{ user.user_info.user.nickname }}
              </router-link>
            </div>

            <button v-if="(user.user_info.user.uid !== personalInfo.user.uid)&&personalInfo.islogin"
                    class="user-follow-button"
                    @click="onUserAttention($route.params.uid,~user.user_attention.other_attention.indexOf(personalInfo.user.uid||''))"
                    :class="~user.user_attention.other_attention.indexOf(personalInfo.user.uid||'')?'has':'no'">
              <i class="iconfont"></i>
              <span v-if="~user.user_attention.other_attention.indexOf(personalInfo.user.uid||'')">已关注</span>
              <span v-else>关注</span>
            </button>

            <div class="info">
              <ul>
                <li>
                  <div class="meta-block">
                    <router-link :to='{name:"userAttention",query:{any:"me"}}'>
                      <p>{{user.user_info.user_attention_other_count}}</p>
                      <strong>
                        {{user.user_info.user.uid === personalInfo.user.uid?'我关注的人':'他关注的人'}}
                      </strong>
                    </router-link>
                  </div>
                </li>
                <li>
                  <div class="meta-block">
                    <router-link :to='{name:"userAttention",query:{any:"other"}}'>
                      <p>{{user.user_info.other_user_attention_count}}</p>
                      <strong>粉丝</strong>
                    </router-link>
                  </div>
                </li>
                <li>
                  <div class="meta-block">
                    <router-link :to='{name:"userBlog",query:{blog_id:"all"}}'>
                      <p>{{user.user_info.user_article_count}}</p>
                      <strong>文章</strong>
                    </router-link>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <ul class="trigger-menu">
            <li :class="{'active':$route.name==='userBlog'}">
              <router-link :to='{name:"userBlog",query:{blog_id:"all"}}'>
                文章
              </router-link>
            </li>
            <li :class="{'active':$route.name==='userAttention'}">
              <router-link :to='{name:"userAttention"}'>
                关注
              </router-link>
            </li>
            <li :class="{'active':$route.name==='userLike'}">
              <router-link :to='{name:"userLike"}'>
                喜欢
              </router-link>
            </li>

            <li :class="{'active':$route.name==='userMessage'}"
                v-if="personalInfo.islogin&&personalInfo.user.uid===user.user_info.user.uid">
              <router-link :to='{name:"userMessage"}'>
                消息
              </router-link>
            </li>
          </ul>

          <router-view />
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4 box-aside">
          <UserAside />
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import UserAside from './view/UserAside'
import { mapState } from 'vuex'

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
      store.dispatch('user/GET_USER_INFO_ALL', { uid: route.params.uid }),
      store.dispatch('user/GET_USER_ATTENTION_LIST', {
        uid: route.params.uid
      })
    ])
  },
  methods: {
    onUserAttention (attention_uid, type) { /*用户关注用户*/
      this.$confirm(type ? '是否取消关注?' : '是否关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('user/USER_ATTENTION', { attention_uid: attention_uid })
            .then(result => {
              if (result.state === 'success') {
                // window.location.reload()
                this.$store.dispatch('user/GET_USER_ATTENTION_LIST', {
                  uid: this.$route.params.uid
                })
                this.$message.success(res.message)
                /*获取当前文章用户信息*/
              } else {
                this.$message.warning(res.message)
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
  },
  components: {
    UserAside
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
          /deep/ .el-image {
            width: 80px;
            height: 80px;
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
        &.active {
          border-bottom: 2px solid #646464;
          a {
            color: #646464;
          }
        }
        a {
          padding: 13px 20px;
          font-size: 15px;
          font-weight: 700;
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
