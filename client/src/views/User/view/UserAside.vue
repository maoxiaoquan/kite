<template>
  <div class="user-aside-view">
    <router-link
      class="return-user client-card"
      v-if="$route.name !== 'user'"
      :to="{
        name: 'user',
        params: { uid: personalInfo.user.uid, routeType: 'article' }
      }"
    >
      返回个人中心 <i class="el-icon-d-arrow-right"></i>
    </router-link>

    <ul
      class="list user-role client-card-shadow"
      v-if="
        $route.name === 'user' &&
          user.user.user_role_ids &&
          userRoleAll &&
          user.user.user_role_ids !== 'ordinary_role_100000'
      "
    >
      <li
        class="badge-icon"
        v-for="(item, key) in userRoleAll"
        :key="key"
        v-if="
          ~user.user.user_role_ids
            .split(',')
            .indexOf(String(item.user_role_id)) && item.is_show
        "
      >
        <a target="_blank" href="javascript:;">
          <span class="tag-name">{{ item.user_role_name }}</span>
        </a>
      </li>
    </ul>

    <ul class="aside-operat client-card-shadow" v-if="personalInfo.islogin">
      <li @click="checkIn">
        <a href="javascript:;">
          <i class="icon el-icon-bell"></i>
          <span class="box-title check-in"> 签到</span>
        </a>
      </li>
      <li>
        <router-link class="collection" :to="{ name: 'personal' }">
          <i class="icon el-icon-folder-opened"></i>
          <span class="box-title">收藏集</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection" :to="{ name: 'shellDetail' }">
          <i class="icon el-icon-notebook-2"></i>
          <span class="box-title">贝壳明细</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection" :to="{ name: 'myOrder' }">
          <i class="icon el-icon-notebook-1"></i>
          <span class="box-title">我的订单</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'subscribe_tag', params: { type: 'my' } }">
          <i class="icon el-icon-price-tag"></i>
          <span class="box-title">关注标签</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection" :to="{ name: 'experienceDetail' }">
          <i class="icon el-icon-document-checked"></i>
          <span class="box-title">经验明细</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection" :to="{ name: 'privateChatList' }">
          <i class="icon el-icon-chat-line-round"></i>
          <span class="box-title">私聊</span>
        </router-link>
      </li>
    </ul>

    <div class="client-card" v-if="$route.name === 'user'">
      <div class="title">个人介绍</div>
      <div class="description">
        <div class="js-intro">
          <template v-if="user.user.introduction">
            {{ user.user.introduction }}
          </template>
          <template v-else>
            暂无简介
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover, Face } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'UserAside',
  data() {
    return {
      userRoleAll: ''
    }
  },
  mounted() {
    this.$store.dispatch('user/GET_USER_ROLE_ALL').then(result => {
      this.userRoleAll = result.data.user_role_all || ''
    })
  },
  computed: {
    ...mapState(['personalInfo', 'user'])
  },
  methods: {
    checkIn() {
      this.$store.dispatch('virtual/CHECK_IN').then(result => {
        if (result.state === 'success') {
          this.$message.warning(result.message)
        } else {
          this.$message.warning(result.message)
        }
      })
    }
  },
  components: {
    Popover
  }
}
</script>

<style scoped lang="scss">
.user-role {
  padding: 24px;
  li {
    display: inline-block;
    margin-right: 10px;
    &.badge-icon .tag-name {
      font-size: 14px;
    }
  }
}
.box-aside {
  .list {
    margin-bottom: 10px;
    padding-bottom: 10px;
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
}

.user-aside-view {
  .return-user {
    display: block;
    margin-bottom: 15px;
    font-size: 14px;
  }
  .client-card {
    margin-bottom: 10px;
    padding: 20px;
  }
}

.aside-operat {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 20px 20px 0px;
  margin-bottom: 10px;
  li {
    width: 33%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 25px;
    a,
    span {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-flex: 1;
      -ms-flex: 1 1;
      flex: 1 1;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      color: currentColor;
      .icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: end;
        -ms-flex-align: end;
        align-items: flex-end;
        width: 25px;
        height: 25px;
        margin-bottom: 10px;
      }
      .box-title {
        font-size: 15px;
        color: #8590a6;
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
