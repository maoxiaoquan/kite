<template>
  <div class="article-aside">
    <div class="sidebar-block author-block  client-card">
      <div class="block-title">关于作者</div>
      <div class="block-body">
        <a href="/user/59c3d4a35188252f923830e7"
           target="_blank"
           rel=""
           class="user-item item">
          <div class="lazy avatar avatar loaded"
               style='background-image: url("https://user-gold-cdn.xitu.io/2019/10/31/16e21c965d87845b?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1");'></div>
          <div class="info-box">
            <a href="/user/59c3d4a35188252f923830e7"
               target="_blank"
               class="username">
              B_Cornelius
              <img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-3.e108c68.svg"
                   alt="lv-3" /></a>
            <div class="position">
              我是菜鸡前端 @ 作业帮
            </div>
          </div>
        </a>
        <div class="stat-item item">
          <i class="el-icon-document"></i>
          <span class="content">文章总数 <em class="count">3,100</em></span>
        </div>
        <div class="stat-item item">
          <i class="el-icon-chat-line-square"></i>
          <span class="content">
            片刻总数
            <em class="count">74,108</em>
          </span>
        </div>
      </div>
    </div>

    <div class="sidebar-block related-entry-sidebar-block client-card">
      <div class="block-title">相关文章</div>
      <div class="block-body">
        <div class="entry-list">
          <a href="/post/59cb6307f265da064e1f65b9"
             target="_blank"
             class="item">
            <div class="entry-title">
              前端面试之webpack篇
            </div>
            <div class="entry-meta-box">
              <div class="entry-meta">
                <img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg"
                     class="icon" /><span class="count">896</span>
              </div>
              <div class="entry-meta">
                <img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.a7c8341.svg"
                     class="icon" /><span class="count">20</span>
              </div>
            </div>
          </a>
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

    }
  },
  created () {
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
        console.log('result', result)
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
