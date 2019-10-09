<template>
  <div class="book-info">
    {{$route.params.books_id}}
    {{$route.params.book_id}}
    <div @click="openChapter(1111,222)"> 111</div>
    <div @click="openChapter(3333,4444)"> 222</div>
  </div>
</template>

<script>
export default {
  name: "BookInfo",
  data () {
    return {

    };
  },
  methods: {
    openChapter (books_id, book_id) {
      this.$router.push({ name: 'BookView', params: { books_id: books_id, book_id: book_id } })
    },
  },
  components: {

  }
};
</script>

<style scoped lang="scss">
</style>
