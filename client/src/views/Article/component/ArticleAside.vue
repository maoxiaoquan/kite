<template>
  <div class="article-aside">
    <div class="sidebar-block author-block  client-card">
      <div class="block-title">关于作者</div>
      <div class="block-body">
        <div class="user-item item">
          <div class="lazy avatar avatar loaded"
               :style='`background-image: url("${userInfo.avatar}");`'></div>
          <div class="info-box">
            <router-link class="username"
                         :to="{name:'user',params:{uid:userInfo.uid,routeType:'article'}}">
              {{userInfo.nickname}}</router-link>
            <div class="position">
              {{userInfo.profession}} @ {{userInfo.company}}
            </div>
          </div>
        </div>
        <div class="stat-item item">
          <i class="el-icon-document"></i>
          <span class="content">文章总数 <em class="count">{{userInfo.articleCount||0}}</em></span>
        </div>
        <div class="stat-item item">
          <i class="el-icon-chat-line-square"></i>
          <span class="content">
            片刻总数
            <em class="count">{{userInfo.dynamicCount||0}}</em>
          </span>
        </div>
      </div>
    </div>

    <div class="sidebar-block related-entry-sidebar-block client-card">
      <div class="block-title">最新文章</div>
      <div class="block-body">
        <div class="entry-list">
          <router-link class="item"
                       v-for="(item,key) in  recommendArticle"
                       :key="key"
                       :to="{name:'article',params:{aid:item.aid}}">
            <div class="entry-title">
              {{item.title}}
            </div>
            <div class="entry-meta-box">
              <div class="entry-meta">
                <i class="el-icon-thumb icon"></i>
                <span class="count">{{item.thumb_count}}</span>
              </div>
              <div class="entry-meta">
                <i class="el-icon-chat-dot-square icon"></i>
                <span class="count">{{item.comment_count}}</span>
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
export default {
  data () {
    return {
      userInfo: {},
      recommendArticle: []
    }
  },
  mounted () {
    this.getUserInfo() // 获取用户的信息
  },
  computed: {
    article () {
      return this.$store.state.article.article || {}
    },
    ...mapState(['website', 'personalInfo', 'user'])
  },
  methods: {
    getUserInfo () {
      this.$store.dispatch('graphql/GET_USER_INFO', { uid: this.article.uid }).then(result => {
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
    margin-bottom: 15px;
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
  .author-block {
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
      font-size: 12px;
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
