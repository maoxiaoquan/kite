<template>
  <section class="collect-lay layout-content">
    <div class="filter">
      <a class="filter-item"
         @click="type='BooksCollect'"
         :class="{'active':type==='BooksCollect'}"
         href="javascript:;">小书</a>
      <a class="filter-item"
         @click="type='ArticleLike'"
         :class="{'active':type==='ArticleLike'}"
         href="javascript:;">文章</a>
      <a class="filter-item"
         @click="type='ArticleBlogLike'"
         :class="{'active':type==='ArticleBlogLike'}"
         href="javascript:;">专栏</a>
    </div>
    <div class="content">
      <BooksCollect v-show="type==='BooksCollect'" />
      <ArticleLike v-show="type==='ArticleLike'" />
      <ArticleBlogLike v-show="type==='ArticleBlogLike'" />
    </div>
  </section>
</template>

<script>

import { mapState } from 'vuex'
import BooksCollect from './BooksCollect'
import ArticleLike from './ArticleLike'
import ArticleBlogLike from './ArticleBlogLike'
export default {
  name: 'Collect',
  metaInfo () {
    return {
      title: '收藏集',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data () {
    return {
      type: "BooksCollect"
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']),  // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    BooksCollect,
    ArticleLike,
    ArticleBlogLike
  }
}
</script>

<style scoped lang="scss">
.collect-lay {
  .filter {
    padding-top: 20px;
    .filter-item {
      display: inline-block;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.56);
      text-align: center;
      padding: 3px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 14px;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      &.active {
        background: #f46300;
        border-color: #f46300;
        color: #fff;
      }
    }
  }
  .content {
  }
}
</style>
