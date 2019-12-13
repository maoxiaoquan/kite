<template>
  <div class="comment-item"
       :id="'comment'+commentItem.id"
       ref="comment_list">
    <div class="avatar">
      <img v-lazy="commentItem.user.avatar"
           class="box-image"
           alt="">
    </div>
    <div class="comment-body">

      <div class="comment-main">
        <h4>
          <router-link class="user-info"
                       :to="{name:'user',params:{uid:commentItem.user.uid,routeType:'article'}}">{{commentItem.user.nickname}}</router-link>
        </h4>
        <div class="comment-text"
             v-if="Number(commentItem.status)===statusList.reviewSuccess||Number(commentItem.status)===statusList.freeReview"
             v-html="commentRender(commentItem.content)"></div>
        <div class="comment-text"
             v-else-if="Number(commentItem.status)===statusList.pendingReview"
             style="color:#f96b84;">当前用户评论需要管理员审核才能可见</div>
        <div class="comment-text"
             v-else-if="Number(commentItem.status)===statusList.reviewFail"
             style="color:#f96b84;">当前用户评论违规</div>
      </div>

      <div class="comment-foot clearfix">
        <span>{{commentItem.create_dt}}</span>
        <span class="comment-reply"
              v-show="personalInfo.islogin"
              v-if="Number(commentItem.status)===statusList.reviewSuccess||Number(commentItem.status)===statusList.freeReview"
              @click="isComment=!isComment">{{isComment?'取消回复':'回复'}}</span>
        <span class="comment-delete"
              v-if="personalInfo.user.uid===commentItem.uid"
              @click="deleteComment(commentItem.id)">删除</span>
      </div>

      <div class="comment-form-view"
           v-if="isComment"
           :id="'comment-reply'+commentItem.id">
        <comment-form :reply_uid="commentItem.uid"
                      :dynamicId="dynamicId"
                      :parent_id="commentItem.id"
                      :reply_id="commentItem.id"
                      @commentChange="commentChange" />
      </div>
    </div>
    <div class="comment-item-children"
         v-if="commentItem.children.length>0||isComment">
      <comment-child-item v-for="(childCommentItem,key) in commentItem.children"
                          :key="key"
                          :comentKey="key"
                          @deleteChildComment="deleteChildComment"
                          :p_id="commentItem.id"
                          :dynamicId="dynamicId"
                          :childCommentItem="childCommentItem"
                          @ChildCommentChange="commentChange" />
      <span v-if="commentItem.children.length>=5&&isChildMore"
            class="more"
            @click="getCommentList">查看更多</span>
    </div>
  </div>
</template>

<script>

import commentForm from "./CommentForm";
import { faceQQ } from '@components'
import commentChildItem from "./CommentChildItem";
import {
  statusList,
  statusListText
} from '@utils/constant'

export default {
  name: "index",
  props: ["commentItem", "dynamicId", "comentKey"],
  data: function () {
    return {
      isComment: false,
      childPage: 2,
      isChildMore: true,
      statusList,
      statusListText
    };
  },
  methods: {
    commentChange (res) {
      if (res.state === "success") {
        this.$message.success(res.message);
        this.$nextTick(function () {
          this.commentItem.children.push(res.data);
        });
      } else {
        this.$message.warning(res.message);
      }
      this.isComment = false;
    },
    getCommentList () {
      // 获取评论列表
      this.$store
        .dispatch("dynamicComment/DYNAMIC_COMMENT_ALL", {
          dynamic_id: this.dynamicId,
          parent_id: this.commentItem.id
        })
        .then(result => {
          this.commentItem.children = result.data.list;
          this.isChildMore = false
        })
    },
    deleteChildComment (key) {
      this.commentItem.children.splice(key, 1)
    },
    deleteComment (id) {
      this.$store
        .dispatch("dynamicComment/DYNAMIC_COMMENT_DELETE", {
          comment_id: id
        })
        .then(res => {
          if (res.state === "success") {
            this.$emit('deleteComment', this.comentKey)
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
    'comment-form': commentForm,
    'comment-child-item': commentChildItem
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
    .box-image {
      width: 32px;
      height: 32px;
      overflow: hidden;
      border-radius: 80px;
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
  .comment-item-children {
    margin-top: 10px;
    padding-left: 50px;
    /deep/.comment-item {
      &:last-child {
        border-bottom: none;
      }
    }
    .more {
      background: #f46e65;
      padding: 5px 15px;
      font-size: 12px;
      color: #ffffff;
      display: block;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
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
