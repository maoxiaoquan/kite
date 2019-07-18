<template>
  <div class="box-comment">
    <div class="box-comment-part" v-if="website.config.on_comment==='yes'">
      <div class="box-comment-part-title">
        <span>发表评论</span>
        <small>
          已发布评论
          <em>{{article_comment.count}}</em> 条
        </small>
        <router-link class="comment-rule" :to="{'name':'comment_rule'}">《点我查看评论规范》</router-link>
      </div>
      <CommentForm @commentChange="commentChange" />
      <div class="comment-list" v-loading="isLoadingComment">
        <div id="commentlist">
          <comment-list
            :comment-item="item"
            v-for="(item,key) in article_comment.comment_list"
            :key="key"
          />
        </div>

        <Page :count="pagination" @pageChange="pageChange"></Page>
      </div>
    </div>
    <div v-else>
      <p class="no-comment">评论模块已关闭</p>
    </div>
  </div>
</template>

<script>
import commentList from "./item";
import { Page } from "@components";
import CommentForm from "./CommentForm";
import { mapState } from "vuex";
export default {
  name: "index",
  data() {
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
  created() {
    this.get_comment_list(); // 获取用户的评论
  },
  methods: {
    get_comment_list() {
      // 获取评论列表
      this.isLoadingComment = true;
      var that = this;
      this.$store
        .dispatch("comment/ARTICLE_COMMENT_LIST", {
          aid: this.article.aid,
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
    pageChange(val) {
      this.isLoadingComment = true;
      this.$store
        .dispatch("comment/ARTICLE_COMMENT_LIST", {
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
    commentChange(res) {
      if (res.state === "success") {
        this.$message.success(res.message);
        this.comment_content = ""; // 评论输入框为空
        this.$store.commit("comment/SET_ARTICLE_COMMENT_UNSHIFT", res.data);
        this.$store.commit("comment/SET_ARTICLE_COMMENT_COUNT_ADD");
      } else {
        this.$message.warning(res.message);
      }
    }
  },
  computed: {
    ...mapState(["website"]),
    personal_info() {
      // 登录后的个人信息
      return this.$store.state.personal_info || {};
    },
    article() {
      return this.$store.state.article.article || {};
    },
    pagination() {
      // 分页
      return Math.ceil(
        this.article_comment.count / this.article_comment.pageSize
      );
    },
    article_comment() {
      // 文章的评论
      return this.$store.state.comment.article_comment || {};
    }
  },
  components: {
    "comment-list": commentList,
    CommentForm,
    Page
  }
};
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
        margin-right: 10px;
        em {
          font-style: normal;
          color: #ff5a00;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .comment-rule{
        font-size: 14px;
        display: inline-block;
        color: red;
      }
    }
  }
  .no-comment {
    text-align: center;
    padding: 15px;
    font-size: 14px;
    color: #666;
  }
  .comment-list {
    list-style: none;
    margin: 38px 0 25px 0;
    margin-bottom: 40px;
  }
}

/*comment-lay end*/
</style>
