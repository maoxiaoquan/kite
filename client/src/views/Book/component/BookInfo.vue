<template>
  <div class="book-info">
    <div class="book-content-head">小书介绍</div>
    <div class="article-content box-article-view"
         v-html="books.booksInfo.content">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "BookInfo",
  computed: {
    ...mapState(['books', 'personalInfo'])
  }
};
</script>

<style scoped lang="scss">
.book-info {
  .book-content-head {
    position: relative;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.5;
    padding-bottom: 12px;
    font-size: 20px;
    border-bottom: 1px solid #ececec;
  }
}
</style>
