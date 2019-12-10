<template>
  <client-only>
    <section class="write-lay layout-content">
      <div class="container client-card">
        <!-- this component will only be rendered on client-side -->

        <div class="write-top  box-form-group">
          <input class="box-input title"
                 v-model="write.title"
                 type="text"
                 placeholder="请输入文章标题" />
        </div>

        <div class="write mrg-bm20">
          <mavon-editor defaultOpen="edit"
                        :boxShadow="false"
                        v-model="write.content"
                        :toolbars="toolbars"
                        ref="mavonEditor"
                        :imageFilter="imageFilter"
                        @imgAdd="$imgAdd" />
        </div>

        <div class="row mrg-bm20">
          <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
            <label class="box-label"
                   for="">来源</label>
            <select class="box-select"
                    v-model="write.source">
              <option :value="item.id"
                      v-for="(item, key) in sourceList"
                      :key="key">{{ item.text }}</option>
            </select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
            <label class="box-label"
                   for="">是否公开</label>
            <select class="box-select"
                    v-model="write.is_public">
              <option :value="key"
                      v-for="(item, key) in publicTypeList"
                      :key="key">{{ item }}</option>
            </select>
          </div>
        </div>

        <div class="row mrg-bm20">
          <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
            <label class="box-label"
                   for="">个人专栏（非必选）</label>
            <select class="box-select"
                    v-model="write.blog_ids">
              <option :value="item.blog_id"
                      v-for="(item, key) in userArticleBlogAll"
                      :key="key">{{ item.name }}</option>
            </select>
            <div class="create-blog">
              <div class="create-blog-view"
                   v-show="isCreateBlogShow">
                <input class="create-blog-input box-input"
                       placeholder="请输入专栏名字"
                       v-model="blog.name"
                       type="text" />
                <button class="btn btn-primary btn-sm"
                        @click="saveCreateBlog">
                  保存
                </button>
                <button class="btn btn-primary btn-sm"
                        @click="isCreateBlogShow = false">
                  取消
                </button>
              </div>
              <button class="btn btn-primary btn-sm"
                      v-show="!isCreateBlogShow"
                      @click="isCreateBlogShow = true">
                创建新个人专栏
              </button>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 box-form-group">
            <label class="box-label"
                   for="">文章类型</label>
            <select class="box-select"
                    v-model="write.type">
              <option :value="key"
                      v-for="(item, key) in articleTypeList"
                      :key="key">{{ item }}</option>
            </select>
          </div>
        </div>

        <div class="tag-warp">
          <p class="common-title">
            文章标签
            <span>
              <em id="chosen_tag_num">{{ currentArticleTagArr.length }}</em>/3
            </span>
          </p>
          <div class="search-box clearfix"
               ref="search_box">
            <div class="clearfix js-chosen-tags"
                 ref="js_chosen_tags"
                 v-show="currentArticleTagArr.length > 0">
              <span class="tag-item"
                    v-for="(item, key) in currentArticleTagArr"
                    :key="key"
                    @click="deleteCurrentArticleTag(item)">{{ item.name }}</span>
            </div>
            <input class="search-input"
                   v-show="currentArticleTagArr.length < 3"
                   placeholder="选择下列热门标签或输入关键词检索标签"
                   :style="{ width: searchBoxWidth }"
                   v-model="searchArticleTag" />
          </div>
          <p class="search-result js-search-result"
             v-show="isSearchResultShow">
            相关“
            <span class="js-search-text">{{ searchArticleTag }}</span>”的搜索
            <span class="js-search-num">{{
              searchShowArticleTagAll.length
            }}</span>
            个
          </p>
          <div class="tag-list-view js-tag-nano has-scrollbar">
            <div class="clearfix js-tag-list">
              <span class="tag-item"
                    v-for="(item, key) in searchShowArticleTagAll"
                    :key="key"
                    @click="addArticleTag(item)">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <div class="write-footer clearfix">
          <button class="send-article"
                  @click="saveArticle">发布文章</button>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
// Local Registration
import { mavonEditor } from '@components/MarkDown'
import ClientOnly from 'vue-client-only'
import marked from 'marked'
import { share, baidu, google } from '@utils'
import {
  statusList,
  articleType,
  statusListText,
  articleTypeText
} from '@utils/constant'
export default {
  name: 'write',
  metaInfo () {
    return {
      title: '文章编辑',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  async asyncData ({ store, route, accessToken = '' }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch('PERSONAL_INFO', { accessToken }),
      store.dispatch('articleTag/GET_ARTICLE_TAG_ALL')
    ])
  },
  data () {
    return {
      write: {
        title: '', // 文章的标题
        source: '1', // 文章的来源
        content: '', // 文章的内容
        blog_ids: '', // 文章所属专栏ID
        type: '1', // 文章的类型
        is_public: 1 // 是否公开 1公开 0仅自己可见
      },
      publicTypeList: ['仅自己可见', '公开'], // 文章类型列表
      articleTypeList: articleTypeText,
      blog: {
        name: ''
      },
      userArticleBlogAll: [], // 用户全部专栏
      sourceList: [
        // 文章来源
        // whether to display create blog btn and input 文章类型列表
        {
          id: '1',
          text: '原创'
        },
        {
          id: '2',
          text: '转载'
        }
      ],
      isCreateBlogShow: false, // 是否显示创建blog
      searchArticleTag: '',
      currentArticleTagArr: [], // 用户选中的文章标签
      isSearchResultShow: false, // 搜索结果显示
      searchShowArticleTagAll: [], // 搜索栏内呈现的文章标题
      searchBoxWidth: '100%',
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
      },
      editArticleInfo: {} // 修改文章的信息
    }
  },
  created () {
    this.initArticleTagAll()
    this.getUserArticleBlogAll()
    if (this.$route.params.type !== 'create') {
      this.isEditArticle()
    }
  },
  watch: {
    searchArticleTag (val) {
      let _arr = []
      for (let item in this.articleTagAll) {
        if (
          this.articleTagAll[item].name
            .toLowerCase()
            .indexOf(this.searchArticleTag.toLowerCase()) >= 0
        ) {
          _arr.push(this.articleTagAll[item])
        }
      }
      this.searchShowArticleTagAll = _arr
      if (this.searchArticleTag.length === 0) {
        this.isSearchResultShow = false
      } else {
        this.isSearchResultShow = true
      }
    }
  },
  methods: {
    isEditArticle () {
      if (this.$route.params.type !== 'create') {
        // 判断是不是创建，不是则是修改，同时赋值
        this.$store
          .dispatch('editor/GET_USER_ARTICLE', {
            aid: this.$route.params.type
          })
          .then(result => {
            this.write = result.data.article
            this.editArticleInfo = result.data.article
            this.write.is_public = Number(result.data.article.is_public)
            this.write.content = result.data.article.origin_content
            this.articleTagAll.map(item => {
              if (
                ~this.editArticleInfo.tag_ids
                  .split(',')
                  .indexOf(String(item.tag_id))
              ) {
                this.currentArticleTagArr.push(item)
              }
            })
            this.renderCurrentArticleTag()
          })
      }
    },
    initArticleTagAll () {
      this.searchShowArticleTagAll = this.articleTagAll
    },
    getUserArticleBlogAll () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$message.warning('当前用户未登陆，请前往首页登陆后尝试')
        this.$router.push({ name: 'home' })
        return false
      }
      this.$store
        .dispatch('editor/GET_USER_BLOG', {
          uid: this.$store.state.personalInfo.user.uid
        })
        .then(res => {
          this.userArticleBlogAll = res.data.list
        })
    },
    addArticleTag (val) {
      this.search_article_tag = ''
      let _arr = []
      for (var item in this.currentArticleTagArr) {
        _arr.push(this.currentArticleTagArr[item].name)
      }
      if (
        this.currentArticleTagArr.length < 3 &&
        _arr.indexOf(val.name) === -1
      ) {
        this.currentArticleTagArr.push(val)
      }
      this.renderCurrentArticleTag()
    },
    deleteCurrentArticleTag (val) {
      for (var item in this.currentArticleTagArr) {
        if (val.name === this.currentArticleTagArr[item].name) {
          this.currentArticleTagArr.splice(item, 1)
        }
      }
      this.renderCurrentArticleTag()
    },
    renderCurrentArticleTag () {
      this.$nextTick(() => {
        this.searchBoxWidth =
          this.$refs.search_box.offsetWidth -
          this.$refs.js_chosen_tags.offsetWidth -
          15 +
          'px'
      })
    },
    getObjectValues (object) {
      var values = []
      for (var property in object) {
        values.push(object[property].tag_id)
      }
      return values
    },
    saveCreateBlog () {
      this.$store
        .dispatch('editor/CREATE_ARTICLE_BLOG', {
          blog_name: this.blog.name
        })
        .then(res => {
          if (res.state === 'success') {
            this.$message.success('创建文章专题成功')
            this.blog.name = ''
            this.getUserArticleBlogAll()
            this.isCreateBlogShow = false
          } else {
            this.$message.warning(res.message)
          }
        })
    },
    imageFilter (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$message.success('上传文章图片应该小于1M')
        return false
      } else {
        return true
      }
    },
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formData = new FormData()
      formData.append('file', $file)
      this.$store
        .dispatch('editor/UPLOAD_ARTICLE_PICTURE', formData)
        .then(res => {
          if (res.state === 'success') {
            this.$message.success('上传文章图片成功')
            this.$refs.mavonEditor.$img2Url(pos, res.data.img)
          } else {
            this.$message.warning(res.message)
            return false
          }
        })
    },
    saveArticle () {
      var params = {
        title: this.write.title, //文章的标题
        content: marked(this.write.content, { breaks: true }) /*主内容*/,
        origin_content: this.write.content /*源内容*/,
        source: this.write.source, // 来源 （1原创 2转载）
        type: this.write.type, // 类型 （1:文章;2:日记,3:草稿 ）
        is_public: this.write.is_public,
        blog_ids: this.write.blog_ids,
        tag_ids: this.getObjectValues(this.currentArticleTagArr).join(',')
      }
      this.$route.params.type !== 'create' &&
        (params.aid = this.$route.params.type)

      let dispatch_url =
        this.$route.params.type === 'create'
          ? 'editor/SAVE_ARTICLE'
          : 'editor/UPDATE_ARTICLE'

      this.$store
        .dispatch(dispatch_url, params)
        .then(res => {
          if (res.state === 'success') {
            this.create_show_modal = false
            this.$message.success(res.message)
            this.$router.push({
              name: 'user',
              params: { uid: this.personalInfo.user.uid, routeType: 'article' }
            })
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch(function (err) {
          this.$message.error('出现错误：' + err)
        })
    }
  },
  components: {
    'mavon-editor': mavonEditor,
    ClientOnly
  },
  computed: {
    articleTagAll () {
      return this.$store.state.articleTag.article_tag_all
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.write-lay {
  .client-card {
    padding: 15px 20px 30px;
    margin-bottom: 30px;
  }
  .write-top {
    margin: 30px 0;
    .title {
      width: 100%;
      padding: 10px 15px;
    }
  }
  .write {
    /deep/.v-note-wrapper {
      min-height: 700px;
      z-index: 249;
      &.fullscreen {
        z-index: 251;
      }
    }
  }

  .box-input,
  .box-select {
    border: 1px solid #9199a1;
    border-radius: 6px;
  }
  .box-select {
    height: 36px;
  }

  .blog-warp {
    margin-bottom: 15px;
    .common-title {
      margin-bottom: 8px;
      font-weight: 700;
      font-size: 14px;
      color: #1c1f21;
      line-height: 22px;
    }
    .common-select-box {
      position: relative;
      background: #fff;
      border: 1px solid #9199a1;
      border-radius: 6px;
      color: #1c1f21;
      cursor: pointer;
      font-size: 14px;
      width: 200px;
      i {
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 20px;
        color: #9199a1;
        line-height: 20px;
      }
      .common-select-name {
        display: block;
        padding: 0 40px 0 12px;
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
      }
      .common-select-ul {
        position: absolute;
        max-height: 250px;
        z-index: 1;
        top: 33px;
        padding: 8px 0;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        box-shadow: 0 8px 16px 0 rgba(28, 31, 33, 0.2);
        border-radius: 8px;
        overflow-y: auto;
        li {
          padding: 0 16px;
          height: 33px;
          line-height: 33px;
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.active,
          &:hover {
            background: #f3f5f6;
          }
        }
      }
    }
    &.blog-warp-blog {
      float: left;
    }
  }

  .tag-warp {
    margin-top: 5px;
    .common-title {
      span {
        margin-left: 4px;
        font-weight: 400;
        font-size: 12px;
        color: #93999f;
        line-height: 22px;
      }
    }
    .search-box {
      width: 100%;
      height: 36px;
      padding-left: 12px;
      margin-right: 12px;
      background: #fff;
      border: 1px solid #9199a1;
      border-radius: 6px;
      box-sizing: border-box;
      .search-input {
        width: 100%;
        height: 100%;
        float: left;
        font-size: 14px;
        border-radius: 6px;
        border: 0;
      }
    }
    .js-chosen-tags {
      float: left;
      height: 100%;
      .tag-item {
        margin-top: 5px;
      }
    }
    .tag-item {
      display: block;
      float: left;
      margin: 8px 8px 0 0;
      padding: 4px 12px;
      font-size: 12px;
      color: #545c63;
      line-height: 16px;
      background: rgba(84, 92, 99, 0.1);
      border-radius: 12px;
      cursor: pointer;
    }
    .search-result {
      margin: 24px 0 -16px;
      font-size: 12px;
      color: #9199a1;
      line-height: 18px;
      .js-search-text {
        color: #00bb29;
      }
      .js-search-num {
        color: #00bb29;
      }
    }
    .common-error-tip {
      margin-top: 2px;
      font-size: 12px;
      color: #f53d3d;
      line-height: 18px;
    }
    .tag-list-view {
      width: 100%;
      margin-top: 16px;
      height: auto !important;
      max-height: 300px;
      overflow-y: auto;
    }
  }

  .create-blog {
    margin-top: 10px;
    .create-blog-input {
      height: 36px;
      padding: 0 12px;
      font-size: 14px;
    }
  }

  .write-footer {
    margin: 20px 0;
    .send-article {
      padding: 5px 15px;
      background: #256ef8;
      border: none;
      color: #fff;
      border-radius: 5px;
      font-style: 16px;
    }
  }
}
</style>
