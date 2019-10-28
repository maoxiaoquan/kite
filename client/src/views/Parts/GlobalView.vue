<template>
  <div id="global-view">
    <div class="cancel-top"
         @click="cancalTop"><i class="el-icon-top"></i></div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  name: 'GlobalAlert',
  methods: {
    cancalTop () {
      var screenw = document.documentElement.clientWidth || document.body.clientWidth;
      var screenh = document.documentElement.clientHeight || document.body.clientHeight;
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    }
  },
  computed: {
    ...mapState(['website']),  // home:主页  article_column:文章的专栏
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
#global-view {
  .cancel-top {
    position: fixed;
    bottom: 80px;
    right: 50px;
    margin: 1rem 0 0;
    padding: 0;
    width: 35px;
    height: 35px;
    line-height: 1;
    color: #909090;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    text-align: center;
    line-height: 35px;
    i {
      font-size: 16px;
    }
  }
}
</style>
