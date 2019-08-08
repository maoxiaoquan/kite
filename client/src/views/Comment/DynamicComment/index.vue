<template>
  <div class="box-comment">
    <div class="box-comment-part"
         v-if="website.config.on_comment==='yes'">
      <comment-form @commentChange="commentChange" />
      <div class="comment-list"
           v-loading="isLoadingComment">
        <comment-item :comment-item="item"
                      v-for="(item,key) in articleComment.comment_list"
                      :key="key" />
      </div>
    </div>
    <div v-else>
      <p class="no-comment">评论模块已关闭</p>
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
      comment_page: 1,
      comment_pageSize: 10,
      comment_count: 0,
      comment_list: [], // 用户评论的列表
      comment_content: "", // 顶级输入框
      comment_loading_btn: true,
      isLoadingComment: false
    };
  },
  created () {
    this.getCommentList(); // 获取用户的评论
  },
  methods: {
    getCommentList () {
      // 获取评论列表
      this.isLoadingComment = true;
      var that = this;
      this.$store
        .dispatch("articleComment/ARTICLE_COMMENT_LIST", {
          aid: 10007,
          page: this.comment_page,
          pageSize: this.comment_pageSize
        })
        .then(result => {
          this.isLoadingComment = false;
        })
        .catch(err => {
          this.isLoadingComment = false;
        });
    },
    pageChange (val) {
      this.isLoadingComment = true;
      this.$store
        .dispatch("articleComment/ARTICLE_COMMENT_LIST", {
          aid: this.article.aid,
          page: val,
          pageSize: this.comment_pageSize
        })
        .then(result => {
          this.isLoadingComment = false;
        })
        .catch(err => {
          this.isLoadingComment = false;
        });
    },
    commentChange (res) {
      if (res.state === "success") {
        this.$message.success(res.message);
        this.comment_content = ""; // 评论输入框为空
        this.$store.commit("articleComment/SET_ARTICLE_COMMENT_UNSHIFT", res.data);
        this.$store.commit("articleComment/SET_ARTICLE_COMMENT_COUNT_ADD");
      } else {
        this.$message.warning(res.message);
      }
    }
  },
  computed: {
    ...mapState(["website"]),
    personalInfo () {
      // 登录后的个人信息
      return this.$store.state.personalInfo || {};
    },
    article () {
      return this.$store.state.article.article || {};
    },
    pagination () {
      // 分页
      return Math.ceil(
        this.articleComment.count / this.articleComment.pageSize
      );
    },
    articleComment () {
      // 文章的评论
      return this.$store.state.articleComment.article_comment || {};
    }
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

.box-comment {
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
}

/*comment-lay end*/
</style>
