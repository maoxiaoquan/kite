<template>
  <div class="user-aside-view">
    <ul class="list user-dynamic"
        v-if="userInfo.user.user_role_ids">
      <li class="badge-icon"
          v-for="(item,key) in userAside.user_role_all"
          :key="key"
          v-if="~userInfo.user.user_role_ids.split(',')
            .indexOf(String(item.user_role_id))&&item.is_show">
        <a target="_blank"
           href="javascript:;">
          <img width="20"
               heigth="20"
               v-if="item.user_role_icon"
               :src="item.user_role_icon"
               alt="">
          <span v-popover:user_role_info
                class="tag-name">{{item.user_role_name}}</span>
          <el-popover ref="user_role_info"
                      placement="bottom"
                      title="介绍"
                      width="200"
                      trigger="hover"
                      :content="item.user_role_description">
          </el-popover>
        </a>
      </li>
    </ul>

    <ul class="aside-operat">
      <li>
        <router-link class="collection"
                     :to='{name:"personalCollect"}'>
          <span class="collection-name"> <i class="el-icon-s-management"></i> 收藏集</span>
        </router-link>
      </li>
    </ul>

    <ul class="list user-dynamic"
        v-if="personalInfo.islogin&&personalInfo.user.uid===userInfo.user.uid">
      <li>
        <router-link :to='{name:"subscribe_tag",params:{type:"my"}}'>
          <span class="collection-name">关注的文章标签</span>
        </router-link>
      </li>
      <li>
        <router-link :to='{name:"articleBlogsLike"}'>
          <span class="collection-name">关注的个人专栏</span>
        </router-link>
      </li>
    </ul>

    <div class="title">个人介绍</div>
    <div class="description">
      <div class="js-intro">
        <template v-if="userInfo.user.introduction">
          {{userInfo.user.introduction}}
        </template>
        <template v-else>
          暂无简介
        </template>
      </div>
    </div>

    <div class="client-card article-info">
      <p class="info">
        专栏为个人文章的一个集合
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAside',
  data () {
    return {
      user_role_all: [],
      user: {},
      curr_user_role_ids: [],
      user_role_item: []
    }
  },
  created () {
    this.$store.dispatch('user/GET_USER_ROLE_ALL')
  },
  computed: {
    personalInfo () { // 登录后的个人信息
      return this.$store.state.personalInfo || {}
    },
    userAside () { // user 侧栏信息
      return this.$store.state.user.user_aside || {}
    },
    userInfo () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
  },
}
</script>

<style scoped lang="scss">
.box-aside {
  .list {
    margin-bottom: 16px;
    padding-bottom: 16px;
    list-style: none;
    border-bottom: 1px solid #f0f0f0;
    clear: both;
    li {
      margin-bottom: 10px;
      a {
        display: inline-block;
      }
    }
  }
  .function-btn {
    float: right;
    font-size: 13px;
    color: #969696;
  }
  .name {
    position: relative;
    max-width: 236px;
    vertical-align: middle;
    top: 1px;
    font-size: 14px;
    color: #333;
  }
  .user-dynamic {
    padding-bottom: 6px;
    a {
      font-size: 14px;
      color: #333;
    }
  }
  .badge-icon {
    img {
      margin-right: 3px;
    }
    .user-font-icon {
      margin-right: 3px;
      display: inline-block;
      vertical-align: middle;
    }
    .tag-name {
      display: inline-block;
      vertical-align: middle;
      padding: 1px 8px;
      border-radius: 15px;
      color: #ffffff;
      background: #00bcd4;
      font-size: 14px;
    }
  }
  .title {
    float: left;
    margin-bottom: 10px;
    font-size: 14px;
    color: #969696;
  }
  .description,
  .new-collection-block {
    position: relative;
    margin-bottom: 16px;
    padding: 0 0 16px;
    text-align: left;
    font-size: 0;
    border-bottom: 1px solid #f0f0f0;
    clear: both;
    word-break: break-word !important;
    word-break: break-all;
    .js-intro {
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 14px;
    }
  }
  .new-collection-btn {
    font-size: 13px;
    color: #42c02e;
  }
  .article-info {
    padding: 15px;
    background: #f9f9f9;
    p {
      font-size: 13px;
    }
  }
}

.aside-operat {
  li {
    display: block;
    margin-bottom: 10px;
    a {
      padding: 5px 13px;
      display: block;
      background: #f3f3f3;
      font-size: 14px;
      border-radius: 5px;
      color: rgba(0, 0, 0, 0.88);
      i {
        display: inline-block;
        margin-right: 15px;
      }
      &.collection {
        background: #ffe699;
      }
    }
  }
}

@media (max-width: 575px) {
  body {
    .user-aside-view {
      display: none;
    }
  }
}

/* user-lay layout-content end */
</style>
