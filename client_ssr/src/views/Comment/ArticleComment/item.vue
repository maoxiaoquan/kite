<template>
    <div class="comment-item" :id="'comment'+commentItem.id" ref="comment_list">
        <div class="avatar">
            <img :src="commentItem.user.avatar" alt="avatar">
        </div>
        <div class="comment-body">
            <div class="comment-main">
                <h4><a>{{commentItem.user.nickname}}</a></h4>
                <p>{{commentItem.content}}</p>
            </div>
            <div class="comment-foot clearfix">
                <span>{{commentItem.create_date}}</span>
                <span class="comment-reply" @click="reply_btn('')">回复</span>
                <span class="comment-delete" v-if="sign_uid==commentItem.uid"
                      @click="delete_comment(commentItem.id)">删除</span>
            </div>
        </div>
        <div class="comment-item-children" v-if="commentItem.children.length>0||children_comment_input">

            <div class="comment-item-children-view" v-if="commentItem.children.length>0">
                <div class="comment-item" :id="'comment'+child_item.id" data-author=""
                     v-for="child_item in commentItem.children">
                    <div class="avatar">
                        <img :src="child_item.user.avatar" alt="avatar">
                    </div>
                    <div class="comment-body">
                        <div class="comment-main">
                            <h4>{{child_item.user.nickname}}</h4>
                            <p v-html="child_item.content"></p>
                        </div>
                        <div class="comment-foot clearfix">
                            <span>{{child_item.create_date}}</span>
                            <span class="comment-reply" @click="reply_btn('@'+child_item.user.nickname+' ')">回复</span>
                            <span class="comment-delete" v-if="sign_uid==child_item.uid"
                                  @click="delete_comment(child_item.id)">删除</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comment-form" v-if="children_comment_input" :id="'comment-reply'+commentItem.id">
                <div class="comment-form">
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
                            <textarea v-model="comment_content" class="txt long-txt textarea "></textarea>
                        </div>
                        <div class="form-item form-btns clearfix">
                            <div class="left-view">
                                <i class="iconfont icon-biaoqing"></i>
                            </div>
                            <div class="right-view">
                                <button type="submit" class="form-btn btn-cancel" @click="children_comment_input=false">
                                    取消
                                </button>
                                <button type="submit" class="form-btn" @click="submit_comment">提交评论</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'index',
    props: ['commentItem'],
    data: function () {
      return {
        sign_uid: '<%= user_info.uid %>',
        children_comment_input: false,
        comment_content: '',
        parent_id: '',
        reply_id: ''
      }
    },
    created: function () {
      this.parent_id = this.commentItem.id
    },
    methods: {
      reply_btn: function (val) {
        var that = this
        this.comment_content = val
        this.children_comment_input = true
        this.reply_uid = this.commentItem.uid
      },
      submit_comment: function () {
        var params = {
          aid: '<%= data.article.aid %>',
          article_uid: '<%= data.article.uid %>',
          uid: '<%= user_info.uid %>',
          reply_uid: this.reply_uid,
          parent_id: this.commentItem.id,
          content: this.comment_content
        }
        var that = this
        _server.post_create_comment(params).then(function (res) {
          if (res.state === 'success') {
            alert(res.message)
            that.$nextTick(function () {
              that.comment_content = ''
              that.commentItem.children.push(res.data)
            })
          } else {
            alert(res.message)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      delete_comment: function (id) {
        var that = this
        _server.post_delete_comment({ aid: '<%= data.article.aid %>', comment_id: id }).then(function (res) {
          if (res.state === 'success') {
            document.querySelector('#comment' + id + '').style.display = 'none'
            alert(res.message)
          } else {
            alert(res.message)
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .comment-item {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #f1f1f1;
        &:last-child {
            border-bottom: none;
        }
        .avatar {
            float: left;
            margin: 0 13px 10px 0;
            margin-right: 0;
            img {
                display: block;
                width: 40px;
                height: 40px;
                overflow: hidden;
                border-radius: 35px;
            }
        }
        .comment-body {
            margin-left: 50px;
            .comment-main {
                display: inline-block;
                padding: 10px 15px;
                background: #f7f7f7;
                border-radius: 20px;
                font-size: 14px;
                color: #393939;
                h4 {
                    font-weight: bold;
                    font-size: 14px;
                    color: #393939;
                    margin-bottom: 5px;
                }
                p {
                    margin: 0;
                    word-break: break-all;
                }
            }
            .comment-foot {
                font-size: 12px;
                color: #bbb;
                font-weight: normal;
                margin: 8px 0 0 15px;
                span {
                    margin-right: 10px;
                    white-space: nowrap;
                    cursor: pointer;
                }
                .comment-reply {
                }
                .comment-delete {
                    float: right;
                    color: #f46e65;
                }
            }
            .comment-form {
                margin-top: 20px;
            }
        }
        .comment-item-children {
            margin-left: 50px;
            margin-top: 30px;
            padding-left: 20px;
            border-left: 1px solid #f1f1f1;
            overflow: hidden;
            .comment-item {
                margin-bottom: 15px;
                padding-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .comment-form {
                margin-top: 30px;
            }
            .comment-main {
                padding: 6px 10px;
                h4 {
                    margin-bottom: 0;
                    font-size: 13px;
                }
                p {
                    font-size: 13px;
                }
            }
            .avatar img {
                width: 35px;
                height: 35px;
            }
            .comment-avatar {
                width: 35px;
                height: 35px;
            }
        }
    }
    .btn {
        display: block;
        border-radius: 20px;
        box-sizing: border-box;
        border: none;
        background: #f50;
        color: #fff;
        text-align: center;
        line-height: 40px;
        height: 50px;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
        margin-top: 40px;
    }
</style>
