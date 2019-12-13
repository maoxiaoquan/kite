<template>
  <div class="user-center-message-item attention"
       ref="user_message_list">
    <div class="title">{{MessageItem.actionText}} {{MessageItem.create_dt}}</div>

    <div class="main clearfix">
      <router-link class="user-info"
                   :to="{name:'user',params:{uid:MessageItem.sender.uid,routeType:'article'}}">
        <img class="avatar"
             v-lazy="MessageItem.sender.avatar"
             alt />
        <span class="nickname">{{MessageItem.sender.nickname}}</span>
      </router-link>
      <div class="content">关注了你</div>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

  </div>
</template>

<script>

import {
  userMessageAction,
  userMessageActionText
} from '@utils/constant'

export default {
  name: "UserMessageItem",
  props: {
    MessageItem: {
      type: Object
    }
  },
  data () {
    return {
      typeList: ["", "系统消息", "喜欢文章", "关注标签", "用户关注", "评论", "动态评论"]
    };
  },
  methods: {
    deleteUserMessage (id) {
      this.$confirm("此操作将永久该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("user/DELETE_USER_MESSAGE", {
              user_message_id: id
            })
            .then(result => {
              if (result.state === "success") {
                this.$message.success(result.message);
                this.$emit("delete-change");
              } else {
                this.$message.warning(result.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => { });
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
  }
};
</script>

<style scoped lang="scss">
.user-center-message-item {
  position: relative;
  .title {
    font-size: 14px;
    color: #999;
  }
  &.attention {
    .user-info {
      display: inline-block;
      margin-right: 10px;
      .avatar {
        display: inline-block;
        width: 38px;
        height: 38px;
        border-radius: 100px;
      }
      .nickname {
        font-size: 14px;
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
  .content {
    margin-top: 7px;
    display: inline-block;
    font-size: 14px;
    p {
      display: inline-block;
      font-size: 14px;
    }
  }
  .delete-message {
    opacity: 0;
    position: absolute;
    top: 20px;
    right: 10px;
    width: 80px;
    height: 25px;
    line-height: 23px;
    text-align: center;
    border-radius: 15px;
    border: 1px solid #ffc107;
    transition: 0.3s all;
    font-size: 14px;
    color: #ffc107;
    cursor: pointer;
  }
  &:hover {
    .delete-message {
      opacity: 1;
    }
  }
}
</style>
