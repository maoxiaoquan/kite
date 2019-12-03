<template>
  <nav class="nav-header recommend-collection">
    <ul class="nav-item-view">
      <li class="nav-item"
          :class="{'active':currColumnEnName===''}">
        <a href="javascript:;"
           class="collection-name"
           @click="switchNav({name:'home'})">
          推荐
        </a>
      </li>
      <li class="nav-item"
          v-for="column_item in navItem"
          :key="column_item.column_id"
          @click="switchNav({name:'column',params:{en_name:column_item.en_name}})"
          :class="{'active':currColumnEnName===column_item.en_name}">
        <span class="collection-name">{{column_item.name}}</span>
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
  &.recommend-collection {
    .nav-item-view {
      position: relative;
      .nav-item {
        display: inline-block;
        a,
        span {
          display: block;
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
        }
        &.active {
          a,
          span {
            background: #f46300;
            border-color: #f46300;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
