<template>
  <section class="writer-lay layout-content"
           :class="{'full-screen':!edit_full_screen}"
           id="writer">
    <!--writer-header start-->
    <div class="writer-header"
         id="writer-header">
      <div class="writer-header-view clearfix">
        <ul class="writer-right">
          <!--   <li><a class="btn btn-primary" href="javascript:;" id="save-article-draft">保存为草稿</a></li>-->
          <li>
            <a class="btn btn-primary"
               href="javascript:;"
               id="issue-article-model"
               @click="send_article">发布文章</a>
          </li>
          <li>
            <router-link class="btn btn-primary"
                         :to="{name:'home'}">
              <i class="iconfont icon-zhuye"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!--writer-header end-->

    <!--writer-content start-->
    <div class="writer-content">
      <div class="writer-box">
        <input class="writer-input"
               style="display: block"
               v-model="article_title"
               type="text"
               id="article-title"
               placeholder="请输入文章标题" />
        <ul class="writer-nav">
          <li @click="upload_article_modal_show=true;upload_img_url = '';">
            <i class="iconfont icon-tupian"></i>
          </li>
          <li>
            <a href="http://www.markdown.cn"
               target="_blank">
              <i class="iconfont icon-md"></i>
            </a>
          </li>
          <li @click="edit_full_screen=!edit_full_screen">
            <i class="iconfont"
               :class="{'icon-quanping':!edit_full_screen,'icon-suoping':edit_full_screen}"></i>
          </li>
          <li>
            <router-link class="article-rule"
                         :to="{'name':'article_rule'}">《点我查看文章编写规范》</router-link>
          </li>
        </ul>
        <textarea class="write-textarea"
                  name
                  id="write-textarea"
                  v-model="article_content"
                  cols="30"
                  rows="10"
                  wrap="hard"></textarea>
      </div>
      <div class="content-preview"
           v-show="edit_full_screen">
        <h2 class="title">{{article_title}}</h2>
        <div id="mark-text"
             class="box-article-view"></div>
      </div>
    </div>
    <!--writer-content end-->

    <!-- use the modal component, pass in the prop -->
    <el-dialog :visible.sync="upload_article_modal_show"
               width="500px">
      <h3 slot="header">插入图片</h3>
      <div class="upload-pic-view">
        <p class="info">请直接填写图片URL：</p>
        <div class="input-view">
          <input v-model="upload_img_url"
                 type="text"
                 class="form-control"
                 placeholder="http://example.com/image.jpg" />
        </div>
        <p class="info">或者：</p>
        <div class="upload-local">
          <UploadImage @changeUpload="changeFile" />
        </div>
      </div>
      <div slot="footer">
        <div class="writer-submit-view-footer">
          <button type="button"
                  class="btn btn-primary writer-modal-create"
                  @click="save_upload">确定</button>
          <button type="button"
                  class="btn btn-secondary writer-modal-cancel"
                  @click="upload_article_modal_show = false">取消</button>
        </div>
      </div>
    </el-dialog>

    <!-- use the modal component, pass in the prop -->
    <el-dialog :visible.sync="create_show_modal"
               width="550px">
      <h3 slot="header">发布文章</h3>
      <div class="writer-submit-view">
        <div class="clearfix">
          <div class="blog-warp blog-warp-blog">
            <p class="common-title">个人专题</p>
            <div class="common-select-box blog-box js-blog-box">
              <span class="common-select-name"
                    @click="blog_ul_list_show=!blog_ul_list_show">{{current_blog.blog_name?current_blog.blog_name:'请选择需要投递的栏目'}}</span>
              <i class="iconfont icon-moreunfold"
                 @click="blog_ul_list_show=!blog_ul_list_show"></i>
              <ul class="common-select-ul"
                  v-show="blog_ul_list_show">
                <li class="active"
                    @click="current_blog={};blog_ul_list_show=false">请选择需要投递的栏目</li>
                <li v-for="item in user_article_blog_all"
                    @click="current_blog=item;blog_ul_list_show=false">{{item.blog_name}}</li>
              </ul>
            </div>
          </div>
          <div class="create-blog">
            <div class="create-blog-view"
                 v-show="create_blog_show">
              <input class="create-blog-input"
                     v-model="blog_name"
                     type="text" />
              <button class="btn btn-primary btn-sm"
                      @click="save_create_blog">保存</button>
              <button class="btn btn-primary btn-sm"
                      @click="create_blog_show=false">取消</button>
            </div>
            <button class="btn btn-primary btn-sm"
                    v-show="!create_blog_show"
                    @click="create_blog_show=true">创建新专题</button>
          </div>
        </div>

        <div class="clearfix">
          <div class="blog-warp blog-warp-blog">
            <p class="common-title">文章形式</p>
            <div class="common-select-box blog-box js-blog-box"
                 style="width: 130px">
              <span class="common-select-name"
                    @click="article_type_list_show=!article_type_list_show">{{current_article_type.text}}</span>
              <i class="iconfont icon-moreunfold"
                 @click="article_type_list_show=!article_type_list_show"></i>
              <ul class="common-select-ul"
                  v-show="article_type_list_show">
                <li v-for="item in article_type_list"
                    @click="current_article_type=item;article_type_list_show=false">{{item.text}}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="tag-warp">
          <p class="common-title">
            文章标签
            <span>
              <em id="chosen_tag_num">{{current_article_tag_arr.length}}</em>/3
            </span>
          </p>
          <div class="search-box clearfix"
               ref="search_box">
            <div class="clearfix js-chosen-tags"
                 ref="js_chosen_tags"
                 v-show="current_article_tag_arr.length>0">
              <span class="tag-item"
                    v-for="item in current_article_tag_arr"
                    @click="delete_current_article_tag(item)">{{item.article_tag_name}}</span>
            </div>
            <input class="search-input"
                   v-show="current_article_tag_arr.length<3"
                   placeholder="选择下列热门标签或输入关键词检索标签"
                   :style="{'width':search_box_width}"
                   v-model="search_article_tag" />
          </div>
          <p class="search-result js-search-result"
             v-show="search_result_show">
            相关“
            <span class="js-search-text">{{search_article_tag}}</span>”的搜索
            <span class="js-search-num">{{search_article_tag_all.length}}</span> 个
          </p>
          <div class="tag-list-view js-tag-nano has-scrollbar"
               style="height: 160px;">
            <div class="clearfix js-tag-list">
              <span class="tag-item"
                    v-for="item in search_article_tag_all"
                    @click="add_article_tag(item)">{{item.article_tag_name}}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="writer-submit-view-footer">
          <button type="button"
                  class="btn btn-primary writer-modal-create"
                  @click="save_article">保存</button>
          <button type="button"
                  class="btn btn-secondary writer-modal-cancel"
                  @click="create_show_modal = false">取消</button>
        </div>
      </div>
    </el-dialog>
  </section>
  <!--writer-lay layout-content end-->
</template>

<script>
import marked from "marked";
import { UploadImage } from "@components";
export default {
  metaInfo () {
    return {
      title: "文章编辑",
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("PERSONAL_INFO", { accessToken }),
      store.dispatch("articleTag/GET_ARTICLE_TAG_ALL")
    ]);
  },
  name: "Editor",
  data () {
    return {
      upload_article_modal_show: false, // upload picture 上传图片模态窗口
      edit_full_screen: false, // edit is full screen 编辑器是否全屏显示
      article_title: "", // article title   文章的标题
      article_content: "", // article content   文章输入主内容
      create_show_modal: false, // article save model   保存时模态框是否显示的控制
      current_blog: {}, // current user article blog  当前选中的用户文章专题
      blog_ul_list_show: false, // whether to display blog list  用户文章专题列表是否显示控制
      blog_name: "", // create user article blog name 创建文章专题input绑定的值
      create_blog_show: false, // whether to display create blog btn and input 创建用户文章专题input是否显示
      article_type_list: [
        // whether to display create blog btn and input 文章类型列表
        {
          id: "",
          text: "请选择"
        },
        {
          id: "1",
          text: "原创"
        },
        {
          id: "2",
          text: "转载"
        }
      ],
      current_article_type: {
        // 选中文章类型的数据
        id: "",
        text: "请选择"
      },
      current_article: {},
      article_type_list_show: false,
      source_article_tag_all: [], // 源全部的文章标题
      search_article_tag_all: [], // 搜索栏内呈现的文章标题
      current_article_tag_arr: [], // 用户选中的文章标签
      user_article_blog_all: [],
      search_article_tag: "",
      search_box_width: "100%",
      search_result_show: false,
      upload_img_url: "" // 图片上传url
    };
  },
  created () {
    if (this.$route.params.editor_type !== "create") {
      // 判断是不是创建，不是则是修改，同时赋值
      this.$store
        .dispatch("editor/GET_USER_ARTICLE", {
          aid: this.$route.params.editor_type
        })
        .then(result => {
          this.current_article = result.data.article;
          this.article_title = result.data.article.title;
          this.article_content = result.data.article.origin_content;
        });
    }
  },
  mounted () {
    this.init_article_tag_all();
    this.getUserArticleBlogAll();
  },
  watch: {
    article_content (val) {
      document.getElementById("mark-text").innerHTML = marked(val, {
        breaks: true
      });
    },
    search_article_tag (val) {
      let that = this;
      let _arr = [];
      for (let item in that.source_article_tag_all) {
        if (
          that.source_article_tag_all[item].article_tag_name
            .toLowerCase()
            .indexOf(that.search_article_tag.toLowerCase()) >= 0
        ) {
          _arr.push(that.source_article_tag_all[item]);
        }
      }
      that.search_article_tag_all = _arr;
      if (that.search_article_tag.length === 0) {
        that.search_result_show = false;
      } else {
        that.search_result_show = true;
      }
    }
  },
  methods: {
    init_article_tag_all () {
      this.source_article_tag_all = this.article_tag_all;
      this.search_article_tag_all = this.article_tag_all;
    },
    getUserArticleBlogAll () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$message.warning("当前用户未登陆，请前往首页登陆后尝试");
        this.$router.push({ name: "home" });
        return false;
      }
      this.$store
        .dispatch("editor/GET_USER_BLOG", {
          uid: this.$store.state.personalInfo.user.uid
        })
        .then(res => {
          this.user_article_blog_all = res.data.list;
        });
    },
    save_create_blog () {
      this.$store
        .dispatch("editor/CREATE_ARTICLE_BLOG", {
          blog_name: this.blog_name
        })
        .then(res => {
          if (res.state === "success") {
            this.$message.success("创建文章专题成功");
            this.blog_name = "";
            this.getUserArticleBlogAll();
            this.create_blog_show = false;
          } else {
            this.$message.warning(res.message);
          }
        });
    },
    add_article_tag (val) {
      var that = this;
      that.search_article_tag = "";
      let _arr = [];
      for (var item in that.current_article_tag_arr) {
        _arr.push(that.current_article_tag_arr[item].article_tag_name);
      }
      if (
        that.current_article_tag_arr.length < 3 &&
        _arr.indexOf(val.article_tag_name) === -1
      ) {
        that.current_article_tag_arr.push(val);
      }
      that.render_current_article_tag();
    },
    delete_current_article_tag (val) {
      var that = this;
      for (var item in that.current_article_tag_arr) {
        if (
          val.article_tag_name ===
          that.current_article_tag_arr[item].article_tag_name
        ) {
          that.current_article_tag_arr.splice(item, 1);
        }
      }
      that.render_current_article_tag();
    },
    render_current_article_tag () {
      var that = this;
      that.$nextTick(() => {
        that.search_box_width =
          that.$refs.search_box.offsetWidth -
          that.$refs.js_chosen_tags.offsetWidth -
          15 +
          "px";
      });
    },
    getObjectValues (object) {
      var values = [];
      for (var property in object) {
        values.push(object[property].article_tag_id);
      }
      return values;
    },
    save_upload () {
      // 图片上传保存写入marked
      var that = this;
      if (!that.upload_img_url) {
        this.$message.warning("请填写插入的图片地址");
        return false;
      }
      that.article_content += "![Alt text](" + that.upload_img_url + ")";
      that.upload_article_modal_show = false;
    },
    send_article () {
      this.create_show_modal = true;
      if (this.$route.params.editor_type !== "create") {
        // 判断是不是创建，不是则是修改，同时赋值

        this.article_type_list.map(item => {
          if (item.id === this.current_article.source) {
            this.current_article_type = item;
          }
        });

        this.user_article_blog_all.map(item => {
          if (String(item.blog_id) === this.current_article.user_blog_ids) {
            this.current_blog = item;
          }
        });

        this.search_article_tag_all.map(item => {
          if (
            ~this.current_article.article_tag_ids
              .split(",")
              .indexOf(String(item.article_tag_id))
          ) {
            this.current_article_tag_arr.push(item);
          }
        });
        this.render_current_article_tag();
      }
    },
    save_article () {
      var that = this;
      var params = {
        title: that.article_title, //文章的标题
        content: marked(that.article_content, { breaks: true }) /*主内容*/,
        origin_content: that.article_content /*源内容*/,
        source: that.current_article_type.id, // 来源 （1原创 2转载）
        type: 1, // 类型 （1:文章;2:提问,3:说说 ）
        user_blog_ids: that.current_blog.blog_id,
        article_tag_ids: that
          .getObjectValues(that.current_article_tag_arr)
          .join(",")
      };
      this.$route.params.editor_type !== "create" &&
        (params.aid = this.$route.params.editor_type);

      let dispatch_url =
        this.$route.params.editor_type === "create"
          ? "editor/SAVE_ARTICLE"
          : "editor/UPDATE_ARTICLE";

      this.$store
        .dispatch(dispatch_url, params)
        .then(res => {
          if (res.state === "success") {
            this.create_show_modal = false;
            this.$router.push({
              name: "userBlog",
              params: { uid: this.personalInfo.user.uid }
            });
            if (this.$route.params.editor_type === "create") {
              this.$message.warning(
                "文章创建成功，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布"
              );
            } else {
              this.$message.warning(
                "文章更新后需要重新审核，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布"
              );
            }
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function (err) {
          this.$message.warning("出现错误：" + err);
        });
    },
    changeFile ({ formData, config }) {
      this.$store
        .dispatch("editor/UPLOAD_ARTICLE_PICTURE", formData)
        .then(res => {
          this.$nextTick(() => {
            if (res.state === "success") {
              this.$message.success("上传文章图片成功");
              this.article_content += "![Alt text](" + res.data.img + ")";
              this.upload_article_modal_show = false;
            } else {
              this.$message.warning(res.message);
            }
          });
        });
    }
  },
  computed: {
    article_tag_all () {
      return this.$store.state.articleTag.article_tag_all;
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo;
    }
  },
  components: {
    UploadImage
  }
};
</script>

<style scoped lang="scss">
.writer-lay.layout-content {
  height: 100%;
  background-color: #f8f9fa;
  &.full-screen {
    .writer-content {
      width: 960px;
      margin: 0 auto;
    }
  }
  .writer-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0 1.4rem;
    height: 70px;
    z-index: 100;
    .writer-header-view {
      width: 100%;
      .writer-right {
        float: right;
        margin-right: 30px;
        li {
          display: inline-block;
        }
      }
    }
  }
  .writer-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top: 70px;
    left: 50px;
    right: 50px;
    bottom: 30px;
    overflow: hidden;
    box-shadow: 0 5px 16px 0 rgba(28, 31, 33, 0.1);
    border-radius: 12px;
    background-color: #fff;
    .writer-box,
    .content-preview {
      -webkit-box-flex: 1;
      -ms-flex: 1 1 50%;
      flex: 1 1 50%;
      height: 100%;
    }
    .writer-box,
    .content-preview {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      position: relative;
      padding: 20px 25px;
    }
    .writer-box {
      .writer-input {
        height: 50px;
        border: none;
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: bold;
      }
      .writer-nav {
        position: relative;
        border-radius: 6px;
        box-sizing: border-box;
        background: #f3f5f6;
        overflow: hidden;
        height: 50px;
        padding: 0 10px;
        li {
          display: inline-block;
          line-height: 47px;
          padding: 0 15px;
          cursor: pointer;
          i {
            font-weight: bold;
          }
          .article-rule {
            font-size: 14px;
            color: #e67e7e;
          }
        }
      }
      .write-textarea {
        width: 100%;
        height: 100%;
        margin-bottom: 0;
        resize: none;
        color: #333;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 400;
        line-height: 30px;
        border: none;
        outline: none;
        -webkit-appearance: none;
        overflow-y: auto;
        padding-right: 0;
        padding-left: 0;
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #e0e0e0;
        }
      }
    }
    .content-preview {
      border-left: 1px solid #f3f3f3;
      .title {
        word-wrap: break-word;
        white-space: normal;
        word-break: break-all;
        text-align: left;
        max-width: 100%;
        margin-top: 30px;
        margin-bottom: 30px;
        position: static;
        color: #48494d;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.3;
      }
      #mark-text {
        word-wrap: break-word;
        white-space: normal;
        word-break: break-all;
        font-size: 16px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background-color: #fff;
        }
        &::-webkit-scrollbar-track {
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #e0e0e0;
        }
      }
    }
  }
  .modal-container {
    width: 500px;
  }
  .writer-submit-view-footer {
    border-top: 1px solid #f3f3f3;
    margin-top: 20px;
    padding-top: 20px;
    .writer-modal-create {
      padding: 5px 20px;
      margin: 0 15px;
    }
    .writer-modal-cancel {
      padding: 5px 20px;
      margin: 0 15px;
    }
  }
}

.upload-pic-view {
  padding: 0 30px;
  .info {
    margin: 15px 0;
  }
  .form-control {
    width: 100%;
    margin-bottom: 0;
    display: block;
  }
  .footer-left-btn {
    position: relative;
    border: 1px solid #e0e0e0;
    &:hover {
      color: #666666;
    }
  }
}

.writer-submit-view {
  padding: 0 15px;
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
  .create-blog {
    float: left;
    margin-top: 30px;
    margin-left: 25px;
    .create-blog-view {
      .create-blog-input {
        border: 1px solid #9199a1;
        border-radius: 6px;
        padding: 3px 10px;
        width: 130px;
        vertical-align: middle;
      }
      button {
        vertical-align: middle;
      }
    }
    .box-hide {
      display: none;
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
      max-height: 160px;
      overflow-y: auto;
    }
  }
}
</style>
