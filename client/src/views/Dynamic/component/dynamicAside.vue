<template>
  <aside class="dynamic-aside">
    <div class="profile-box shadow">
      <div class="profile">
        <a>
          <el-image class="avatar"
                    size="size"
                    src="circleUrl">
          </el-image>
        </a>
        <div class="user-info">
          <a class="username ellipsis">靖丶之</a>
          <div class="position ellipsis">das46564</div>
        </div>
      </div>
      <ul class="stat-list">
        <a class="item">
          <div class="title">沸点</div>
          <div class="count">0</div>
        </a><a class="item">
          <div class="title">关注</div>
          <div class="count">34</div>
        </a><a class="item">
          <div class="title">关注者</div>
          <div class="count">0</div>
        </a>
      </ul>
    </div>

    <div class="related-dynamic-block dynamic-block shadow">
      <header class="title">推荐沸点</header>
      <ul class="dynamic-list"
          v-for="x in 3">
        <li class="item">
          <router-link class="dynamic"
                       :to='{name:"dynamicView",params:{dynamicId:1}}'>
            <div class="content-box">
              <div class="content">掘金文章评论 点赞 会下大拇指雨 hhh 有点意思</div>
              <div class="stat item"
                   style="margin-top: 0.83rem;"><span>210 赞 · </span><span>84 评论</span></div>
            </div>

          </router-link>
        </li>
      </ul>
    </div>

    <div class="topic-sidebar shadow topics shadow">
      <div class="title"><span>关注的话题</span><a href="/topics"
           target="_blank"
           rel="">全部<i class="icon ion-chevron-right"></i></a></div>
      <div class="content">
        <ul class="topic-list topic_list">
          <li>
            <div class="topic-item">
              <div class="lazy icon loaded immediate"
                   style="background-image: url(&quot;https://user-gold-cdn.xitu.io/2018/5/15/1635f8400e159843?imageView2/1/w/80/h/80/q/85/format/webp/interlace/1&quot;);"></div>
              <div class="content"><span data-v-57a73037="">一图胜千言</span><span data-v-57a73037="">4580 关注 · 3364 沸点</span>
                <!---->
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </aside>
</template>

<script>
export default {

}
</script>

<style scope lang="scss">
.profile-box {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0.2rem;
  margin-bottom: 8px;
  font-size: 13px;
  .profile {
    display: flex;
    padding: 16px;
    height: 248px;
    max-height: 92px;
    border-bottom: 1px solid rgba(92, 96, 102, 0.1);
    .avatar {
      flex: 0 0 auto;
      margin-right: 1rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 1px solid #fff;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
    }
    .user-info {
      position: relative;
      margin: 12px 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .username {
        color: #17181a;
        font-size: 15px;
        font-weight: 600;
        line-height: 1.2;
      }
      .position {
        color: #8f969c;
      }
    }
  }
  .stat-list {
    flex: 1 1 auto;
    display: flex;
    margin: 0;
    list-style: none;
    text-align: center;
    padding: 16.5px 0;
    .item {
      flex: 1 1 33.333%;
      max-height: 83px;
      line-height: 1;
    }
    .item:not(:last-child) {
      border-right: 1px solid rgba(92, 96, 102, 0.1);
    }
  }
}

.dynamic-block {
  margin-bottom: 8px;
}
.shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.related-dynamic-block {
  .title {
    color: #2e3135;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    padding: 13px 16px;
    border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
  }
  .dynamic-list {
    padding: 0 16px;
    .item {
      padding: 12px 0;
    }
    .item:not(:last-child) {
      border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
    }
    .dynamic {
      display: flex;
      justify-content: space-between;
    }
    .content-box {
      display: flex;
      align-content: space-between;
      flex-direction: column;
      .content {
        color: #2e3135;
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
    .stat {
      color: #76797e;
      font-size: 12px;
      margin-top: auto;
    }
  }
}

.topic-sidebar .content {
  padding: 0 15px 6px;
}
.topic-sidebar {
  .title {
    padding: 10px 13px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
    a {
      color: #007fff;
      font-size: 13px;
    }
  }
  .topic-list {
    .topic-item {
      display: flex;
      flex-grow: 0;
      margin: 0;
      align-items: flex-start;
      cursor: pointer;
      padding: 10px 0;
      .icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background-size: cover;
        background-repeat: no-repeat;
      }
      .content-box {
        color: #8a9aa9;
        width: 144px;
        max-width: 144px;
        letter-spacing: normal;
        text-align: left;
        margin-left: 14px;
        display: flex;
        flex-direction: column;
        span {
          padding-top: 2px;
          font-size: 13px;
        }
      }
    }

    .content {
      color: #8a9aa9;
      width: 144px;
      max-width: 144px;
      letter-spacing: normal;
      text-align: left;
      margin-left: 14px;
      display: flex;
      flex-direction: column;
      span {
        padding-top: 2px;
        font-size: 13px;
      }
      span:first-child {
        color: #2e3135;
        font-size: 13px;
      }
    }
  }
}
</style>
