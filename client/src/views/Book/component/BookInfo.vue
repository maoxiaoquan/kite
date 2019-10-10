<template>
  <div class="book-info">
    <div class="article-content box-article-view"
         v-html="books.booksInfo.content">

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "BookInfo",
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

  }
};
</script>

<style scoped lang="scss">
</style>
