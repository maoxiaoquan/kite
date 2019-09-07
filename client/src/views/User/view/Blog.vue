<template>

  <div class="user-center-article-view">
    <div v-if="isBlogListShow">
      <ul class="blog-list">
        <li class="title">个人专题：</li>
        <li :class="{'current':!$route.query.blog_id||$route.query.blog_id==='all'}">
          <router-link :to='{name:"userBlog",query:{blog_id:"all"}}'>
            全部
          </router-link>
        </li>

        <li v-for="(item,key) in userArticleBlogAll"
            :class="{'current':item.blog_id==$route.query.blog_id}"
            :key="key">
          <router-link :to='{name:"userBlog",query:{blog_id:item.blog_id}}'
                       class="avatar">
            {{ item.name }}
          </router-link>
        </li>

        <template v-if="personalInfo.user.uid===userInfo.user.uid">
          <li>
            <a class="btn btn-green"
               @click="isCreateBlogShow=true"
               href="javascript:;">创建新专题</a>
          </li>
          <li>
            <a class="btn btn-info"
               href="javascript:;"
               @click="isBlogListShow=false">编辑专题</a>
          </li>
        </template>
      </ul>

      <!-- use the modal component, pass in the prop -->
      <el-dialog :visible.sync="isCreateBlogShow"
                 width="300px">
        <div class="blog-modal">
          <div class="form-group">
            <label for="blog-name-input">专题名字</label>
            <input type="email"
                   v-model="blogForm.blog_name"
                   class="form-control"
                   placeholder="请输入个人文章专题名字">
          </div>
          <div class="form-group">
            <label for="blog-name-input">专题英文名字</label>
            <input type="email"
                   v-model="blogForm.en_name"
                   class="form-control"
                   placeholder="请输入个人文章专题英文名字">
          </div>
          <div class="form-group">
            <label for="blog-name-input">是否公开</label>
            <div class="form-radio-view">
              <input type="radio"
                     name="sex"
                     :value="true"
                     class="form-input-radio"
                     v-model="blogForm.is_pubclic"><span>是</span>
              <input type="radio"
                     name="sex"
                     :value="false"
                     class="form-input-radio"
                     v-model="blogForm.is_pubclic"><span>否</span>
            </div>
          </div>

          <div class="form-group avatar-uploader avatar-uploader">
            <label for="blog-name-input">专栏封面图片（非必传）</label>
            <div class="avatar">
              <el-image :src="blogForm.icon"
                        lazy></el-image>
            </div>
            <div class="action-box">
              <div class="hint">支持 jpg、png 格式大小 1M 以内的图片</div>
              <upload-image class="upload-image"
                            @changeUpload="changeArticleBlogImg">上传图片</upload-image>
            </div>
          </div>

          <div class="form-group">
            <label for="article-blog-description">专题描述</label>
            <textarea v-model="blogForm.blog_description"
                      type="password"
                      class="form-control"
                      placeholder="请输入个人文章专题描述"></textarea>
          </div>
          <div class="footer-view">
            <button type="button"
                    class="btn btn-primary blog-modal-create"
                    @click="createNewUserBlog">创建
            </button>
            <button type="button"
                    @click="isCreateBlogShow=false"
                    class="btn btn-secondary blog-modal-cancel">取消
            </button>
          </div>
        </div>
      </el-dialog>

      <div class="list-container">
        <!-- 文章列表模块 -->
        <div class="article-view">
          <div class="article-item"
               v-for="(item,key) in myArticle.article_list"
               :key="key">
            <BlogArticleItem @delete-change="updateArticleList"
                             :articleItem="item" />
          </div>
        </div>
        <Page :count="pagination"
              :page="Number($route.query.page)||1"
              @pageChange="pageChange"></Page>
      </div>
    </div>

    <div v-else="isBlogListShow"
         id="user-article-blog-view">
      <button type="button"
              @click="returnBlogHome"
              class="btn btn-secondary btn-sm">返回</button>

      <div class="user-article-blog-table">
        <div class="user-article-blog-item">
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
        <BlogList :item="item"
                  v-for="(item,key) in userArticleBlogAll"
                  :key="key" />

      </div>
    </div>
  </div>
  <!--article-list-lay layout-content end-->
</template>

<script>

import BlogList from '../component/BlogList'
import BlogArticleItem from '../component/BlogArticleItem'
import { Page, UploadImage } from '@components'

export default {
  name: 'Blog',
  metaInfo () {
    return {
      title: '个人专栏',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route }) {
    return store.dispatch('user/USER_MY_ARTICLE', {
      uid: route.params.uid,
      blog_id: route.query.blog_id || 'all',
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  data () {
    return {
      isCreateBlogShow: false,
      isBlogListShow: true,
      blog_list: [],
      blogForm: {
        blog_name: '',
        en_name: '',
        blog_description: '',
        is_pubclic: false,
        icon: ''
      },
    }
  },
  created () {
    this.getUserArticleBlogList()
  },
  methods: {
    updateArticleList () {
      this.$store.dispatch('user/USER_MY_ARTICLE', {
        uid: this.$route.params.uid,
        blog_id: this.$route.query.blog_id || 'all',
        page: this.$route.query.page || 1,
        pageSize: 10,
      })
    },
    returnBlogHome () {
      this.isBlogListShow = true
      this.getUserArticleBlogList()
    },
    createNewUserBlog () {
      this.$store.dispatch('user/CREATE_ARTICLE_BLOG', {
        ...this.blogForm
      })
        .then(res => {
          if (res.state === 'success') {
            this.isCreateBlogShow = false
            this.blog_name = ''
            this.blog_description = ''
            this.$message.success('创建成功')
            this.getUserArticleBlogList()
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    async getUserArticleBlogList () {
      await this.$store.dispatch('user/GET_USER_ARTICLE_BLOG', { uid: this.$route.params.uid })
    },
    changeArticleBlogImg ({ formData, config }) {
      this.$store.dispatch('articleBlog/UPLOAD_ARTICLE_BLOG_IMG', formData)
        .then(result => {
          if (result.state === 'success') {
            this.blogForm.icon = result.data.img
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    pageChange (val) {
      this.$router.push({
        name: 'userBlog',
        query: {
          blog_id: this.currentBlogId,
          page: val
        }
      })
    }
  },
  computed: {
    personalInfo () { // 登录后的个人信息
      return this.$store.state.personalInfo || {}
    },
    userInfo () { // 登录后的个人信息
      return this.$store.state.user.user_info || {}
    },
    pagination () { // 分页
      return Math.ceil(this.myArticle.count / this.myArticle.pageSize)
    },
    myArticle () { // 用户个人的文章
      return this.$store.state.user.my_article || {}
    },
    currentBlogId () {
      return this.$route.query.blog_id || 'all'
    },
    userArticleBlogAll () { // 个人所有专栏
      return this.$store.state.user.user_article_blog || []
    },
  },
  components: {
    BlogList,
    BlogArticleItem,
    UploadImage,
    Page
  }
}
</script>

<style scoped lang="scss">
.user-center-article-view {
  margin-top: 20px;
}

.blog-list {
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

#user-article-blog-view {
  margin-top: 20px;
  .btn-secondary {
    margin-bottom: 20px;
  }
  .user-article-blog-table {
    display: block;
    width: 100%;
  }
  .user-article-blog-item {
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

.blog-modal {
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
    .form-radio-view {
      margin-top: 10px;
      span {
        display: inline-block;
        margin-right: 20px;
      }
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
