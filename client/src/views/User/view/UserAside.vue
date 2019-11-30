<template>
  <div class="user-aside-view">
    <ul class="list user-dynamic"
        v-if="user.user.user_role_ids && user.user_role_all">
      <li class="badge-icon"
          v-for="(item, key) in user.user_role_all"
          :key="key"
          v-if="
          ~user.user.user_role_ids
            .split(',')
            .indexOf(String(item.user_role_id)) && item.is_show
        ">
        <a target="_blank"
           href="javascript:;">
          <span class="tag-name">{{ item.user_role_name }}</span>
        </a>
      </li>
    </ul>

    <ul class="aside-operat"
        v-if="personalInfo.islogin && personalInfo.user.uid === user.user.uid">
      <li v-if="personalInfo.islogin && personalInfo.user.uid === user.user.uid"
          @click="checkIn">
        <span class="check-in"> <i class="el-icon-bell"></i> 签到</span>
      </li>
      <li>
        <router-link class="collection"
                     :to="{ name: 'personal' }">
          <i class="el-icon-folder-opened"></i>
          收藏集
        </router-link>
      </li>
      <li>
        <router-link class="collection"
                     :to="{ name: 'shellDetail' }">
          <i class="el-icon-notebook-2"></i>
          贝壳明细
        </router-link>
      </li>
      <li>
        <router-link class="collection"
                     :to="{ name: 'myOrder' }">
          <i class="el-icon-notebook-1"></i>
          我的订单
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'subscribe_tag', params: { type: 'my' } }">
          <i class="el-icon-price-tag"></i>
          关注的文章标签
        </router-link>
      </li>
    </ul>

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
</template>

<script>
import { Popover, Face } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'UserAside',
  created () {
    this.$store.dispatch('user/GET_USER_ROLE_ALL')
  },
  computed: {
    ...mapState(['personalInfo', 'user'])
  },
  methods: {
    checkIn () {
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
}

.aside-operat {
  li {
    display: inline-block;
    margin-bottom: 10px;
    a,
    span {
      padding: 5px 13px;
      display: block;
      background: #f3f3f3;
      font-size: 14px;
      border-radius: 5px;
      color: rgba(0, 0, 0, 0.88);
      i {
        display: inline-block;
      }
      &.collection {
        background: #ffe699;
      }
    }
    .check-in {
      background: #fd763a;
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
