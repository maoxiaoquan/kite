<template>
  <div class="book-read-view">
    <client-only>
      <!-- this component will only be rendered on client-side -->
      <div class="book-section"
           :class="{'fold-pc':!isShowAside}">
        <div class="book-summary">
          <div class="book-summary-inner">
            <div class="book-summary__header">
              <router-link :to="{name:'home'}"
                           class="navbar-brand logo"
                           v-if="website.meta.logo"
                           :style="{'background-image':'url('+website.meta.logo+')'}"></router-link>
              <router-link :to="{name:'home'}"
                           class="navbar-brand logo-text"
                           v-else>{{website.meta.website_name}}</router-link>
              <div class="label">小书</div>
            </div>
            <div class="book-summary-btn">
              <div class="section-buy"
                   @click="writeChapter('create')">创建新章节</div>
            </div>
            <div class="book-directory"
                 :class="{'bought':personalInfo.islogin}">
              <router-link class="section"
                           :to="{name:'WriteBookView', params: { books_id: $route.params.books_id, book_id: bookItem.book_id}}"
                           v-for="(bookItem,key) in books.booksBookAll"
                           :key="key">
                <div class="step">
                  <div class="step-btn">{{key+1}}</div>
                </div>
                <div class="center">
                  <div class="title">{{bookItem.title}}</div>
                </div>
              </router-link>
            </div>
            <div class="book-summary__footer"></div>
          </div>

        </div>
        <div class="book-content">
          <div class="book-content-inner">
            <div class="book-content__header">
              <div class="menu"
                   @click="isShowAside=!isShowAside"><i class="el-icon-s-operation"></i></div>
              <div class="title">
                <router-link :to="{name:'book',params:{books_id:$route.params.books_id}}">{{books.booksInfo.title}}</router-link>
              </div>
              <div class="user-auth">
                <div class="nav-item auth"
                     v-if="!personalInfo.islogin">
                  <div class="nav-item-view"
                       @click="showLogin"
                       v-if="website.config.on_login==='yes'">
                    <a class="btn btn-sm sign-btn btn-block"
                       href="javascript:;">登录</a>
                  </div>
                  <div class="nav-item-view"
                       @click="showRegister"
                       v-if="website.config.on_register==='yes'">
                    <a class="btn s-btn--primary btn-sm sign-btn btn-outline-warning"
                       href="javascript:;">注册</a>
                  </div>
                </div>
                <div class="nav-item dropdown"
                     v-else>
                  <el-dropdown trigger="click"
                               @command="commandChange">
                    <div class="el-dropdown-link">
                      <div class="avatar-img">
                        <el-image :src="personalInfo.user.avatar"
                                  lazy></el-image>
                      </div>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-user"
                                        :command="{name:'user',params:{uid:personalInfo.user.uid}}">我的主页</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-setting"
                                        :command="{name:'setting'}">设置</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-right"
                                        :command="{name:'esc'}">退出</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
            <div class="book-body transition--next">
              <div class="section-content"
                   v-loading="isLoadingEdit">
                <div class="operating clearfix">
                  <button class="btn btn-save"
                          @click="saveBook">{{$route.params.book_id==='create'?'新建小书章节':'更新当前章节'}}</button>
                  <button class="btn btn-cancel"
                          v-if="$route.params.book_id!=='create'"
                          @click="resetBook">恢复默认稿</button>
                  <button class="btn btn-look"
                          v-if="$route.params.book_id!=='create'"
                          @click="lookChapter(editDataInfo.book_id)">查看演示</button>

                  <button class="btn btn-delete"
                          v-if="$route.params.book_id!=='create'"
                          @click="deleteChapter(editDataInfo.book_id)"><i class="el-icon-delete"></i></button>
                </div>

                <div class="content-edit">
                  <input type="text"
                         class="title-input"
                         v-model="write.title">
                  <mavon-editor defaultOpen="edit"
                                :boxShadow="false"
                                v-model="write.content"
                                :toolbars="toolbars"
                                ref="mavonEditor"
                                :imageFilter="imageFilter"
                                @imgAdd="$imgAdd" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { UploadImage } from '@components'
import { mavonEditor } from 'mavon-editor'
import { cookie } from "../../../../server/utils/cookie";
import 'mavon-editor/dist/css/index.css'
import ClientOnly from 'vue-client-only'
import marked from "marked";
import { mapState } from 'vuex'
export default {
  name: "WriteBookView",
  metaInfo () {
    return {
      title: this.$route.params.book_id === "create" ? '创建小书章节' : `编辑-${this.editDataInfo.title || ''}` || "",
      meta: [
        {
          // set meta
          name: "description",
          content: this.$route.params.book_id === "create" ? '创建小书章节' : `编辑-${this.editDataInfo.title || ''}` || "",
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("PERSONAL_INFO", { accessToken }),
      store.dispatch('website/GET_WEBSITE_INFO'),
      store.dispatch("books/GET_BOOKS_INFO", { books_id: route.params.books_id }),
    ]);
  },
  created () {
    this.currentWriteType = this.$route.query.type || 'add'
  },
  mounted () {
    this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
    this.initEdit()
  },
  data () {
    return {
      currentWriteType: '',
      write: {
        title: "",
        content: "",
        sort: 0
      },
      isShowAside: true, // 是否显示侧栏
      isLoadingEdit: false, // 加载修改的数据
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
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      editDataInfo: {} // 修改小书的信息
    };
  },
  watch: {
    $route (to, from) {
      this.initEdit()
    }
  },
  methods: {
    commandChange (val) {
      if (val.name !== "esc") {
        this.$router.push(val);
      } else {
        this.escLogin();
      }
    },
    escLogin () {
      this.$message.warning("已退出当前账户，请重新登录");
      cookie.delete("accessToken");
      window.location.reload();
    },
    showLogin () {
      // 显示登录
      this.$store.commit("SET_IS_LOGIN", true);
    },
    showRegister () {
      // 显示注册
      this.$store.commit("SET_IS_REGISTER", true);
    },
    resetBook () { // 回复默认
      this.$confirm('此操作将恢复到初始编辑状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.initEdit()
      }).catch(() => {
      });
    },
    deleteChapter (book_id) {
      this.$confirm('此操作将永久删除该小书章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('book/DELETE_BOOK', {
          book_id
        })
          .then(result => {
            if (result.state === 'success') {
              this.$message.success(result.message, ',前往创建');
              this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
              this.writeChapter('create')
            } else {
              this.$message.warning(result.message);
            }
          })
      }).catch(() => {
      });
    },
    initEdit () {
      if (this.$route.params.book_id !== "create") {
        // 判断是不是创建，不是则是修改，同时赋值
        this.isLoadingEdit = true
        this.$store
          .dispatch("book/GET_USER_BOOK_INFO", {
            book_id: this.$route.params.book_id
          })
          .then(result => {
            this.isLoadingEdit = false
            this.write = result.data.book
            this.editDataInfo = result.data.book
            this.write.content = result.data.book.origin_content;
          }).catch(err => {
            this.isLoadingEdit = false
          });
      } else {
        this.write = {
          title: "",
          content: "",
          sort: this.books.booksBookAll ? this.books.booksBookAll.length + 1 : 0
        }
      }
    },
    imageFilter (file) {
      if (file.size > 1 * 1024 * 1024) {
        this.$message.success("上传小书图片应该小于1M");
        return false
      } else {
        return true
      }
    },
    lookChapter (book_id) { // 查看小书章节
      this.$router.push({ name: 'BookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formData = new FormData();
      formData.append('file', $file);
      this.$store
        .dispatch("book/UPLOAD_BOOK_IMG", formData)
        .then(res => {
          if (res.state === "success") {
            this.$message.success("上传图片成功");
            this.$refs.mavonEditor.$img2Url(pos, res.data.img);
          } else {
            this.$message.warning(res.message);
            return false
          }
        });
    },
    writeChapter (book_id) { // 编辑或新增小书章节
      this.$router.push({ name: 'WriteBookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
    saveBook () {
      if (!this.write.title) {
        this.$message.warning('小书章节标题不能为空！');
        return false
      }
      if (!this.write.content) {
        this.$message.warning('小书章节内容不能为空！');
        return false
      }
      var params = {
        books_id: this.$route.params.books_id,
        title: this.write.title, //小书的标题
        content: marked(this.write.content, { breaks: true }) /*主内容*/,
        origin_content: this.write.content, /*源内容*/
        sort: this.write.sort
      };
      this.$route.params.book_id !== "create" &&
        (params.book_id = this.$route.params.book_id);

      let dispatch_url =
        this.$route.params.book_id === "create"
          ? "book/CREATE_BOOK"
          : "book/UPDATE_BOOK";

      this.$store
        .dispatch(dispatch_url, params)
        .then(result => {
          if (result.state === "success") {
            this.$message.success(result.message)
            if (this.$route.params.book_id === "create") {
              this.writeChapter(result.data.book.book_id)
            }
            this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
          } else {
            this.$message.warning(result.message);
          }
        })
        .catch((err) => {
          this.$message.error("出现错误：" + err);
        });

    },
  },
  computed: {
    ...mapState(['books', 'personalInfo', 'website'])
  },
  components: {
    'mavon-editor': mavonEditor,
    UploadImage,
    ClientOnly
  },
};
</script>

<style scoped lang="scss">
.book-read-view {
  position: relative;
  overflow: hidden;
  .book-section {
    position: relative;
    display: flex;

    &.fold-pc .book-summary {
      left: -320px;
    }
    &.fold-pc .book-content {
      margin-left: 0;
      .book-content-inner {
        .book-content__header {
          left: 0;
        }
      }
    }
    .book-summary {
      width: 320px;
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      cursor: default;
      flex-shrink: 0;
      z-index: 2;
      border-right: 1px solid #ddd;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: left;
      .book-summary-inner {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: #f0f1f4;
        position: relative;
        z-index: 1;
        height: 100%;
        .book-summary__header {
          height: 60px;
          display: flex;
          padding-left: 16px;
          align-items: center;
          background-color: #fff;
          border-bottom: 1px solid #ddd;
          .logo {
            background-size: 100% 100%;
            display: block;
            width: 90px;
            height: 32px;
            left: 10%;
          }
          .logo-text {
            font-size: 25px;
            color: #e67e7e;
          }
          .label {
            margin-left: 13px;
            margin-right: 25px;
            padding-left: 10px;
            padding-right: 10px;
            height: 24px;
            line-height: 24px;
            font-size: 15px;
            font-weight: 500;
            color: #007fff;
            position: relative;
            background-color: rgba(0, 127, 255, 0.1);
            &:after {
              content: "";
              position: absolute;
              bottom: 0;
              right: 0;
              width: 0;
              height: 0;
              border-color: rgba(0, 127, 255, 0.2) #fff #fff
                rgba(0, 127, 255, 0.2);
              border-style: solid;
              border-width: 5px;
            }
          }
        }
        .book-summary-btn {
          height: 60px;
          .section-buy {
            height: 60px;
            cursor: pointer;
            background-color: #007fff;
            color: #fff;
            font-size: 14px;
            line-height: 60px;
            text-align: center;
          }
        }

        .book-directory {
          overflow-y: auto;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          height: calc(100% - 60px);
          &.bought {
            height: calc(100% - 120px);
          }
          .section {
            position: relative;
            min-height: 75px;
            cursor: default;
            padding-left: 20px;
            padding-right: 35px;
            border-radius: 2px;
            font-size: 14px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #8f9193;
          }
          .section {
            min-height: 60px;
            padding-left: 16px;
            cursor: pointer;
            &.current-active {
              color: #333;
              background: rgba(0, 0, 0, 0.1);
            }
            .step {
              align-items: center;
              display: flex;
              margin-right: 15px;
              align-self: stretch;
              position: relative;
            }
            .step {
              margin-right: 10px;
              .step-btn {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                width: 36px;
                height: 36px;
                font-size: 16px;
                border-radius: 50%;
                border: 2px solid #b5b7ba;
                color: #b5b7ba;
                box-sizing: border-box;
                text-align: center;
                background-color: #fff;
                z-index: 1;
              }
              .step-btn {
                width: 30px;
                height: 30px;
                font-size: 14px;
              }
            }
            .step:after,
            .step:before {
              z-index: 0;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              width: 2px;
              background-color: #b5b7ba;
              height: 50%;
              content: "";
            }
            .step:after {
              top: 50%;
            }
            .step:before {
              top: 0;
            }

            &.read .step:after,
            &.read .step:before,
            &.route-active .step:after,
            &.route-active .step:before {
              background-color: #007fff;
            }
            &:first-child {
              .step {
                &:before {
                  top: 0;
                  content: "";
                  display: none;
                }
              }
            }
            &:last-child {
              .step {
                &:after {
                  top: 0;
                  content: "";
                  display: none;
                }
              }
            }
          }
        }
      }
    }
    .book-content {
      width: 100%;
      margin-left: 320px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      .book-content-inner {
        position: relative;
        .book-content__header {
          position: fixed;
          right: 0;
          left: 319px;
          min-width: 320px;
          background-color: #fff;
          z-index: 2000;
          border-bottom: 1px solid #ddd;
          height: 60px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 20px;
          padding-right: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 18px;
          .menu {
            width: auto;
            height: 20px;
            margin-right: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            img {
              vertical-align: top;
            }
          }
          .title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 700;
          }
          .user-auth {
            position: relative;
            right: 0;
            margin-left: 10px;
            margin-right: 5px;
            flex-shrink: 0;
            .nav-item {
              color: #71777c;
              font-size: 1.33rem;
              margin: 0;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              .avatar-img {
                display: inline-block;
                position: relative;
                width: 36px;
                height: 36px;
                border-radius: 72px;
                /deep/ .el-image {
                  width: 36px;
                  height: 36px;
                  img {
                    width: 100%;
                    height: 100%;
                    border-radius: 80px;
                  }
                }
              }
            }
          }
        }
        .book-body {
          min-height: 100vh;
          box-sizing: border-box;
          padding-top: 90px;
          position: relative;
          background-color: #e6e7e9;
          padding-bottom: env(safe-area-inset-bottom);
          .section-content {
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            padding: 30px;
            box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.15);
            background-color: #fff;
            border-radius: 2px;
            box-sizing: border-box;
            .operating {
              margin-bottom: 20px;
              .btn {
                margin-right: 10px;
                font-size: 14px;
              }
              .btn-save {
                color: rgba(0, 0, 0, 0.88);
                background: #ffd600;
                border-color: #ffd600;
              }
              .btn-cancel {
              }
              .btn-look {
                color: #db5000;
                border: 1px solid rgba(219, 80, 0, 0.7);
                transition: all 0.3s ease;
                background: #fff;
              }
              .btn-delete {
                color: #ffa200;
                border: 1px solid rgba(219, 80, 0, 0.7);
                transition: all 0.3s ease;
                background: #fff;
                float: right;
              }
            }
            .content-edit {
              .title-input {
                border: 1px solid #d7dce2;
                border-radius: 4px;
                width: 100%;
                height: 45px;
                margin-bottom: 20px;
                padding-left: 20px;
                padding-right: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
