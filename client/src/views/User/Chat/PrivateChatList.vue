<template>
  <client-only>
    <section class="private-chat">
      <div class="container box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8">
            <div class="chat-user-list">
              <div class="title">私聊列表</div>

              <div class="chat-user-list-view">
                <router-link
                  :to="{
                    name: 'privateChat',
                    query: {
                      uid: item.uid,
                      nickname: item.nickname
                    }
                  }"
                  v-for="(item, key) in chatUserList"
                  :key="key"
                  class="chat-user-item clearfix"
                >
                  <div class="avatar">
                    <img v-lazy="item.avatar" class="user-avatar" alt="" />
                  </div>
                  <div class="nickname">{{ item.nickname }}</div>
                  <div class="unread">
                    <span class="unread-num" v-if="item.unreadNum > 0">
                      {{ item.unreadNum }}</span
                    >
                  </div>
                </router-link>
              </div>
              <Page
                :total="Number(count)"
                :pageSize="Number(pageSize)"
                :page="Number(page) || 1"
                @pageChange="pageChange"
              ></Page>
            </div>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4">
            <UserAside />
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import ClientOnly from 'vue-client-only'
import UserAside from '../view/UserAside'
import { Page } from '@components'
import { mapState } from 'vuex'
export default {
  name: 'PrivateChat',
  data() {
    return {
      content: '',
      count: 0,
      pageSize: 25,
      page: 1,
      chatUserList: []
    }
  },
  mounted() {
    this.getPrivateChatList()
  },
  methods: {
    getPrivateChatList() {
      this.$store
        .dispatch('chat/GET_PRIVATE_CHAT_LIST', {
          page: this.page,
          pageSize: Number(this.pageSize)
        })
        .then(result => {
          this.count = result.data.count
          this.chatUserList = result.data.list.map(item => {
            let data = {}
            data = item.user
            data.unreadNum = item.unreadNum
            return data
          })
        })
    },
    pageChange(val) {
      this.page = val
      this.getPrivateChatList()
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    ClientOnly,
    UserAside,
    Page
  }
}
</script>

<style scoped lang="scss">
.private-chat {
  .chat-user-list {
    background: #fff;
    padding-bottom: 25px;
    .title {
      padding: 15px;
      font-size: 14px;
      border-bottom: 1px solid #f0f0f0;
    }
    .chat-user-list-view {
      padding: 15px;
    }
    .chat-user-item {
      padding: 10px;
      display: block;
      border-bottom: 1px solid #f0f0f0;
      .avatar {
        float: left;
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 20px;
        }
      }
      .nickname {
        float: left;
        line-height: 50px;
        font-size: 14px;
        padding-left: 20px;
      }
      .unread {
        float: right;
        .unread-num {
          background: #f50;
          color: #fff;
          padding: 1px 5px;
          display: block;
          font-size: 13px;
          line-height: 15px;
          border-radius: 12px;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
