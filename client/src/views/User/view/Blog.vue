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
        <div class="user-article-blog-item clinet-card">
          <div class="user-article-blog-top">
            <router-link class="article-blog-icon"
                         :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">
              <el-image class="article-blog-icon-img"
                        :src="articleBlogItem.icon"
                        lazy></el-image>
            </router-link>

            <div class="user-article-blog-info">

              <router-link class="name"
                           :to="{name:'articleBlog',params:{blogId:articleBlogItem.blog_id}}">{{articleBlogItem.name}}</router-link>

              <div class="time-view">
                <span class="time">{{setBlogTime(articleBlogItem)}}</span>
              </div>
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

          <div class="user-article-blog-tag">
            <span class="title">所属标签:</span>
            <template v-if="articleBlogItem.tag">
              <router-link v-for="(itemArticleTag,key) in articleBlogItem.tag"
                           class="tag-class frontend"
                           :key="key"
                           :to="{name:'article_tag',params:{article_tag_en_name:itemArticleTag.article_tag_en_name}}">{{itemArticleTag.article_tag_name}}</router-link>
            </template>
            <template v-else>
              <span class="hint">
                暂时没有加入标签，加入标签更能容易被搜索到
              </span>
            </template>

          </div>

          <div class="user-article-blog-main">
            <p class="description"
               v-if="articleBlogItem.status!==3">介绍：{{articleBlogItem.description||'没有写入介绍'}}</p>
            <p class="description faild"
               v-else>审核失败 原因：{{articleBlogItem.rejection_reason}}</p>
          </div>

          <div class="user-article-blog-footer">
            <ul class="statistics">
              <li class="item">
                <i class="el-icon-document"></i>
                <span class="article-count">{{articleBlogItem.articleCount}}</span>
              </li>
              <li class="item item-icon read-count">
                <i class="el-icon-view"></i>
                <span v-text="articleBlogItem.read_count||0"></span>
              </li>
              <li class="item item-icon like-article">
                <i class="el-icon-star-off"></i>
                <span v-text="articleBlogItem.likeCount||0"></span>
              </li>
              <li class="item">
                <span class="type"
                      :class="{'true':articleBlogItem.is_public}"> {{ articleBlogItem.is_public?'公开':'个人' }}</span>
              </li>
              <li class="item attention"
                  v-if="~[2,4].indexOf(articleBlogItem.status)&&personalInfo.islogin&&articleBlogItem.is_public"
                  @click="setLikeArticleBlog(articleBlogItem.blog_id)">
                <span :class="{'active':isLike(articleBlogItem).status}">{{isLike(articleBlogItem).text}}</span>
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
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="380px">
      <div class="blog-modal">
        <div class="form-group">
          <label for="blog-name-input">专题名字：</label>
          <input type="email"
                 v-model="blogForm.blog_name"
                 class="form-control"
                 placeholder="请输入个人文章专题名字">
        </div>
        <div class="form-group">
          <label for="blog-name-input">专题英文名字：</label>
          <input type="email"
                 v-model="blogForm.en_name"
                 class="form-control"
                 placeholder="请输入个人文章专题英文名字">
        </div>

        <div class="form-group">
          <label for="blog-name-input">是否公开：</label>
          <div class="form-radio-view">
            <input type="radio"
                   name="sex"
                   :value="true"
                   class="form-input-radio"
                   v-model="blogForm.is_public"><span>公开</span>
            <input type="radio"
                   name="sex"
                   :value="false"
                   class="form-input-radio"
                   v-model="blogForm.is_public"><span>仅自己</span>
          </div>
        </div>

        <div class="form-group avatar-uploader avatar-uploader">
          <label for="blog-name-input">专栏封面图片（非必传）：</label>
          <div class="avatar"
               v-if="blogForm.icon">
            <el-image class="avatar-img"
                      :src="blogForm.icon"
                      lazy></el-image>
          </div>
          <div class="action-box">
            <div class="hint">支持 jpg、png 格式大小 1M 以内的图片</div>
            <upload-image class="upload-image"
                          @changeUpload="changeArticleBlogImg">上传图片</upload-image>
          </div>
        </div>

        <div class="form-group">
          <label for="blog-name-input">选择标签：</label>
          <el-select filterable
                     multiple
                     :multiple-limit="5"
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
          <label for="article-blog-description">专题描述：</label>
          <textarea v-model="blogForm.description"
                    type="password"
                    class="form-control"
                    placeholder="请输入个人文章专题描述"></textarea>
        </div>

        <div class="footer-view">
          <button type="button"
                  class="btn btn-primary blog-modal-create"
                  @click="setIsEditCreateArticleBlog">创建
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
      isCreate: true,
      blogForm: {
        blog_id: '',
        blog_name: '',
        en_name: '',
        description: '',
        is_public: false,
        icon: '',
        tag_ids: ''
      },
    }
  },
  mounted () {
    this.$store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
  },
  methods: {
    createEditArticleBlog (type) { // 触发创建文章个人专栏
      this.isCreateBlogShow = true
      this.isCreate = true
      this.blogForm.blog_name = ''
      this.blogForm.en_name = ''
      this.blogForm.description = ''
      this.blogForm.is_public = false
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
    setBlogTime (item) { // 设置blog的时间
      if (item.create_date === item.update_date) {
        return `创建于：${item.create_dt}`
      } else {
        return `更新于：${item.update_dt}`
      }
    },
    setIsEditCreateArticleBlog () {
      let url = ''
      let params = {}
      url = this.isCreate ? 'user/CREATE_ARTICLE_BLOG' : 'user/UPDATE_ARTICLE_BLOG'
      params = {
        ...this.blogForm,
        tag_ids: this.blogForm.tag_ids.join(',')
      }
      this.$store.dispatch(url, {
        ...params
      })
        .then(result => {
          if (result.state === 'success') {
            this.isEdit = false
            this.$message.success(result.message);
            this.isCreateBlogShow = false
            window.location.reload()
          } else {
            this.$message.warning(result.message);
          }
        })
    },
    deleteArticleBlog (blog_id) { // 删除文章的个人专栏
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
        this.isCreate = false
        this.blogForm.blog_id = val.articleBlogItem.blog_id
        this.blogForm.blog_name = val.articleBlogItem.name
        this.blogForm.en_name = val.articleBlogItem.en_name
        this.blogForm.description = val.articleBlogItem.description
        this.blogForm.is_public = val.articleBlogItem.is_public
        this.blogForm.icon = val.articleBlogItem.icon
        val.articleBlogItem.tag_ids && (this.blogForm.tag_ids = val.articleBlogItem.tag_ids.split(','))
      } else if (val.type === 'delete') {
        this.deleteArticleBlog(val.articleBlogItem.blog_id);
      }
    },
    setLikeArticleBlog (blog_id) { // 用户关注blog
      this.$store.dispatch('articleBlog/LIKE_ARTICLE_BLOG', {
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
    isLike (item) { // 是否like
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
    padding-top: 20px;
    .user-article-blog-item {
      position: relative;
      display: block;
      height: 210px;
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
