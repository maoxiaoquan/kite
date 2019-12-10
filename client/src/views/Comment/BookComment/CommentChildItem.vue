<template>
  <div class="comment-item"
       :id="'comment'+childCommentItem.id">
    <div class="avatar">
      <img v-lazy="childCommentItem.user.avatar"
           class="box-image"
           alt="">
    </div>
    <div class="comment-body">
      <div class="comment-main">
        <h4>
          <router-link class="user-info"
                       :to="{name:'user',params:{uid:childCommentItem.user.uid,routeType:'article'}}">{{childCommentItem.user.nickname}}</router-link>
          <template v-if="childCommentItem.reply_user">
            <i class="middle-text">回复</i>
            <router-link class="user-info"
                         :to="{name:'user',params:{uid:childCommentItem.reply_user.uid,routeType:'article'}}">{{childCommentItem.reply_user.nickname}}</router-link>
          </template>
        </h4>
        <div class="comment-text"
             v-if="Number(childCommentItem.status)===statusList.reviewSuccess||Number(childCommentItem.status)===statusList.freeReview"
             v-html="commentRender(childCommentItem.content)"></div>
        <div class="comment-text"
             v-else-if="Number(childCommentItem.status)===statusList.pendingReview"
             style="color:#f96b84;">当前用户评论需要管理员审核才能可见</div>
        <div class="comment-text"
             v-else-if="Number(childCommentItem.status)===statusList.reviewFail"
             style="color:#f96b84;">当前用户评论违规</div>
      </div>
      <div class="comment-foot clearfix">
        <span>{{childCommentItem.create_dt}}</span>
        <span class="comment-reply"
              v-show="personalInfo.islogin"
              v-if="Number(childCommentItem.status)===statusList.reviewSuccess||Number(childCommentItem.status)===statusList.freeReview"
              @click="onReply">{{isComment?'取消回复':'回复'}}</span>
        <span class="comment-delete"
              v-if="personalInfo.user.uid===childCommentItem.uid"
              @click="deleteComment(childCommentItem.id)">删除</span>
      </div>
    </div>

    <div class="comment-form-view"
         v-if="isComment"
         :id="'comment-reply'+childCommentItem.id">
      <comment-form :reply_uid="reply_uid"
                    :parent_id="p_id"
                    :reply_id="childCommentItem.id"
                    @commentChange="commentChange" />
    </div>
  </div>
</template>

<script>
import commentForm from "./CommentForm";
import { faceQQ } from '@components'
import {
  statusList,
  statusListText
} from '@utils/constant'

export default {
  name: "childrenItem",
  props: ["childCommentItem", "p_id", "comentKey"],
  data: function () {
    return {
      isComment: false,
      reply_uid: "",
      statusList
    };
  },
  methods: {
    commentChange (res) {
      this.isComment = false;
      this.$emit("ChildCommentChange", res);
    },
    onReply () {
      this.isComment = !this.isComment
      this.reply_uid = this.childCommentItem.uid
    },
    deleteComment (id) {
      this.$store
        .dispatch("book/BOOK_COMMENT_DELETE", {
          book_id: this.$route.params.book_id,
          comment_id: id
        })
        .then(res => {
          if (res.state === "success") {
            this.$emit('deleteChildComment', this.comentKey)
            this.$message.success(res.message);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    commentRender (val) {
      let newComment = val;
      faceQQ.map(faceItem => {
        newComment = newComment.replace(
          new RegExp("\\" + faceItem.face_text, "g"),
          faceItem.face_view
        );
      });
      return newComment;
    }
  },
  computed: {
    article () {
      return this.$store.state.article.article || {};
    },
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    }
  },
  components: {
    'comment-form': commentForm
  }
};
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
    .box-image {
      width: 40px;
      height: 40px;
      overflow: hidden;
      border-radius: 80px;
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
        .middle-text {
          font-size: 13px;
          display: inline-block;
          font-weight: normal;
          padding: 0 5px;
          color: #999;
        }
      }
      .comment-text {
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
    .comment-item {
      margin-bottom: 15px;
      padding-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    /deep/ .comment-form {
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
    /deep/ .avatar img {
      width: 35px;
      height: 35px;
    }
    /deep/ .comment-avatar {
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
