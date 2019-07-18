<template>

  <div class="user-center-article-view">
    <div v-if="topic_article_show">
      <ul class="topic-list">
        <li class="title">个人专题：</li>
        <li :class="{'current':!$route.query.topic_id||$route.query.topic_id==='all'}">
          <router-link :to='{name:"userTopic",query:{topic_id:"all"}}'>
            全部
          </router-link>
        </li>

        <li v-for="item in user_article_topic_all"
            :class="{'current':item.topic_id==$route.query.topic_id}">
          <router-link :to='{name:"userTopic",query:{topic_id:item.topic_id}}'
                       class="avatar">
            {{ item.topic_name }}
          </router-link>
        </li>

        <template v-if="personal_info.user.uid===user_info.user.uid">
          <li>
            <a class="btn btn-green"
               @click="create_show_modal=true"
               href="javascript:;">创建新专题</a>
          </li>
          <li>
            <a class="btn btn-info"
               href="javascript:;"
               @click="topic_article_show=false">编辑专题</a>
          </li>
        </template>
      </ul>

      <!-- use the modal component, pass in the prop -->
      <el-dialog :visible.sync="create_show_modal"
                 width="300px">
        <div class="topic-modal">
          <div class="form-group">
            <label for="topic-name-input">专题名字</label>
            <input type="email"
                   v-model="topic_name"
                   class="form-control"
                   id="topic-name-input"
                   placeholder="请输入个人文章专题名字">
          </div>
          <div class="form-group">
            <label for="article-topic-description">专题描述</label>
            <textarea v-model="topic_description"
                      type="password"
                      class="form-control"
                      id="article-topic-description"
                      placeholder="请输入个人文章专题描述"></textarea>
          </div>
          <div class="footer-view">
            <button type="button"
                    class="btn btn-primary topic-modal-create"
                    @click="create_new_user_topic">创建
            </button>
            <button type="button"
                    @click="create_show_modal=false"
                    class="btn btn-secondary topic-modal-cancel">取消
            </button>
          </div>
        </div>
      </el-dialog>

      <div class="list-container">
        <!-- 文章列表模块 -->
        <div class="article-view">
          <div class="article-item"
               v-for="(item,key) in my_article.article_list"
               :key="key">
            <TopicArticleItem @delete-change="update_article_list"
                              :articleItem="item" />
          </div>
        </div>
        <Page :count="pagination"
              :page="Number($route.query.page)||1"
              @pageChange="pageChange"></Page>
      </div>
    </div>

    <div v-else="topic_article_show"
         id="user-article-topic-view">
      <button type="button"
              @click="topic_article_show=true"
              class="btn btn-secondary btn-sm">返回</button>

      <div class="user-article-topic-table">
        <div class="user-article-topic-item">
          <div class="input-view">
            <span class="title">专题名字</span>
          </div>
          <div class="input-view">
            <span class="title">专题简介</span>
          </div>
          <div class="operate">
            <span class="title">操作</span>
          </div>
        </div>
        <TopicList :item="item"
                   v-for="(item,key) in user_article_topic_all"
                   :key="key"
                   @update-list="get_user_article_topic_list" />

      </div>
    </div>
  </div>
  <!--article-list-lay layout-content end-->
</template>

<script>

import TopicList from '../component/TopicList'
import TopicArticleItem from '../component/TopicArticleItem'
import { Page } from '@components'

export default {
  name: 'Topic',
  metaInfo () {
    return {
      title: '个人专题',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return store.dispatch('user/USER_MY_ARTICLE', {
      uid: route.params.uid,
      topic_id: route.query.topic_id || 'all',
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  data () {
    return {
      create_show_modal: false,
      topic_article_show: true,
      topic_name: '',
      topic_description: '',
      topic_list: [],
    }
  },
  created () {
    this.get_user_article_topic_list()
  },
  methods: {
    update_article_list () {
      this.$store.dispatch('user/USER_MY_ARTICLE', {
        uid: this.$route.params.uid,
        topic_id: this.$route.query.topic_id || 'all',
        page: this.$route.query.page || 1,
        pageSize: this.$route.query.pageSize || 10,
      })
    },
    create_new_user_topic () {
      var that = this
      this.$store.dispatch('user/CREATE_ARTICLE_TOPIC', {
        topic_name: that.topic_name,
        topic_description: that.topic_description,
      })
        .then(res => {
          if (res.state === 'success') {
            that.create_show_modal = false
            that.topic_name = ''
            that.topic_description = ''
            this.$message.success('创建成功')
            this.get_user_article_topic_list()
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    async get_user_article_topic_list () {
      await this.$store.dispatch('user/GET_USER_ARTICLE_TOPIC', { uid: this.$route.params.uid})
    },
    pageChange (val) {
      this.$router.push({
        name: 'userTopic',
        query: {
          topic_id: this.current_topic_id,
          page: val
        }
      })
    }
  },
  computed: {
    personal_info () { // 登录后的个人信息
      return this.$store.state.personal_info || {}
    },
    user_info () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
    pagination () { // 分页
      return Math.ceil(this.my_article.count / this.my_article.pageSize)
    },
    my_article () { // 用户个人的文章
      return this.$store.state.user.my_article || {}
    },
    current_topic_id () {
      return this.$route.query.topic_id || 'all'
    },
    user_article_topic_all () { // 个人所有专栏
      return this.$store.state.user.user_article_topic || []
    },
  },
  components: {
    TopicList,
    TopicArticleItem,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-center-article-view {
  margin-top: 20px;
}

.topic-list {
  li {
    display: inline-block;
    margin: 6px 0;
    &.title {
      color: #999999;
      margin-right: 10px;
    }
    a {
      display: block;
      padding: 0 15px;
      font-size: 14px;
      border-radius: 5px;
      margin: 0 5px;
    }
    &.current {
      a {
        color: #ffffff;
        background: #ffc107;
      }
    }
    &:hover {
      a {
        color: #ffc107;
      }
      &.current {
        a {
          color: #ffffff;
          background: #ffc107;
        }
      }
    }
  }
}

.list-container {
  .article-view {
    > .article-item {
      border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      &:hover {
        background: #f9f9f9;
      }
    }
  }
}

#user-article-topic-view {
  margin-top: 20px;
  .btn-secondary {
    margin-bottom: 20px;
  }
  .user-article-topic-table {
    display: block;
    width: 100%;
  }
  .user-article-topic-item {
    margin-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
    display: flex;
    input {
      border: 1px solid #e0e0e0;
      padding: 5px;
      display: block;
    }
    .input-view,
    .operate {
      flex: 1;
    }
    .input-view {
      margin-right: 5px;
      font-size: 14px;
    }
    .operate {
      padding: 3px 0 0 3px;
    }
    &.active {
      input {
        border-color: #fff;
        pointer-events: none;
      }
    }
  }
}

.topic-modal {
  .form-group {
    margin-bottom: 10px;
    label {
      font-size: 14px;
      margin: 3px 0;
      display: block;
    }
    .form-control {
      display: block;
      border: 1px solid #eaeaea;
      width: 100%;
      padding: 5px 10px;
      font-size: 14px;
    }
  }
  .footer-view {
    text-align: center;
    margin-top: 25px;
    .btn {
      margin: 0 5px;
      padding: 6px 25px;
    }
  }
}
</style>
