<template>
    <div class="box-comment">
        <div class="box-comment-part">
            <h2 class="box-comment-part-title">发表评论
                <small>已发布评论 <em>{{comment_count}}</em> 条</small>
            </h2>
            <div class="comment-form" id="comment_form">
                <div class="comment-avatar">
                    <% if(user_info.islogin){ %>
                    <img src="<%= user_info.avatar %>"
                         alt="avatar">
                    <% } else { %>
                    <img src="/default/img/default_avatar.jpg"
                         alt="avatar">
                    <% } %>
                </div>
                <div class="form-item" style="margin-left: 50px;">
                    <div class="input-view">
                        <textarea name="comment" v-model="comment_content" class="txt long-txt textarea "></textarea>
                    </div>
                    <div class="form-item form-btns clearfix">
                        <div class="left-view">
                            <i class="iconfont icon-biaoqing"></i>
                        </div>
                        <div class="right-view">
                            <button type="submit" class="form-btn" @click="submit_comment">提交评论</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="comment-list">
                <div id="commentlist">
                    <comment-list :comment-item="item" v-for="item in comment_list"/>
                </div>
                <!-- <p id="comment_loading" class="hidden"><i class="icon-spin1 animate-spin"></i> 评论加载中....</p>-->
                <span class="btn" id="get_comments" v-show="comment_loading_btn&&comment_count>comment_pageSize"
                      @click="get_comment_list">底下还有哟~快放我们出去~ </span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        comment_page: 1,
        comment_pageSize: 10,
        comment_count: 0,
        comment_list: [],// 用户评论的列表
        comment_content: '', // 顶级输入框
        comment_loading_btn: true
      }
    },
    /*  created: function () {
        this.get_article() // 根据aid ajax 获取文章
        this.get_curr_user_info() // 获取当前登录用户信息
        this.get_article_user_info() // 获取当前文章用户信息
        this.get_comment_list() // 获取用户的评论
      },*/
    methods: {
      get_comment_list: function () { // 获取评论列表
        var that = this
        _server.get_comment_list({
          aid: '<%= data.article.aid %>',
          page: that.comment_page,
          pageSize: that.comment_pageSize
        })
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                that.comment_list = that.comment_list.concat(res.data.comment_list)
                that.comment_count = res.data.count
                that.comment_page += 1
                if (res.data.comment_list.length < that.comment_pageSize) {
                  that.comment_loading_btn = false
                } else {
                  that.comment_loading_btn = true
                }
              } else {
                alert(res.message)
              }
            })
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      submit_comment: function () { // 提交评论
        var params = {
          aid: '<%= data.article.aid %>',
          article_uid: '<%= data.article.uid %>',
          uid: '<%= user_info.uid %>',
          content: this.comment_content
        }
        var that = this
        _server.post_create_comment(params)
          .then(function (res) {
            that.$nextTick(function () {
              if (res.state === 'success') {
                alert(res.message)
                that.comment_content = '' // 评论输入框为空
                that.comment_list.unshift(res.data) // 手动插入回复后的评论数据
                that.comment_count += 1  // 手动评论数据 +1
              } else {
                alert(res.message)
              }
            })
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
    /*comment-lay start*/

    .box-comment {
        margin-bottom: 100px;
        .box-comment-part {
            margin-top: 60px;
            margin-bottom: 60px;
            .box-comment-part-title {
                font-size: 20px;
                color: #393939;
                font-weight: bold;
                line-height: 1.1;
                padding: 0 0 26px;
                border-bottom: 1px solid #eaeaea;
                margin: 0 0 45px;
                position: relative;
                small {
                    font-size: 14px;
                    font-weight: normal;
                    color: #c8c8c8;
                    margin-left: 10px;
                    em {
                        font-style: normal;
                        color: #ff5a00;
                        font-weight: bold;
                        font-size: 18px;
                    }
                }
            }
            .comment-form {
                .comment-avatar {
                    float: left;
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    border-radius: 35px;
                }
                .form-item {
                    margin-bottom: 20px;
                    font-size: 14px;
                    line-height: 40px;
                    color: #555;
                    display: block;
                    .txt {
                        display: block;
                        box-sizing: border-box;
                        width: 100%;
                        border-radius: 40px;
                        line-height: 25px;
                        height: 45px;
                        padding: 5px 15px;
                        border: none;
                        background: #f7f7f7;
                        color: #555;
                        font-size: 14px;
                        outline: none;
                        float: left;
                        font-family: 'Microsoft Yahei', sans-serif;
                        &.textarea {
                            height: 100px;
                            border-radius: 20px;
                        }
                    }
                    .input-view {
                        position: relative;
                    }
                    .left-view {
                        float: left;
                        .iconfont {
                            margin-left: 15px;
                            margin-top: 10px;
                            display: inline-block;
                            font-size: 20px;
                        }
                    }
                    .right-view {
                        float: right;
                        padding-top: 15px;
                    }
                    .form-btn {
                        display: inline-block;
                        border-radius: 40px;
                        box-sizing: border-box;
                        border: none;
                        background: #f50;
                        color: #fff;
                        text-align: center;
                        line-height: 40px;
                        cursor: pointer;
                        padding: 0 30px;
                        margin-left: 10px;
                        outline: none;
                        &.btn-cancel {
                            background: #999999;
                        }
                    }
                }
            }
        }
        .comment-list {
            list-style: none;
            margin: 38px 0 25px 0;
            margin-bottom: 40px;
        }
    }

    /*comment-lay end*/
</style>
