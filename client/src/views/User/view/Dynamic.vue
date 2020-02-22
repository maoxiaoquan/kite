<template>
  <div class="user-dynamic" v-loading="isLoading">
    <div
      class="user-dynamic-item"
      v-for="(dynamicItem, key) in dynamicList.list"
      :key="key"
    >
      <div class="dynamic-header-row">
        <div class="account-group">
          <div class="user-popover-box">
            <router-link
              :to="{ name: 'user', params: { uid: dynamicItem.user.uid } }"
              class="user-link"
            >
              <img
                class="avatar"
                size="size"
                v-lazy="dynamicItem.user.avatar"
                alt=""
              />
            </router-link>
          </div>
          <div class="dynamic-header-content">
            <div class="user-popover-box">
              <router-link
                :to="{
                  name: 'user',
                  params: { uid: dynamicItem.user.uid, routeType: 'article' }
                }"
                class="username"
                >{{ dynamicItem.user.nickname }}</router-link
              >
            </div>
            <div class="meta-box">
              <div class="meta-box-item position ellipsis">
                @ {{ dynamicItem.user.introduction }}
              </div>
              <div class="dot">·</div>
              <a
                href="javascript:;"
                target="_blank"
                rel=""
                class="meta-box-item time-box"
              >
                <time :title="dynamicItem.create_dt" class="time">{{
                  dynamicItem.create_dt
                }}</time>
              </a>
              <div class="dot">·</div>
              <div
                class="meta-box-item like-action action"
                :class="{
                  active: ~user.associateInfo.dynamicThumdId.indexOf(
                    String(dynamicItem.id)
                  )
                }"
                @click="userThumdDynamic(dynamicItem)"
              >
                <i class="el-icon-thumb"></i>
                <span class="action-title">{{ dynamicItem.thumbCount }}</span>
              </div>
              <div class="dot">·</div>
              <div
                class="meta-box-item comment-action action"
                @click="isCommnet = !isCommnet"
              >
                <i class="el-icon-chat-line-round"></i>
                <span class="action-title">{{
                  dynamicItem.comment_count
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dynamic-content-row">
        <div class="content-box content-box">
          <div v-html="contentRender(dynamicItem.content)"></div>
          <div class="limit-ctl-box" v-if="dynamicItem.status === 3">
            审核失败原因：{{ dynamicItem.rejection_reason }}
          </div>
        </div>
      </div>

      <div class="dynamic-image-row" v-if="dynamicItem.type === 2">
        <img
          class="preview-picture"
          style="width: 100px; height: 100px"
          v-lazy="url"
          v-for="(url, key) in imgAnalyze(dynamicItem.attach)"
          :key="key"
          v-if="url"
          alt=""
        />
      </div>

      <div class="dynamic-link-row" v-if="dynamicItem.type === 3">
        <a :href="dynamicItem.attach" target="_block">{{
          dynamicItem.attach
        }}</a>
      </div>

      <div class="dynamic-topic-row" v-if="dynamicItem.topic">
        <router-link
          :to="{
            name: 'dynamicTopicView',
            params: { dynamicTopicId: dynamicItem.topic.topic_id }
          }"
          class="topic-title"
          >{{ dynamicItem.topic.name }}</router-link
        >
      </div>

      <div
        class="operat-view"
        v-if="
          personalInfo.islogin && personalInfo.user.uid === dynamicItem.user.uid
        "
      >
        <Dropdown>
          <div class="el-dropdown-link" slot="button">
            <i class="el-icon-more"></i>
          </div>
          <div class="dropdown-menu-view">
            <div
              class="dropdown-menu-item"
              @click="commandChange({ name: 'Write', id: dynamicItem.id })"
            >
              删除
            </div>
          </div>
        </Dropdown>
      </div>
    </div>

    <Page
      :total="Number(dynamicList.count)"
      :pageSize="Number(dynamicList.pageSize)"
      :page="Number(dynamicList.page) || 1"
      @pageChange="pageChange"
    ></Page>
  </div>
</template>

<script>
import { Page, faceQQ, Dropdown } from '@components'
import { mapState } from 'vuex'
import { modelType } from '@utils/constant'

export default {
  name: 'Dynamic',
  data() {
    return {
      isLoading: false,
      dynamicList: {
        // 个人中心动态列表
        count: 0,
        list: [],
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getPersonalDynamicList() // 获取当前用户发表的片刻
  },
  watch: {
    $route(to, from) {
      this.getPersonalDynamicList() // 获取当前用户发表的片刻
    }
  },
  methods: {
    selectAttentionUserClass(type) {
      let userAttentionAll = document.querySelectorAll(
        `.user-attention-${this.dynamicItem.user.uid}`
      )
      for (let i = 0; i < userAttentionAll.length; i++) {
        if (type === 'attention') {
          userAttentionAll[i].classList.add('active')
          userAttentionAll[i].innerHTML = '已关注'
        } else {
          userAttentionAll[i].classList.remove('active')
          userAttentionAll[i].innerHTML = '关注'
        }
      }
    },
    commandChange(val) {
      this.deleteDynamic(val.id)
    },
    contentRender(val) {
      let content = val
      faceQQ.map(faceItem => {
        content = content.replace(
          new RegExp('\\' + faceItem.face_text, 'g'),
          faceItem.face_view
        )
      })
      return content
    },
    deleteDynamic(id) {
      // 删除动态
      this.$confirm('此操作将永久删除该动态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store
            .dispatch('dynamic/DELETE_DYNAMIC', {
              id
            })
            .then(result => {
              if (result.state === 'success') {
                this.$message.success(result.message)
                this.getPersonalDynamicList()
              } else {
                this.$message.error(result.message)
              }
            })
        })
        .catch(() => {})
    },
    userThumdDynamic(dynamicItem) {
      if (!this.personalInfo.islogin) {
        this.$message.warning('请先登录')
        return false
      }
      /*用户like 动态*/
      this.$store
        .dispatch('common/SET_THUMB', {
          associate_id: dynamicItem.id,
          type: modelType.dynamic
        })
        .then(res => {
          if (res.state === 'success') {
            if (res.data.type === 'enter') {
              dynamicItem.thumbCount = Number(dynamicItem.thumbCount) + 1
            } else if (res.data.type === 'cancel') {
              dynamicItem.thumbCount -= 1
            }
            this.$store.dispatch('user/GET_ASSOCIATE_INFO')
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    imgAnalyze(attach) {
      let urlArr = attach.split(',') || []
      let length = attach.split(',').length
      return length > 0 ? urlArr : []
    },
    pageChange(val) {
      this.dynamicList.page = val
      this.getPersonalDynamicList()
    },
    getPersonalDynamicList() {
      this.isLoading = true
      this.$store
        .dispatch('user/GET_PERSONAL_DYNAMIC_LIST', {
          uid: this.$route.params.uid,
          page: this.dynamicList.page || 1,
          pageSize: this.dynamicList.pageSize || 10
        })
        .then(result => {
          this.dynamicList = result.data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  },
  components: {
    Page,
    Dropdown
  },
  computed: {
    ...mapState(['user', 'personalInfo'])
  }
}
</script>

<style scoped lang="scss">
.user-dynamic {
  padding-top: 20px;
  .user-dynamic-item {
    margin-bottom: 10px;
    padding-bottom: 10px;
    position: relative;
    border: 1px solid rgba(178, 186, 194, 0.15);
    .dynamic-content-row,
    .dynamic-image-row,
    .dynamic-link-row,
    .dynamic-topic-row {
      position: relative;
      margin: 5px 48px 5px 80px;
    }
    .account-group,
    .header-action {
      display: flex;
    }
    .dynamic-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 2rem 0 20px;
      .account-group {
        align-items: center;
      }
      .avatar {
        display: inline-block;
        position: relative;
        background-position: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #eee;
      }
      .avatar {
        flex: 0 0 auto;
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      .dynamic-header-content {
        margin-left: 12px;
      }
      .username {
        font-size: 12px;
        font-weight: 600;
        color: #2e3135;
      }
      .meta-box {
        display: flex;
        align-items: center;
        margin: 3px 0 0;
        font-size: 13px;
        color: #8a9aa9;
        cursor: default;
        .meta-box-item {
          font-size: 13px;
          display: inline-block;
          margin: 0 8px;
        }
        .like-action {
          &.active {
            color: #007fff;
          }
        }
      }
      .follow-button {
        margin: 0 0 0 auto;
        padding: 0;
        width: 55px;
        height: 23px;
        border-radius: 25px;
        font-size: 12px;
        border-color: #6cbd45;
        color: #6cbd45;
        border: 1px solid #37c700;
        background-color: #fff;
        &.active {
          border: 1px solid #999;
          color: #999;
        }
      }
    }
    .dynamic-content-row {
      margin-top: 5px;
      margin-bottom: 5px;
      .content-box {
        font-size: 15px;
        line-height: 20px;
        white-space: pre-line;
        color: #17181a;
        .emoji {
          width: 19px;
          height: 19px;
          vertical-align: sub;
        }
      }
      .limit-ctl-box {
        color: #f46300;
        margin-top: 5px;
        font-size: 12px;
      }
    }
    .dynamic-link-row {
      a {
        display: flex;
        align-items: center;
        padding: 3px 10px;
        max-width: 100%;
        background-color: #fff;
        border: 1px solid #ebebeb;
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
    .dynamic-image-row {
      .preview-picture {
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
    .dynamic-topic-row {
      .topic-title {
        font-size: 13px;
        display: inline-block;
        line-height: 22px;
        padding: 0 12px;
        border: 1px solid #007fff;
        border-radius: 14px;
        color: #007fff;
        user-select: none;
      }
    }
    .operat-view {
      position: absolute;
      right: 20px;
      top: 15px;
      cursor: pointer;
    }
  }
}
</style>
