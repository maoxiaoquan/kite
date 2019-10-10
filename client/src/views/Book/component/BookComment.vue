<template>
  <div class="book-comment">
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
</style>
