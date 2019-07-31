<template>
  <div class="user-article-blog-item"
       :class="{'active':!isEdit}"
       v-if="isShow">
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
      isEdit: false,
      isShow: true
    }
  },
  created () {
    this.blogName = this.item.name
    this.blogDescription = this.item.description
  },
  methods: {
    cancelSave () {
      this.blogName = this.item.name
      this.blogDescription = this.item.description
      this.isEdit = false
    },
    saveEdit () {
      this.$store.dispatch('user/UPDATE_ARTICLE_BLOG', {
        name: this.blogName,
        description: this.blogDescription,
        blog_id: this.item.blog_id,
      })
        .then(result => {
          if (result.state === 'success') {
            this.isEdit = false
            this.$message.success(result.message);
            this.$emit('update-list')
          } else {
            this.$message.warning(result.message);
          }
        })
    },
    deleteBlog () {
      this.$store.dispatch('user/DELETE_ARTICLE_BLOG', {
        blog_id: this.item.blog_id,
      })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message);
            this.isShow = false
          } else {
            this.$message.warning(result.message);
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
