<template>
  <div class="book-comment">
    <div class="book-content-head">小书评价</div>
    <BooksComment />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BooksComment from "@views/Comment/BooksComment";
export default {
  name: "BookComment",
  data () {
    return {

    };
  },
  methods: {

  },
  computed: {
    ...mapState(['books', 'personalInfo'])
  },
  components: {
    BooksComment
  }
};
</script>

<style scoped lang="scss">
.book-comment {
  padding: 20px;
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
