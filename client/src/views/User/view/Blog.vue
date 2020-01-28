<template>
  <div class="user-article-blog"
       v-loading="isLoading">
    <button class="btn create-article-blog"
            @click="createEditArticleBlog('create')">
      创建个人专栏
    </button>

    <div class="user-article-blog-view row">
      <div class="col-xs-12 col-sm-6 col-md-6"
           v-for="(articleBlogItem, key) in articleBlog.list"
           :key="key">
        <div class="user-article-blog-item ">
          <div class="user-article-blog-top">
            <router-link class="article-blog-icon"
                         :to="{
                name: 'articleBlog',
                params: { blogId: articleBlogItem.blog_id }
              }">
              <img class="article-blog-icon-img"
                   v-lazy="articleBlogItem.icon"
                   alt="" />
            </router-link>

            <div class="user-article-blog-info">
              <router-link class="name"
                           :to="{
                  name: 'articleBlog',
                  params: { blogId: articleBlogItem.blog_id }
                }">{{ articleBlogItem.name }}</router-link>

              <div class="time-view">
                <span class="time">{{ setBlogTime(articleBlogItem) }}</span>
              </div>
            </div>

            <div class="operat-view"
                 v-if="
                personalInfo.islogin &&
                  personalInfo.user.uid === articleBlogItem.user.uid
              ">
              <Dropdown>
                <div class="el-dropdown-link"
                     slot="button">
                  <i class="el-icon-more"></i>
                </div>
                <div class="dropdown-menu-view">
                  <div class="dropdown-menu-item"
                       @click="commandChange({ type: 'edit', articleBlogItem })">
                    修改
                  </div>
                  <div class="dropdown-menu-item"
                       @click="commandChange({ type: 'delete', articleBlogItem })">
                    删除
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>

          <div class="user-article-blog-tag">
            <span class="title">所属标签:</span>
            <template v-if="articleBlogItem.tag">
              <router-link v-for="(itemArticleTag, key) in articleBlogItem.tag"
                           class="tag-class frontend"
                           :key="key"
                           :to="{
                  name: 'article_tag',
                  params: { en_name: itemArticleTag.en_name }
                }">{{ itemArticleTag.name }}</router-link>
            </template>
            <template v-else>
              <span class="hint">
                暂时没有加入标签，加入标签更能容易被搜索到
              </span>
            </template>
          </div>

          <div class="user-article-blog-main">
            <p class="description"
               v-if="articleBlogItem.status !== 3">
              介绍：{{ articleBlogItem.description || '没有写入介绍' }}
            </p>
            <p class="description faild"
               v-else>
              审核失败 原因：{{ articleBlogItem.rejection_reason }}
            </p>
          </div>

          <div class="user-article-blog-footer">
            <ul class="statistics">
              <li class="item">
                <i class="el-icon-document"></i>
                <span class="article-count">{{
                  articleBlogItem.articleCount
                }}</span>
              </li>
              <li class="item item-icon read-count">
                <i class="el-icon-view"></i>
                <span v-text="articleBlogItem.read_count || 0"></span>
              </li>
              <li class="item item-icon like-article">
                <i class="el-icon-star-off"></i>
                <span v-text="articleBlogItem.likeCount || 0"></span>
              </li>
              <li class="item attention"
                  v-if="
                  ~[2, 4].indexOf(articleBlogItem.status) &&
                    personalInfo.islogin
                "
                  @click="setLikeArticleBlog(articleBlogItem.blog_id)">
                <span :class="{ active: isLike(articleBlogItem).status }">{{
                  isLike(articleBlogItem).text
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <Page :total="Number(articleBlog.count)"
          :pageSize="Number(articleBlog.pageSize)"
          :page="Number(articleBlog.page) || 1"
          @pageChange="pageChange"></Page>

    <!-- use the modal component, pass in the prop -->
    <Dialog :visible.sync="isCreateBlogShow"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="380px">
      <div class="blog-modal">
        <div class="form-group">
          <label for="blog-name-input">专题名字：</label>
          <input type="email"
                 v-model="blogForm.blog_name"
                 class="form-control"
                 placeholder="请输入个人文章专题名字" />
        </div>
        <div class="form-group">
          <label for="blog-name-input">专题英文名字：</label>
          <input type="email"
                 v-model="blogForm.en_name"
                 class="form-control"
                 placeholder="请输入个人文章专题英文名字" />
        </div>

        <div class="form-group avatar-uploader avatar-uploader">
          <label for="blog-name-input">专栏封面图片（非必传）：</label>
          <div class="avatar"
               v-if="blogForm.icon">
            <img class="avatar-img"
                 v-lazy="blogForm.icon"
                 alt="" />
          </div>
          <div class="action-box">
            <div class="hint">支持 jpg、png 格式大小 1M 以内的图片</div>
            <upload-image class="upload-image"
                          @changeUpload="changeArticleBlogImg">上传图片</upload-image>
          </div>
        </div>

        <div class="form-group">
          <label for="blog-name-input">选择标签：</label>
          <select v-model="blogForm.tag_ids"
                  placeholder="请选择">
            <option v-for="(item, key) in articleTagAll"
                    :key="key"
                    :label="item.name"
                    :value="item.tag_id">
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="article-blog-description">专题描述：</label>
          <textarea v-model="blogForm.description"
                    type="password"
                    class="form-control"
                    placeholder="请输入个人文章专题描述"></textarea>
        </div>

        <div class="footer-view">
          <button type="button"
                  class="btn btn-primary blog-modal-create"
                  @click="setIsEditCreateArticleBlog">
            创建
          </button>
          <button type="button"
                  @click="isCreateBlogShow = false"
                  class="btn btn-secondary blog-modal-cancel">
            取消
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { Page, UploadImage, Dialog, Dropdown } from '@components'
import { mapState } from 'vuex'
import { modelType } from '@utils/constant'

export default {
  name: 'Blog',
  async asyncData ({ store, route }) {
    return store.dispatch('user/GET_USER_ARTICLE_BLOG_LIST', {
      uid: route.params.uid,
      page: route.query.page || 1,
      pageSize: route.query.pageSize || 10
    })
  },
  data () {
    return {
      modelType,
      isCreateBlogShow: false,
      isCreate: true,
      isLoading: false,
      articleBlog: {
        // 个人中心个人专栏列表
        count: 0,
        list: [],
        page: 1,
        pageSize: 10
      },
      blogForm: {
        blog_id: '',
        blog_name: '',
        en_name: '',
        description: '',
        icon: '',
        tag_ids: ''
      }
    }
  },
  mounted () {
    this.$store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    this.getArticleBlogList()
  },
  methods: {
    getArticleBlogList () {
      this.isLoading = true
      this.$store
        .dispatch('user/GET_USER_ARTICLE_BLOG_LIST', {
          uid: this.$route.params.uid,
          page: this.articleBlog.page || 1,
          pageSize: this.articleBlog.pageSize || 10
        })
        .then(result => {
          this.articleBlog = result.data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    pageChange (val) {
      this.articleBlog.page = val
      this.getArticleBlogList()
    },
    createEditArticleBlog (type) {
      // 触发创建文章个人专栏
      this.isCreateBlogShow = true
      this.isCreate = true
      this.blogForm.blog_name = ''
      this.blogForm.en_name = ''
      this.blogForm.description = ''
      this.blogForm.icon = ''
      this.blogForm.tag_ids = ''
    },
    changeArticleBlogImg ({ formData, config }) {
      this.$store
        .dispatch('articleBlog/UPLOAD_ARTICLE_BLOG_IMG', formData)
        .then(result => {
          if (result.state === 'success') {
            this.blogForm.icon = result.data.img
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    setBlogTime (item) {
      // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },
    setIsEditCreateArticleBlog () {
      let url = ''
      let params = {}
      url = this.isCreate
        ? 'user/CREATE_ARTICLE_BLOG'
        : 'user/UPDATE_ARTICLE_BLOG'
      params = {
        ...this.blogForm,
        tag_ids: this.blogForm.tag_ids
      }
      this.$store
        .dispatch(url, {
          ...params
        })
        .then(result => {
          if (result.state === 'success') {
            this.isEdit = false
            this.$message.success(result.message)
            this.isCreateBlogShow = false
            this.getArticleBlogList()
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    deleteArticleBlog (blog_id) {
      // 删除文章的个人专栏
      this.$store
        .dispatch('user/DELETE_ARTICLE_BLOG', {
          blog_id
        })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message)
            window.location.reload()
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    commandChange (val) {
      if (val.type === 'edit') {
        this.isCreateBlogShow = true
        this.isCreate = false
        this.blogForm = val.articleBlogItem
        this.blogForm.blog_name = val.articleBlogItem.name
        val.articleBlogItem.tag_ids &&
          (this.blogForm.tag_ids = val.articleBlogItem.tag_ids.split(','))
      } else if (val.type === 'delete') {
        this.$confirm('此操作将永久删除该个人专栏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteArticleBlog(val.articleBlogItem.blog_id)
          })
          .catch(() => { })
      }
    },
    setLikeArticleBlog (blog_id) {
      // 用户关注blog
      this.$store
        .dispatch('common/SET_COLLECT', {
          associate_id: blog_id,
          type: modelType.article_blog
        })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message)
            window.location.reload()
          } else {
            this.$message.warning(result.message)
          }
        })
    },
    isLike (item) {
      // 是否like
      let likeUserIds = []
      item.likeUserIds.map(item => {
        likeUserIds.push(item.uid)
      })
      if (~likeUserIds.indexOf(Number(this.personalInfo.user.uid))) {
        return {
          status: true,
          text: '已关注'
        }
      } else {
        return {
          status: false,
          text: '关注'
        }
      }
    }
  },
  computed: {
    ...mapState(['user', 'personalInfo']),
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all
    }
  },
  components: {
    Page,
    UploadImage,
    Dialog,
    Dropdown
  }
}
</script>

<style scoped lang="scss">
.user-article-blog {
  padding-top: 20px;
  .create-article-blog {
    border-radius: 15px;
    background: #ffd600;
    padding: 3px 13px;
    font-size: 14px;
    border-color: #ffd600;
    color: #333;
  }
  .user-article-blog-view {
    padding-top: 20px;
    .user-article-blog-item {
      position: relative;
      display: block;
      height: 210px;
      padding: 10px;
      margin-bottom: 12px;
      border: 1px solid rgba(178, 186, 194, 0.15);
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

          .name {
            display: inline-block;
            color: #333;
            font-size: 13px;
            line-height: 18px;
            padding-right: 37px;
            &:hover {
              color: #0c7d9d;
            }
          }

          .time-view {
            color: #999;
            .time {
              color: #999;
              font-size: 12px;
            }
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
      .user-article-blog-tag {
        height: 50px;
        .title {
          display: inline-block;
          font-size: 12px;
        }
        a {
          display: inline-block;
          background: #fd763a;
          font-size: 12px;
          color: #fff;
          border-radius: 10px;
          line-height: 15px;
          padding: 1px 3px;
          margin-right: 5px;
        }
        .hint {
          font-size: 12px;
          color: #999;
        }
      }
      .user-article-blog-main {
        border-top: 1px solid #f0f0f0;
        padding-top: 8px;
        margin-top: 8px;
        .description {
          font-size: 12px;
          color: #999;
          height: 40px;
          &.faild {
            color: red;
          }
        }
      }
      .user-article-blog-footer {
        .statistics {
          li {
            display: inline-block;
            font-size: 12px;
            color: #999;
            .article-count,
            span {
              display: inline-block;
              font-size: 12px;
              color: #999;
              margin-right: 5px;
              vertical-align: middle;
            }
            i {
              font-size: 14px;
              color: #999;
            }
            .type {
              font-size: 12px;
              display: inline-block;
              margin-left: 3px;
            }
            .type {
              background: #fd763a;
              color: #fff;
              border-radius: 10px;
              line-height: 15px;
              padding: 2px 3px;
              &.true {
                background: #41b883;
              }
            }
            &.attention {
              cursor: pointer;
              span {
                font-size: 12px;
                display: inline-block;
                margin-left: 3px;
                color: #333;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                line-height: 15px;
                padding: 2px 3px;
                &.active {
                  color: #fff;
                  background: #41b883;
                  border: 1px solid #41b883;
                }
              }
            }
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
      padding: 8px 10px;
      font-size: 14px;
      border-radius: 6px;
    }
    .form-radio-view {
      margin-top: 10px;
      span {
        display: inline-block;
        margin-right: 20px;
      }
    }
    .avatar {
      width: 60px;
      height: 60px;
      .avatar-img {
        width: 100%;
        height: 100%;
      }
    }
    .hint {
      font-size: 12px;
      color: #999;
    }
    .UploadImage {
      cursor: pointer;
      background: #409eff;
      padding: 3px 15px;
      color: #fff;
      margin-top: 3px;
      border-radius: 3px;
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
