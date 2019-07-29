<template>
  <div class="user-article-blog-item"
       :class="{'active':!isEdit}">
    <div class="input-view">
      <input type="text"
             v-model="blogName">
    </div>
    <div class="input-view">
      <input type="text"
             v-model="blogDescription">
    </div>
    <div class="operate">
      <button type="button"
              v-show="!isEdit"
              @click="isEdit=true"
              class="btn btn-primary btn-sm">修改</button>
      <button type="button"
              v-show="isEdit"
              @click="saveEdit"
              class="btn btn-primary btn-sm">保存</button>
      <button type="button"
              v-show="isEdit"
              @click="cancelSave"
              class="btn btn-primary btn-sm">取消</button>
      <button type="button"
              @click="deleteBlog"
              class="btn btn-danger btn-sm">删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blogList',
  props: ['item'],
  data () {
    return {
      blogName: '',
      blogDescription: '',
      isEdit: false
    }
  },
  created () {
    this.blogName = this.item.blog_name
    this.blogDescription = this.item.blog_description
  },
  methods: {
    cancelSave () {
      this.blogName = this.item.blog_name
      this.blogDescription = this.item.blog_description
      this.isEdit = false
    },
    saveEdit () {
      var that = this
      this.$store.dispatch('user/UPDATE_ARTICLE_BLOG', {
        blog_name: that.blogName,
        blog_description: that.blogDescription,
        blog_id: that.item.blog_id,
      })
        .then(res => {
          if (res.state === 'success') {
            that.isEdit = false
            this.$message.success(res.message);
            that.$emit('update-list')
          } else {
            this.$message.warning(res.message);
          }
        })
    },
    deleteBlog () {
      var that = this
      this.$store.dispatch('user/DELETE_ARTICLE_BLOG', {
        blog_id: that.item.blog_id,
      })
        .then(res => {
          if (res.state === 'success') {
            this.$message.success(res.message);
            that.$emit('update-list')
          } else {
            this.$message.warning(res.message);
          }
        })
    },
    user_article_blog_all () { // 个人所有专栏
      return this.$store.state.user.user_article_blog || []
    },
  }
}
</script>

<style scoped lang="scss">
.user-article-blog-item {
  margin-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  display: flex;
  input {
    border: 1px solid #e0e0e0;
    padding: 5px;
    display: block;
  }
  .input-view,
  .operate {
    flex: 1;
  }
  .input-view {
    margin-right: 5px;
    font-size: 14px;
  }
  .operate {
    padding: 3px 0 0 3px;
  }
  &.active {
    input {
      border-color: #fff;
      pointer-events: none;
    }
  }
}
</style>
