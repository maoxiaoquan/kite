<template>
  <div class="user-center-message-item"
       ref="user_message_list">
    <div class="title">{{MessageItem.title}}</div>

    <div class="main clearfix"
         v-if="Number(MessageItem.type)===5">
      <router-link class="user-info"
                   :to="{name:'user',params:{uid:MessageItem.other_user.uid,routeType:'article'}}">
        <img class="avatar"
             v-lazy="MessageItem.other_user.avatar"
             alt />
        <span class="nickname">{{MessageItem.other_user.nickname}}</span>
      </router-link>
      <div class="content">
        <router-link style="color:#df5858"
                     :to="{name:'article',params:{aid:MessageItem.article.aid}}">{{MessageItem.article.title}}</router-link>
        中{{typeList[MessageItem.type]}}：
      </div>
      <div class="content-text">
        <template v-if="MessageItem.comment">
          <p v-html="commentRender(MessageItem.comment.content||'评论被用户删除')"
             v-if="Number(MessageItem.comment.status)===2||Number(MessageItem.comment.status)===5"></p>
          <p v-else-if="Number(MessageItem.comment.status)===1"
             style="color:#f96b84;">当前用户评论需要管理员审核才能可见</p>
          <p v-else-if="Number(MessageItem.comment.status)===4"
             style="color:#f96b84;">评论被删除</p>
          <p v-else-if="Number(MessageItem.comment.status)===3"
             style="color:#f96b84;">当前用户评论违规</p>
        </template>
        <template v-else>
          <p style="color:#f96b84;">评论被删除</p>
        </template>
      </div>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

    <div class="main clearfix"
         v-else-if="Number(MessageItem.type)===4">
      <router-link class="user-info"
                   :to="{name:'user',params:{uid:MessageItem.other_user.uid,routeType:'article'}}">
        <img class="avatar"
             v-lazy="MessageItem.other_user.avatar"
             alt />
        <span class="nickname">{{MessageItem.other_user.nickname}}</span>
      </router-link>
      <div class="content">{{typeList[MessageItem.type]}}</div>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

    <div class="main clearfix"
         v-else-if="Number(MessageItem.type)===2">
      <router-link class="user-info"
                   :to="{name:'user',params:{uid:MessageItem.other_user.uid,routeType:'article'}}">
        <img class="avatar"
             v-lazy="MessageItem.other_user.avatar"
             alt />
        <span class="nickname">{{MessageItem.other_user.nickname}}</span>
      </router-link>
      <div class="content">
        {{typeList[MessageItem.type]}}
        <router-link style="color:#df5858"
                     :to="{name:'article',params:{aid:MessageItem.article.aid}}">{{MessageItem.article.title}}</router-link>
      </div>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

    <div class="main clearfix"
         v-if="Number(MessageItem.type)===6">
      <template v-if="MessageItem.dynamic">
        <router-link class="user-info"
                     :to="{name:'user',params:{uid:MessageItem.other_user.uid,routeType:'article'}}">
          <img class="avatar"
               v-lazy="MessageItem.other_user.avatar"
               alt />
          <span class="nickname">{{MessageItem.other_user.nickname}}</span>
        </router-link>
        <div class="content">
          <router-link style="color:#df5858"
                       :to="{name:'dynamicView',params:{dynamicId:MessageItem.dynamic.id}}">{{MessageItem.dynamic.content}}</router-link>
          中{{typeList[MessageItem.type]}}：
        </div>
        <div class="content-text">
          <template v-if="MessageItem.comment">
            <p v-html="commentRender(MessageItem.comment.content||'评论被用户删除')"
               v-if="Number(MessageItem.comment.status)===2||Number(MessageItem.comment.status)===5"></p>
            <p v-else-if="Number(MessageItem.comment.status)===1"
               style="color:#f96b84;">当前用户评论需要管理员审核才能可见</p>
            <p v-else-if="Number(MessageItem.comment.status)===4"
               style="color:#f96b84;">评论被删除</p>
            <p v-else-if="Number(MessageItem.comment.status)===3"
               style="color:#f96b84;">当前用户评论违规</p>
          </template>
          <template v-else>
            <p style="color:#f96b84;">评论被删除</p>
          </template>
        </div>
      </template>
      <template v-else>
        <p class="no-info">当前动态不存在</p>
      </template>
      <span class="delete-message"
            @click="deleteUserMessage(MessageItem.id)">删除</span>
    </div>

  </div>
</template>

<script>
import { faceQQ } from '@components'
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
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  padding: 15px 0;
  position: relative;
  .title {
    font-size: 14px;
    color: #999;
  }
  .main {
    margin-top: 10px;
    .user-info {
      display: inline-block;
      margin-right: 20px;
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
    .content {
      margin-top: 7px;
      display: inline-block;
      font-size: 14px;
      p {
        display: inline-block;
        font-size: 14px;
      }
    }
    .content-text {
      display: block;
      padding: 8px 15px;
      margin-top: 15px;
      background: #f7f7f7;
      border-radius: 10px;
      font-size: 14px;
      color: #393939;
      p {
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
  }
  &:hover {
    .delete-message {
      opacity: 1;
    }
  }
  .no-info {
    font-size: 14px;
    color: #666;
  }
}
</style>
