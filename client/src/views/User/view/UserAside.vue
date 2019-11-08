<template>
  <div class="user-aside-view">
    <ul class="list user-dynamic"
        v-if="user.user.user_role_ids">
      <li class="badge-icon"
          v-for="(item,key) in user.user_role_all"
          :key="key"
          v-if="~user.user.user_role_ids.split(',')
            .indexOf(String(item.user_role_id))&&item.is_show">
        <a target="_blank"
           href="javascript:;">
          <span class="tag-name">{{item.user_role_name}}</span>
        </a>
      </li>
    </ul>

    <div class="check-in"
         v-if="personalInfo.islogin">
      <span class="check"
            @click="checkIn">签到</span>
    </div>

    <ul class="aside-operat"
        v-if="personalInfo.islogin">
      <li>
        <router-link class="collection"
                     :to='{name:"personal"}'>
          <span class="collection-name"> <i class="el-icon-s-management"></i> 收藏集</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection"
                     :to='{name:"shellDetail"}'>
          <span class="collection-name"> <i class="el-icon-s-management"></i> 贝壳明细</span>
        </router-link>
      </li>
      <li>
        <router-link class="collection"
                     :to='{name:"myOrder"}'>
          <span class="collection-name"> <i class="el-icon-s-management"></i> 我的订单</span>
        </router-link>
      </li>
    </ul>

    <ul class="list user-dynamic"
        v-if="personalInfo.islogin&&personalInfo.user.uid===user.user.uid">
      <li>
        <router-link :to='{name:"subscribe_tag",params:{type:"my"}}'>
          <span class="collection-name">关注的文章标签</span>
        </router-link>
      </li>
    </ul>

    <div class="title">个人介绍</div>
    <div class="description">
      <div class="js-intro">
        <template v-if="user.user.introduction">
          {{user.user.introduction}}
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
import { Popover, Face } from "@components";
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
  .check-in {
    margin-top: 20px;
    margin-bottom: 20px;
    background: #f0f0f0;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
    .check {
      display: inline-block;
      padding: 8px 18px;
      font-size: 13px;
      color: #fff;
      background: #00bcd4;
      border-radius: 6px;
      cursor: pointer;
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
