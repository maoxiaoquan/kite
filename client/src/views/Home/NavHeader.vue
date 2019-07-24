<template>
  <nav class="nav-header recommend-collection">
    <ul class="nav-item-view">
      <li class="nav-item"
          :class="{'active':currColumnEnName===''}">
        <a href="javascript:;"
           class="collection-name"
           @click="switchNav({name:'home'})">
          热门
        </a>
      </li>
      <li class="nav-item"
          v-for="column_item in navItem"
          :key="column_item.article_column_id"
          @click="switchNav({name:'column',params:{article_column_en_name:column_item.article_column_en_name}})"
          :class="{'active':currColumnEnName===column_item.article_column_en_name}">
        <span class="collection-name">{{column_item.article_column_name}}</span>
      </li>
      <li class="nav-item more">
        <a href="javascript:;"
           class="collection-name"
           @click="switchNav({name:'columnAll'})">
          更多...
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
    navItem: Array
  },
  methods: {
    switchNav (val) {
      console.log('val', val)
      this.$router.push(val)
    }
  },
  computed: {
    currColumnEnName () {
      // 当前的专栏
      return this.$store.state.articleColumn.currColumnEnName
    }
  }
}
</script>

<style scoped lang="scss">
.nav-header {
  width: 100%;
  /*-webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);*/
  transition: all 0.2s;
  transform: translateZ(0);
  background-color: #fff;
  &.recommend-collection {
    .nav-item-view {
      position: relative;
      .nav-item {
        display: inline-block;
        border: 1px solid #e0e0e0;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        margin-right: 10px;
        margin-bottom: 10px;
        a,
        span {
          display: block;
          padding: 3px 15px;
        }
        &.active {
          border-color: #ea6f5a;
          color: #ea6f5a;
          a {
            color: #ea6f5a;
          }
        }
      }
    }
  }
}
</style>
