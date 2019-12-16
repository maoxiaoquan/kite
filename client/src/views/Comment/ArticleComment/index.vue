<template>
  <div class="box-comment"
       v-loading="isLoading">
    <div class="box-comment-part"
         v-if="website.config.on_comment === 'yes'">
      <div class="box-comment-part-title">
        <span>发表评论</span>
        <small>
          已发布评论
          <em>{{ articleComment.count }}</em> 条
        </small>
        <router-link class="comment-rule"
                     :to="{ name: 'comment_rule' }">《点我查看评论规范》</router-link>
      </div>
      <comment-form @commentChange="commentChange" />
      <div class="comment-list">
        <div id="commentlist">
          <comment-item :comment-item="item"
                        :comentKey="key"
                        @deleteComment="deleteComment"
                        v-for="(item, key) in articleComment.list"
                        :key="key" />
        </div>

        <Page :total="Number(articleComment.count)"
              :page="Number(articleComment.page)"
              :pageSize="articleComment.pageSize"
              @pageChange="pageChange"></Page>
      </div>
    </div>
    <div v-else>
      <p class="no-comment">评论模块已关闭</p>
    </div>
  </div>
</template>

<script>
import commentItem from './CommentItem'
import { Page } from '@components'
import commentForm from './CommentForm'
import { mapState } from 'vuex'
export default {
  name: 'index',
  created () {
    this.getCommentList() // 获取用户的评论
  },
  data () {
    return {
      isLoading: true,
      articleComment: {
        list: [],
        count: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    $route (to, from) {
      this.getCommentList()
    }
  },
  methods: {
    getCommentList () {
      // 获取评论列表
      this.isLoading = true
      this.$store
        .dispatch('articleComment/ARTICLE_COMMENT_LIST', {
          aid: this.article.aid,
          page: this.comment_page,
          pageSize: this.comment_pageSize
        })
        .then(result => {
          this.articleComment = result.data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    pageChange (val) {
      this.articleComment.page = val
      this.getCommentList()
    },
    deleteComment (key) {
      this.articleComment.list.splice(key, 1)
    },
    commentChange (res) {
      if (res.state === 'success') {
        this.$message.success(res.message)
        this.articleComment.list.unshift(res.data)
        this.articleComment.count += 1
      } else {
        this.$message.warning(res.message)
      }
    }
  },
  computed: {
    ...mapState(['website', 'personalInfo']),
    article () {
      return this.$store.state.article.article || {}
    }
  },
  components: {
    'comment-item': commentItem,
    'comment-form': commentForm,
    Page
  }
}
</script>

<style scoped lang="scss">
/*comment-lay start*/

.box-comment {
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
      .comment-rule {
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
