<template>
  <div class="dynamic-comment"
       v-loading="isLoading">
    <div class="dynamic-comment-part"
         v-if="website.config.on_comment==='yes'">
      <comment-form :dynamicId="dynamicId"
                    @commentChange="commentChange" />
      <div class="comment-list">
        <comment-item :comment-item="item"
                      :dynamicId="dynamicId"
                      v-for="(item,key) in commentList"
                      :comentKey="key"
                      @deleteComment="deleteComment"
                      v-if="key<6"
                      :key="key" />
      </div>
    </div>
    <div v-else>
      <p class="no-comment">评论模块已关闭</p>
    </div>
    <div class="more"
         v-show="commentList.length>=6">
      <router-link class="dynamic"
                   :to='{name:"dynamicView",params:{dynamicId}}'>
        查看更多 >
      </router-link>
    </div>
  </div>
</template>

<script>
import commentItem from "./CommentItem";
import { Page } from "@components";
import commentForm from "./CommentForm";
import { mapState } from "vuex";
export default {
  name: "index",
  data () {
    return {
      isLoading: true,
      commentList: [], // 用户评论的列表
      page: 1,
      pageSize: 6
    };
  },
  props: {
    dynamicId: { // 当前动态的ID
      default: ""
    }
  },
  created () {
    this.getCommentList(); // 获取用户的评论
  },
  methods: {
    getCommentList () {
      // 获取评论列表
      this.isLoading = true
      this.$store
        .dispatch("dynamicComment/DYNAMIC_COMMENT_LIST", {
          dynamic_id: this.dynamicId,
          page: this.page,
          childPageSize: 5,
          pageSize: this.pageSize
        })
        .then(result => {
          this.commentList = result.data.list
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
    },
    deleteComment (key) {
      this.commentList.splice(key, 1)
    },
    commentChange (result) {
      if (result.state === "success") {
        this.commentList.unshift(result.data)
        this.$emit('dynamicCommentChange')
        this.$message.success(result.message);
      } else {
        this.$message.warning(result.message);
      }
    }
  },
  computed: {
    ...mapState(["website", "personalInfo"])
  },
  components: {
    "comment-item": commentItem,
    'comment-form': commentForm,
    Page
  }
};
</script>

<style scoped lang="scss">
/*comment-lay start*/

.dynamic-comment {
  .no-comment {
    text-align: center;
    padding: 15px;
    font-size: 14px;
    color: #666;
  }
  .comment-list {
    list-style: none;
    padding-left: 45px;
    /deep/.comment-item {
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .more {
    margin-top: 10px;
    a {
      display: block;
      background: rgb(233, 86, 62);
      // box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 8px 0px;
      border-radius: 5px;
      text-align: center;
      padding: 5px 20px;
      font-size: 12px;
      color: #fff;
    }
  }
}

/*comment-lay end*/
</style>
