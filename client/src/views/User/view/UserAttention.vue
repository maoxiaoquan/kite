<template>
  <div class="user-attention">
    <div class="user-article-attention-any">
      <router-link :to="{name:'userAttention',query:{any:'me'}}"
                   :class="{'active':$route.query.any==='me'||!$route.query.any}">{{personalInfo.user.uid===$route.params.uid?'我':'他'}}关注的</router-link>
      <router-link :to="{name:'userAttention',query:{any:'other'}}"
                   :class="{'active':$route.query.any==='other'}">关注{{personalInfo.user.uid===$route.params.uid?'我':'他'}}的</router-link>
    </div>

    <ul class="user-article-attention-view">
      <li class="item"
          v-for="(item,key) in userAttention.user_list"
          :key="key">
        <div class="user">
          <div class="lazy avatar avatar loaded"
               title
               :style="{'background-image':'url('+item.avatar+')'}"></div>
          <div class="info-box">
            <div class="username">
              <router-link :to="{name:'user',params:{uid:item.uid}}"
                           class="link">{{item.nickname }}</router-link>
            </div>
            <div class="detail">{{item.introduction }}</div>
          </div>
          <button class="follow-btn active"
                  v-if="$route.query.any==='me'||!$route.query.any"
                  v-show="item.uid!==personalInfo.user.uid"
                  @click="onUserAttention(item.uid,~userAttention.other_attention.indexOf(item.uid))">{{~userAttention.other_attention.indexOf(item.uid)?'互相关注':'关注'}}</button>

          <button class="follow-btn active"
                  v-show="item.uid!==personalInfo.user.uid"
                  v-else
                  @click="onUserAttention(item.uid,~userAttention.me_attention.indexOf(item.uid))">{{~userAttention.me_attention.indexOf(item.uid)?'互相关注':'关注'}}</button>
        </div>
      </li>
    </ul>

    <div class="pagination">
      <Page :total="userAttention.count"
            :pageSize="userAttention.pageSize"
            :page="Number($route.query.page)||1"
            @pageChange="pageChange"></Page>
    </div>
  </div>
</template>

<script>
import { Page } from "@components";
import { mapState } from 'vuex'
export default {
  name: "UserAttention",
  metaInfo () {
    return {
      title: "个人关注",
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route }) {
    return store.dispatch("user/GET_USER_ATTENTION_LIST", {
      uid: route.params.uid,
      page: route.query.page || 1,
      any: route.query.any || "me",
      pageSize: route.query.pageSize || 10
    });
  },
  methods: {
    pageChange (val) {
      this.$router.push({
        name: "userAttention",
        query: {
          any: this.$route.query.any || "me",
          page: val
        }
      });
    },
    onUserAttention (attention_uid, type) {
      this.$store
        .dispatch("user/USER_ATTENTION", {
          attention_uid: attention_uid,
          moreConfig: { direct: true }
        })
        .then(result => {
          this.$store.dispatch("user/GET_USER_ATTENTION_LIST", {
            uid: this.$route.params.uid
          });
          this.$message.warning(result.message);
        })
        .catch(function (err) {
          this.$message.warning(err);
        });
    }
  },
  computed: {
    ...mapState(['personalInfo']),
    userInfo () {
      // 登录后的个人信息
      return this.$store.state.user.user_info || {};
    },
    userAttention () {
      // 用户个人的文章
      return this.$store.state.user.user_attention || {};
    }
  },
  components: {
    Page
  }
};
</script>

<style scoped lang="scss">
.user-attention {
  margin-top: 20px;
  .user-article-attention-any {
    a {
      display: inline-block;
      font-size: 14px;
      margin-right: 15px;
      &.active {
        padding-bottom: 15px;
        color: #ffc107;
        border-bottom: 1px solid #ffc107;
      }
    }
  }
  .user-article-attention-view {
    .item {
      border-bottom: 1px solid hsla(240, 2%, 90%, 0.5);
      position: relative;
      box-sizing: border-box;
      .user {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 6px 28px;
        min-height: 85px;
        .avatar {
          display: inline-block;
          position: relative;
          background-position: 50%;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #eee;
          -webkit-box-flex: 0;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          margin-right: 20px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        .info-box {
          -webkit-box-flex: 1;
          -ms-flex: 1 1 auto;
          flex: 1 1 auto;
          min-width: 0;
          .username {
            font-size: 16px;
            font-weight: 600;
            color: #2e3135;
          }
          .detail {
            font-size: 12px;
            font-weight: 500;
            color: #b9c0c8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .follow-btn {
          -webkit-box-flex: 0;
          -ms-flex: 0 0 auto;
          flex: 0 0 auto;
          margin: 0 0 0 12px;
          padding: 0;
          width: 88px;
          height: 28px;
          font-size: 12px;
          color: #92c452;
          background-color: #fff;
          border: 1px solid #92c452;
          border-radius: 2px;
          &.active {
            color: #fff;
            background-color: #92c452;
          }
        }
      }
    }
  }
}
</style>
