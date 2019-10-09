<template>
  <div class="book-info">
    {{$route.params.books_id}}
    {{$route.params.book_id}}
    {{$route.query.type}}
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

  },
  components: {

  }
};
</script>

<style scoped lang="scss">
</style>
