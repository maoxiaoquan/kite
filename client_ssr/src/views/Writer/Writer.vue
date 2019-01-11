<template>


    <!--writer-lay layout-content start-->
    <section class="writer-lay layout-content" :class="{'full-screen':!edit_full_screen}" id="writer">

        <!--writer-header start-->
        <div class="writer-header" id="writer-header">

            <div class="writer-header-view clearfix">
                <ul class="writer-right">
                    <li><a class="btn btn-primary" href="javascript:;" id="save-article-draft">保存为草稿</a></li>
                    <li><a class="btn btn-primary" href="javascript:;" id="issue-article-model"
                           @click="create_show_modal=true">发布文章</a></li>
                    <li><a class="btn btn-outline-primary" href="/"><i class="iconfont icon-zhuye"></i></a></li>
                </ul>
            </div>

        </div>
        <!--writer-header end-->

        <!--writer-content start-->
        <div class="writer-content">
            <div class="writer-box">
                <input class="writer-input" style="display: block" v-model="article_title" type="text"
                       id="article-title"
                       placeholder="请输入文章标题">
                <ul class="writer-nav">
                    <li @click="upload_article_modal_show=true;upload_img_url = '';"><i
                            class="iconfont icon-tupian"></i>
                    </li>
                    <li><a href="http://www.markdown.cn" target="_blank"><i class="iconfont icon-md"></i></a></li>
                    <li @click="edit_full_screen=!edit_full_screen">
                        <i class="iconfont"
                           :class="{'icon-quanping':!edit_full_screen,'icon-suoping':edit_full_screen}"></i>
                    </li>
                </ul>
                <textarea class="write-textarea" name="" id="write-textarea" v-model="article_content" cols="30"
                          rows="10" wrap="hard"></textarea>
            </div>
            <div class="content-preview" v-show="edit_full_screen">
                <h2 class="title">{{article_title}}</h2>
                <div id="mark-text" class="box-article-view"></div>
            </div>
        </div>
        <!--writer-content end-->

        <!-- use the modal component, pass in the prop -->
        <Dialog :show.sync="upload_article_modal_show">
            <h3 slot="header">插入图片</h3>
            <div class="upload-pic-view">

                <p class="info">请直接填写图片URL：</p>
                <div class="input-view">
                    <input v-model="upload_img_url" type="text" class="form-control"
                           placeholder="http://example.com/image.jpg">
                </div>
                <p class="info">或者：</p>
                <div class="upload-local">
                    <a href="#" class="btn btn-default footer-left-btn">
                        <input @change="change_file($event)" type="file" id="uploader" name="files[]" multiple=""
                               onchange="" style="position:absolute; top:0; right:0; opacity:0; filter: alpha(opacity=0);
                               font-size:23px; direction: ltr; cursor: pointer;">
                        插入本地图片和附件...</a>
                </div>

            </div>
            <div slot="footer">
                <div class="writer-submit-view-footer">
                    <button type="button" class="btn btn-primary writer-modal-create" @click="save_upload">确定
                    </button>
                    <button type="button" class="btn btn-secondary writer-modal-cancel"
                            @click="upload_article_modal_show = false">
                        取消
                    </button>
                </div>
            </div>
        </Dialog>


        <!-- use the modal component, pass in the prop -->
        <Dialog :show.sync="create_show_modal">
            <h3 slot="header">发布文章</h3>
            <div class="writer-submit-view">
                <div class="clearfix">
                    <div class="topic-warp topic-warp-topic">
                        <p class="common-title">个人专题</p>
                        <div class="common-select-box topic-box js-topic-box">
                            <span class="common-select-name" @click="topic_ul_list_show=!topic_ul_list_show">{{current_topic.topic_name?current_topic.topic_name:'请选择需要投递的栏目'}}</span>
                            <i class="iconfont icon-moreunfold" @click="topic_ul_list_show=!topic_ul_list_show"></i>
                            <ul class="common-select-ul" v-show="topic_ul_list_show">
                                <li class="active" @click="current_topic={};topic_ul_list_show=false">请选择需要投递的栏目</li>
                                <li v-for="item in user_article_topic_all"
                                    @click="current_topic=item;topic_ul_list_show=false">{{item.topic_name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="create-topic">
                        <div class="create-topic-view" v-show="create_topic_show">
                            <input class="create-topic-input" v-model="topic_name" type="text">
                            <button class="btn btn-primary btn-sm" @click="save_create_topic">保存</button>
                            <button class="btn btn-primary btn-sm" @click="create_topic_show=false">取消</button>
                        </div>
                        <button class="btn btn-primary btn-sm" v-show="!create_topic_show"
                                @click="create_topic_show=true">
                            创建新专题
                        </button>
                    </div>
                </div>

                <div class="clearfix">
                    <div class="topic-warp topic-warp-topic">
                        <p class="common-title">文章形式</p>
                        <div class="common-select-box topic-box js-topic-box" style="width: 130px">
                            <span class="common-select-name" @click="article_type_list_show=!article_type_list_show">{{current_article_type.text}}</span>
                            <i class="iconfont icon-moreunfold"
                               @click="article_type_list_show=!article_type_list_show"></i>
                            <ul class="common-select-ul" v-show="article_type_list_show">
                                <li v-for="item in article_type_list"
                                    @click="current_article_type=item;article_type_list_show=false">{{item.text}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="tag-warp">
                    <p class="common-title">文章标签<span><em id="chosen_tag_num">{{current_article_tag_arr.length}}</em>/3</span>
                    </p>
                    <div class="search-box clearfix" ref="search_box">
                        <div class="clearfix js-chosen-tags" ref="js_chosen_tags"
                             v-show="current_article_tag_arr.length>0">
                            <span class="tag-item" v-for="item in current_article_tag_arr"
                                  @click="delete_current_article_tag(item)">{{item.article_tag_name}}</span>
                        </div>
                        <input class="search-input" v-show="current_article_tag_arr.length<3"
                               placeholder="选择下列热门标签或输入关键词检索标签"
                               :style="{'width':search_box_width}" v-model="search_article_tag">
                    </div>
                    <p class="search-result js-search-result" v-show="search_result_show">相关“<span
                            class="js-search-text">{{search_article_tag}}</span>”的搜索
                        <span class="js-search-num">{{article_tag_all.length}}</span> 个</p>
                    <div class="tag-list-view js-tag-nano has-scrollbar" style="height: 160px;">
                        <div class="clearfix js-tag-list">
                            <span class="tag-item" v-for="item in article_tag_all" @click="add_article_tag(item)">{{item.article_tag_name}}</span>
                        </div>
                    </div>
                </div>


            </div>
            <div slot="footer">
                <div class="writer-submit-view-footer">
                    <button type="button" class="btn btn-primary writer-modal-create" @click="save_article">保存
                    </button>
                    <button type="button" class="btn btn-secondary writer-modal-cancel"
                            @click="create_show_modal = false">
                        取消
                    </button>
                </div>
            </div>
        </Dialog>

    </section>
    <!--writer-lay layout-content end-->
</template>

<script>
  export default {
    name: 'Writer',
    data () {
      return {
        upload_article_modal_show: false, // upload picture 上传图片模态窗口
        edit_full_screen: true, // edit is full screen 编辑器是否全屏显示
        article_title: '', // article title   文章的标题
        article_content: '', // article content   文章输入主内容
        create_show_modal: false,  // article save model   保存时模态框是否显示的控制
        current_topic: {},   // current user article topic  当前选中的用户文章专题
        topic_ul_list_show: false, // whether to display topic list  用户文章专题列表是否显示控制
        topic_name: '', // create user article topic name 创建文章专题input绑定的值
        create_topic_show: false, // whether to display create topic btn and input 创建用户文章专题input是否显示
        article_type_list: [ // whether to display create topic btn and input 文章类型列表
          {
            id: '',
            text: '请选择'
          },
          {
            id: 0,
            text: '原创'
          },
          {
            id: 1,
            text: '转载'
          }
        ],
        current_article_type: { // 选中文章类型的数据
          id: '',
          text: '请选择'
        },
        article_type_list_show: false,
        source_article_tag_all: [],
        article_tag_all: [],
        user_article_topic_all: [],
        search_article_tag: '',
        search_box_width: '100%',
        current_article_tag_arr: [],
        search_result_show: false,
        upload_img_url: '', // 图片上传url
      }
    },

    created () {
      /*this.get_article_tag_all()
      this.get_user_article_topic_all()*/
    },
    watch: {
      article_content: function (val) {
        document.getElementById('mark-text').innerHTML =
          marked(val, { breaks: true })
      },
      search_article_tag: function (val) {
        var that = this
        var _arr = []
        for (var item in that.source_article_tag_all) {
          if ((that.source_article_tag_all[item].article_tag_name).toLowerCase()
            .indexOf(that.search_article_tag.toLowerCase()) >= 0) {
            _arr.push(that.source_article_tag_all[item])
          }
        }
        that.article_tag_all = _arr
        if (that.search_article_tag.length === 0) {
          that.search_result_show = false
        } else {
          that.search_result_show = true
        }
      }
    },
    methods: {
      get_article_tag_all: function () {
        var that = this
        _server.get_article_tag_all()
          .then(function (res) {
            that.source_article_tag_all = res.data.list
            that.article_tag_all = res.data.list
          })
      },
      get_user_article_topic_all: function () {
        var that = this
        _server.get_user_article_topic_all()
          .then(function (res) {
            that.user_article_topic_all = res.data.list
          })
      },
      save_create_topic: function () {
        var that = this
        _server.create_user_article_topic({
          topic_name: that.topic_name
        })
          .then(function (res) {
            if (res.state === 'success') {
              alert('创建成功')
              that.topic_name = ''
              that.get_user_article_topic_all()
              that.create_topic_show = false
            } else {
              alert(res.message)
            }
          })
      },
      add_article_tag: function (val) {
        var that = this
        that.search_article_tag = ''
        let _arr = []
        for (var item in that.current_article_tag_arr) {
          _arr.push(that.current_article_tag_arr[item].article_tag_name)
        }
        if (that.current_article_tag_arr.length < 3 && _arr.indexOf(val.article_tag_name) === -1) {
          that.current_article_tag_arr.push(val)
        }
        that.render_current_article_tag()
      },
      delete_current_article_tag: function (val) {
        var that = this
        for (var item in that.current_article_tag_arr) {
          if (val.article_tag_name === that.current_article_tag_arr[item].article_tag_name) {
            that.current_article_tag_arr.splice(item, 1)
          }
        }
        that.render_current_article_tag()
      },
      render_current_article_tag: function () {
        var that = this
        that.$nextTick(function () {
          that.search_box_width = (that.$refs.search_box.offsetWidth - that.$refs.js_chosen_tags.offsetWidth - 15) + 'px'
        })
      },
      getObjectValues: function (object) {
        var values = []
        for (var property in object) {
          values.push(object[property].article_tag_id)
        }
        return values
      },
      save_upload: function () { // 图片上传保存写入marked
        var that = this
        if (!that.upload_img_url) {
          alert('请填写插入的图片地址')
          return false
        }
        that.article_content += '![Alt text](' + that.upload_img_url + ')'
        that.upload_article_modal_show = false
      },
      save_article: function () {
        var that = this
        var params = {
          title: that.article_title,//文章的标题
          content: marked(that.article_content, { breaks: true }), /*主内容*/
          origin_content: that.article_content, /*源内容*/
          source: that.current_article_type.id, // 来源 （1原创 2转载）
          type: 1, // 类型 （1文章 2说说 3视频 4公告 ）
          topic_ids: that.current_topic.topic_id,
          tag_ids: that.getObjectValues(that.current_article_tag_arr)
            .join(',')
        }

        _server.post_article_writer(params)
          .then(function (res) {
            if (res.state === 'success') {
              this.create_show_modal = false
              window.location.href = '/user/<%= user_info.uid %>/article/all'
            } else {
              alert(res.message)
            }
          })
          .catch(function () {

          })
      },
      post_upload_article_picture: function () {
        var that = this
        var data = new FormData()//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
        data.append('file', this.file, this.file.name)
        _server.post_upload_article_picture(data)
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                alert('上传文章图片成功')
                that.article_content += '![Alt text](' + res.data.img + ')'
                that.upload_article_modal_show = false
              } else {
                alert(res.message)
              }
            })
          })
      },
      change_file: function (event) {
        var that = this
        this.file = event.target.files[0]
        setTimeout(function () {
          that.post_upload_article_picture()
        }, 200)
      },
    }
  }
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
            box-shadow: 0 8px 16px 0 rgba(28, 31, 33, 0.1);
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
        .topic-warp {
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
            &.topic-warp-topic {
                float: left;
            }
        }
        .create-topic {
            float: left;
            margin-top: 30px;
            margin-left: 25px;
            .create-topic-view {
                .create-topic-input {
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
