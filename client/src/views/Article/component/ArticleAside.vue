<template>
  <div class="article-aside">
    <div class="sidebar-block author-block  client-card">
      <div class="block-title">关于作者</div>
      <div class="block-body">
        <div class="user-item item">
          <div
            class="lazy avatar avatar loaded"
            :style="`background-image: url(&quot;${userInfo.avatar}&quot;);`"
          ></div>
          <div class="info-box">
            <router-link
              class="username"
              :to="{
                name: 'user',
                params: { uid: userInfo.uid, routeType: 'article' }
              }"
            >
              {{ userInfo.nickname }}</router-link
            >
            <div class="position">
              {{ userInfo.profession }} @ {{ userInfo.company }}
            </div>
          </div>
        </div>

        <div class="btn-group" v-if="userInfo.uid !== personalInfo.user.uid">
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

        <div class="stat-item item">
          <i class="el-icon-document"></i>
          <span class="content"
            >文章总数
            <em class="count">{{ userInfo.articleCount || 0 }}</em></span
          >
        </div>
        <div class="stat-item item">
          <i class="el-icon-chat-line-square"></i>
          <span class="content">
            片刻总数
            <em class="count">{{ userInfo.dynamicCount || 0 }}</em>
          </span>
        </div>
      </div>
    </div>

    <div class="sidebar-block related-entry-sidebar-block client-card">
      <div class="block-title">最新文章</div>
      <div class="block-body">
        <div class="entry-list">
          <router-link
            class="item"
            v-for="(item, key) in recommendArticle"
            :key="key"
            :to="{ name: 'article', params: { aid: item.aid } }"
          >
            <div class="entry-title">
              {{ item.title }}
            </div>
            <div class="entry-meta-box">
              <div class="entry-meta">
                <i class="el-icon-thumb icon"></i>
                <span class="count">{{ item.thumb_count }}</span>
              </div>
              <div class="entry-meta">
                <i class="el-icon-chat-dot-square icon"></i>
                <span class="count">{{ item.comment_count }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { modelType, userLevel } from '@utils/constant'

export default {
  data() {
    return {
      userInfo: {},
      recommendArticle: []
    }
  },
  mounted() {
    this.getUserInfo() // 获取用户的信息
  },
  watch: {
    $route(to, from) {
      this.getUserInfo()
    }
  },
  computed: {
    article() {
      return this.$store.state.article.article || {}
    },
    ...mapState(['website', 'personalInfo', 'user']),
    isAttention() {
      // 是否关注
      if (
        ~this.user.associateInfo.userAttentionId.indexOf(
          String(this.userInfo.uid)
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
  methods: {
    privateChat() {
      if (!this.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
        return false
      }
      if (this.userInfo.uid == this.personalInfo.user.uid) {
        this.$message.error('自己不能和自己私聊')
        return false
      }
      this.$router.push({
        name: 'privateChat',
        query: { uid: this.userInfo.uid, nickname: this.userInfo.nickname }
      })
    },
    onUserAttention(type) {
      if (!this.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
        return false
      }
      if (this.userInfo.uid == this.personalInfo.user.uid) {
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
            associate_id: this.userInfo.uid,
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
    },
    getUserInfo() {
      this.$store
        .dispatch('graphql/GET_USER_INFO', { uid: this.article.uid })
        .then(result => {
          this.userInfo = result.data.userInfo || {}
          this.recommendArticle = result.data.recommendArticle || []
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.article-aside {
  .sidebar-block {
    position: relative;
    margin-bottom: 10px;
    .block-title {
      padding: 12px 15px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid hsla(0, 0%, 58.8%, 0.1);
    }
    .item {
      display: flex;
      align-items: center;
    }
  }
  .btn-group {
    padding-left: 15px;
    padding-bottom: 15px;
    .btn {
      display: inline-block;
      font-size: 13px;
      outline: 0;
      border: 1px solid #00bb29;
      border-radius: 30px;
      padding: 2px 10px;
      color: #888585;
      margin-right: 10px;
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
  .author-block {
    .block-body {
      padding-bottom: 10px;
    }
    .avatar {
      display: inline-block;
      position: relative;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #eee;
    }
    .info-box {
      flex: 1 1 auto;
      min-width: 0;
      .username {
        font-size: 16px;
        font-weight: 600;
        color: #000;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .position {
        margin-top: 5px;
        font-size: 14px;
        color: #72777b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .user-item {
      padding: 15px;
      .avatar {
        flex: 0 0 auto;
        margin-right: 12px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .stat-item {
      margin-bottom: 9px;
      padding: 0 15px;
      i {
        margin-right: 10px;
        display: inline-block;
      }
      .content {
        font-size: 14px;
        color: #000;
      }
    }
  }
  .related-entry-sidebar-block {
    .item {
      display: block;
      padding: 12px 15px;
    }
    .entry-title {
      font-size: 14px;
      color: #333;
    }
    .entry-meta-box {
      margin-top: 4px;
    }
    .entry-meta {
      display: inline-block;
      margin-right: 15px;
      font-size: 12px;
      color: #c2c2c2;
    }
    .count {
      color: #b2bac2;
      margin-left: 5px;
    }
  }
}
</style>
