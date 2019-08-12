<template>
  <div class="comment-item"
       :id="'comment'+childCommentItem.id">
    <div class="avatar">
      <el-image :src="childCommentItem.user.avatar"
                lazy></el-image>
    </div>
    <div class="comment-body">

      <div class="comment-main">
        <h4>
          <router-link class="user-info"
                       :to="{name:'user',params:{uid:childCommentItem.user.uid}}">{{childCommentItem.user.nickname}}</router-link>
          <template v-if="childCommentItem.reply_user">
            <i class="middle-text">回复</i>
            <router-link class="user-info"
                         :to="{name:'user',params:{uid:childCommentItem.reply_user.uid}}">{{childCommentItem.reply_user.nickname}}</router-link>
          </template>
        </h4>
        <div class="comment-text"
             v-if="Number(childCommentItem.status)===2||Number(childCommentItem.status)===5"
             v-html="commentRender(childCommentItem.content)"></div>
        <div class="comment-text"
             v-else-if="Number(childCommentItem.status)===1"
             style="color:#f96b84;">当前用户评论需要管理员审核才能可见</div>
        <div class="comment-text"
             v-else-if="Number(childCommentItem.status)===3"
             style="color:#f96b84;">当前用户评论违规</div>
      </div>

      <div class="comment-foot clearfix">
        <span>{{childCommentItem.create_at}}</span>
        <span class="comment-reply"
              v-if="Number(childCommentItem.status)===2||Number(childCommentItem.status)===5"
              @click="isComment=!isComment;reply_uid=childCommentItem.uid">{{isComment?'取消回复':'回复'}}</span>
        <span class="comment-delete"
              v-if="personalInfo.user.uid===childCommentItem.uid"
              @click="deleteComment(childCommentItem.id)">删除</span>
      </div>

    </div>

    <div class="comment-form-view"
         v-if="isComment"
         :id="'comment-reply'+childCommentItem.id">
      <comment-form :reply_uid="reply_uid"
                    :child_comment_id="p_id"
                    :dynamicId="dynamicId"
                    @commentChange="commentChange" />
    </div>
  </div>
</template>

<script>
import commentForm from "./CommentForm";
import faceqq from "./face/qq";

export default {
  name: "childrenItem",
  props: ["childCommentItem", "p_id", "dynamicId"],
  data: function () {
    return {
      isComment: false,
      reply_uid: ""
    };
  },
  methods: {
    commentChange (res) {
      this.isComment = false;
      this.$emit("ChildCommentChange", res);
    },
    deleteComment (id) {
      this.$store
        .dispatch("articleComment/ARTICLE_COMMENT_DELETE", {
          aid: this.article.aid,
          comment_id: id
        })
        .then(res => {
          if (res.state === "success") {
            document.querySelector("#comment" + id + "").style.display = "none";
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
      faceqq.map(faceItem => {
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
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f1f1f1;
  .avatar {
    float: left;
    margin: 0 13px 10px 0;
    margin-right: 0;
    /deep/ .el-image {
      width: 32px;
      height: 32px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 80px;
      }
    }
  }
  .comment-body {
    margin-left: 40px;
    .comment-main {
      display: inline-block;
      padding: 5px 13px;
      background: #f7f7f7;
      border-radius: 20px;
      font-size: 14px;
      color: #393939;
      h4 {
        font-weight: bold;
        font-size: 13px;
        color: #393939;
        .middle-text {
          font-size: 12px;
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
