<template>
  <div class="comment-item" :id="'comment'+commentItem.id" ref="comment_list">
    <div class="avatar">
      <el-image :src="commentItem.user.avatar" lazy></el-image>
    </div>
    <div class="comment-body">
      <div class="comment-main">
        <h4>
          <router-link
            class="user-info"
            :to="{name:'user',params:{uid:commentItem.user.uid}}"
          >{{commentItem.user.nickname}}</router-link>
        </h4>
        <div
          class="comment-text"
          v-if="Number(commentItem.status)===2||Number(commentItem.status)===5"
          v-html="commentRender(commentItem.content)"
        ></div>
        <div
          class="comment-text"
          v-else-if="Number(commentItem.status)===1"
          style="color:#f96b84;"
        >当前用户评论需要管理员审核才能可见</div>
        <div
          class="comment-text"
          v-else-if="Number(commentItem.status)===3"
          style="color:#f96b84;"
        >当前用户评论违规</div>
      </div>
      <div class="comment-foot clearfix">
        <span>{{commentItem.create_at}}</span>
        <span
          class="comment-reply"
          v-if="Number(commentItem.status)===2||Number(commentItem.status)===5"
          @click="reply_btn('')"
        >回复</span>
        <span
          class="comment-delete"
          v-if="personal_info.user.uid===commentItem.uid"
          @click="delete_comment(commentItem.id)"
        >删除</span>
      </div>
    </div>
    <div class="comment-item-children" v-if="commentItem.children.length>0||children_comment_input">
      <div class="comment-item-children-view" v-if="commentItem.children.length>0">
        <div
          class="comment-item"
          :id="'comment'+childCommentItem.id"
          v-for="(childCommentItem,key) in commentItem.children"
          :key="key"
        >
          <div class="avatar">
            <el-image :src="childCommentItem.user.avatar" lazy></el-image>
          </div>
          <div class="comment-body">
            <div class="comment-main">
              <h4>
                <router-link
                  class="user-info"
                  :to="{name:'user',params:{uid:childCommentItem.user.uid}}"
                >{{childCommentItem.user.nickname}}</router-link>
                <template v-if="childCommentItem.reply_user">
                  <i class="middle-text">回复</i>
                  <router-link
                    class="user-info"
                    :to="{name:'user',params:{uid:childCommentItem.reply_user.uid}}"
                  >{{childCommentItem.reply_user.nickname}}</router-link>
                </template>
              </h4>
              <div
                class="comment-text"
                v-if="Number(childCommentItem.status)===2||Number(childCommentItem.status)===5"
                v-html="commentRender(childCommentItem.content)"
              ></div>
              <div
                class="comment-text"
                v-else-if="Number(childCommentItem.status)===1"
                style="color:#f96b84;"
              >当前用户评论需要管理员审核才能可见</div>
              <div
                class="comment-text"
                v-else-if="Number(childCommentItem.status)===3"
                style="color:#f96b84;"
              >当前用户评论违规</div>
            </div>
            <div class="comment-foot clearfix">
              <span>{{childCommentItem.create_at}}</span>
              <span
                class="comment-reply"
                v-if="Number(childCommentItem.status)===2||Number(childCommentItem.status)===5"
                @click="reply_btn(childCommentItem.uid)"
              >回复</span>
              <span
                class="comment-delete"
                v-if="personal_info.user.uid===childCommentItem.uid"
                @click="delete_comment(childCommentItem.id)"
              >删除</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="comment-form-view"
        v-if="children_comment_input"
        :id="'comment-reply'+commentItem.id"
      >
        <CommentForm
          :reply_uid="reply_uid"
          :child_comment_id="commentItem.id"
          @commentChange="commentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentForm from "./CommentForm";
import faceqq from "./face/qq";

export default {
  name: "index",
  props: ["commentItem"],
  data: function() {
    return {
      children_comment_input: false,
      parent_id: "",
      reply_uid: ""
    };
  },
  created() {
    this.parent_id = this.commentItem.id;
  },
  methods: {
    reply_btn(val) {
      this.children_comment_input = true;
      this.reply_uid = val;
    },
    commentChange(res) {
      if (res.state === "success") {
        this.$message.success(res.message);
        this.$nextTick(function() {
          this.commentItem.children.push(res.data);
        });
      } else {
        this.$message.warning(res.message);
      }
      this.children_comment_input = false
    },
    delete_comment(id) {
      this.$store
        .dispatch("comment/ARTICLE_COMMENT_DELETE", {
          aid: this.article.aid,
          comment_id: id
        })
        .then(res=> {
          if (res.state === "success") {
            document.querySelector("#comment" + id + "").style.display = "none";
            this.$message.success(res.message);
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    commentRender(val) {
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
    article() {
      return this.$store.state.article.article || {};
    },
    personal_info() {
      // 登录后的个人信息
      return this.$store.state.personal_info || {};
    }
  },
  components: {
    CommentForm
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
    /deep/ .el-image {
      width: 40px;
      height: 40px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 80px;
      }
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
    overflow: hidden;
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
