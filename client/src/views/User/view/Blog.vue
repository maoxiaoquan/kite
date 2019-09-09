<template>
  <div class="user-article-blog">

    <el-button size="small"
               class="create-article-blog"
               type="primary"
               @click="createEditArticleBlog('create')">创建新的个人专栏</el-button>

    <div class="user-article-blog-view row">
      <div class="col-xs-12 col-sm-6 col-md-6"
           v-for="(articleBlogItem,key) in user.articleBlog.list"
           :key="key">
        <div class="user-article-blog-item">
          <div class="user-article-blog-top">
            <router-link class="article-blog-icon"
                         :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">
              <el-image class="article-blog-icon-img"
                        :src="articleBlogItem.icon"
                        lazy></el-image>
            </router-link>

            <div class="user-article-blog-info">
              <div class="info-content">
                <router-link class="name"
                             :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">{{articleBlogItem.name}}</router-link>
                <span class="article-count">文章总数：{{articleBlogItem.articleCount}}</span>
              </div>
              <p class="description">介绍：{{articleBlogItem.description}}</p>
            </div>

            <div class="operat-view"
                 v-if="personalInfo.islogin&&personalInfo.user.uid===articleBlogItem.user.uid">
              <el-dropdown trigger="click"
                           @command="commandChange">
                <div class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit"
                                    :command="{type:'edit',articleBlogItem}">修改</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete"
                                    :command="{type:'delete',articleBlogItem}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </div>
          <div class="user-article-blog-main">
            <ul>
              <li class="item item-icon read-count">
                <el-image class="user-avatar"
                          :src="articleBlogItem.user.avatar"
                          lazy></el-image>
                <router-link :to='{name:"user",params:{uid:articleBlogItem.user.uid}}'
                             class="nickname">{{articleBlogItem.user.nickname}}</router-link>
              </li>
              <li class="item item-icon read-count">
                <i class="el-icon-reading"></i>
                <strong v-text="articleBlogItem.read_count||0"></strong>
              </li>
              <li class="item item-icon like-article">
                <i class="el-icon-star-off"></i>
                <strong v-text="articleBlogItem.likeCount||0"></strong>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <Page :count="pagination"
          :page="Number($route.query.page)||1"
          @pageChange="pageChange"></Page>

    <!-- use the modal component, pass in the prop -->
    <el-dialog :visible.sync="isCreateBlogShow"
               width="380px">
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
                   v-model="blogForm.is_pubclic"><span>公开</span>
            <input type="radio"
                   name="sex"
                   :value="false"
                   class="form-input-radio"
                   v-model="blogForm.is_pubclic"><span>仅自己</span>
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
          <label for="blog-name-input">选择标签</label>
          {{blogForm.tag_ids}}
          <el-select filterable
                     multiple
                     :multiple-limit="3"
                     v-model="blogForm.tag_ids"
                     placeholder="请选择">
            <el-option v-for="(item,key) in articleTagAll"
                       :key="key"
                       :label="item.article_tag_name"
                       :value="item.article_tag_id">
            </el-option>
          </el-select>

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

  </div>
</template>

<script>
import { Page, UploadImage } from '@components'
import { mapState } from 'vuex'
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
    return store.dispatch('user/GET_USER_ARTICLE_BLOG_LIST', {
      uid: route.params.uid,
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10,
    })
  },
  data () {
    return {
      isCreateBlogShow: false,
      blogForm: {
        blog_name: '',
        en_name: '',
        blog_description: '',
        is_pubclic: false,
        icon: '',
        tag_ids: ''
      },
    }
  },
  mounted () {
    this.$store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
  },
  methods: {
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
    createEditArticleBlog (type) {
      this.isCreateBlogShow = true
      this.blogForm.blog_name = ''
      this.blogForm.en_name = ''
      this.blogForm.blog_description = ''
      this.blogForm.is_pubclic = false
      this.blogForm.icon = ''
      this.blogForm.tag_ids = ''
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
    deleteArticleBlog (blog_id) {
      this.$store.dispatch('user/DELETE_ARTICLE_BLOG', {
        blog_id,
      })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message);
            window.location.reload()
          } else {
            this.$message.warning(result.message);
          }
        })
    },
    commandChange (val) {
      if (val.type === 'edit') {
        this.isCreateBlogShow = true
        this.blogForm = val.articleBlogItem
        val.articleBlogItem.tag_ids && (this.blogForm.tag_ids = val.articleBlogItem.tag_ids.split(','))
      } else if (val.type === 'delete') {
        this.deleteArticleBlog(val.articleBlogItem.blog_id);
      }
    },
    pageChange (val) {
      this.$router.push({
        name: 'userBlog',
        query: {
          page: val
        }
      })
    }
  },
  computed: {
    ...mapState(['user', 'personalInfo']),
    pagination () { // 分页
      return Math.ceil(this.user.articleBlog.count / this.user.articleBlog.pageSize)
    },
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all;
    },
  },
  components: {
    Page,
    UploadImage
  }
}
</script>

<style scoped lang="scss">
.user-article-blog {
  padding-top: 20px;
  .user-article-blog-view {
    .user-article-blog-item {
      box-shadow: 0 0 3px rgba(67, 38, 100, 0.15);
      margin-top: 15px;
      border-radius: 12px;
      padding-bottom: 12px;
      position: relative;
      display: block;
      height: 130px;
      padding: 10px;
      .user-article-blog-top {
        display: flex;
        .article-blog-icon {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          .article-blog-icon-img {
            width: 100%;
            height: 100%;
          }
        }
        .user-article-blog-info {
          flex: 1;
          padding-left: 10px;
          .info-content {
            .name {
              color: #333;
              &:hover {
                color: #0c7d9d;
              }
            }
            span {
              display: block;
              font-size: 12px;
              color: #666;
              margin-right: 5px;
            }
          }
          .description {
            white-space: nowrap;
            overflow: hidden;
            font-size: 12px;
            color: #777;
            text-overflow: ellipsis;
          }
        }
        .operat-view {
          position: absolute;
          width: 30px;
          height: 30px;
          top: 10px;
          right: 15px;
          text-align: center;
          cursor: pointer;
        }
      }
      .user-article-blog-main {
        border-top: 1px solid #f0f0f0;
        padding-top: 8px;
        margin-top: 8px;
        .item {
          display: inline-block;
          color: #b3bac1;
          font-size: 12px;
          &:after {
            display: inline-block;
            content: "\B7";
            margin: 0 4px;
            color: #b2bac2;
          }
          &:last-of-type {
            &:after {
              content: "";
            }
          }
          .user-avatar {
            width: 28px;
            height: 28px;
            border-radius: 20px;
            vertical-align: middle;
            margin-right: 10px;
          }
          strong {
            font-weight: normal;
          }
        }
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
