<template>
  <nav class="nav-header recommend-collection">
    <div class="nav-items">
      <a class="nav-item"
         v-for="column_item in navItem"
         :key="column_item.column_id"
         @click="switchNav({name:'column',params:{en_name:column_item.en_name}})"
         :class="{'active':currColumnEnName===column_item.en_name}">
        {{column_item.name}}
      </a>
    </div>
    <div class="nav-more">
      <a href="javascript:;"
         class="nav-more-btn"
         @click="switchNav({name:'columnAll'})">
        更多...
      </a>
    </div>
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
  transition: all 0.2s;
  transform: translateZ(0);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 25px 20px 15px;
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  &.recommend-collection {
    .nav-items {
      flex: 1;
      .nav-item {
        height: 30px;
        box-sizing: border-box;
        padding: 0 20px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 30px;
        display: inline-block;
        color: #646464;
        background-color: #f6f6f6;
        margin: 0 4px 10px;
        &.active {
          font-weight: 500;
          color: #f46e65;
          background-color: #f46e653b;
        }
      }
    }
    .nav-more {
      width: 80px;
      .nav-more-btn {
        position: absolute;
        right: 25px;
        top: 27px;
        font-size: 13px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        background: none;
        border: 1px solid;
        border-radius: 3px;
        width: 56px;
        height: 28px;
        display: -webkit-box;
        display: flex;
        justify-content: center;
        border-radius: -1px;
        vertical-align: center;
        line-height: 28px;
        padding: 0;
        color: #8590a6;
        font-size: 14px;
      }
    }
  }
}
</style>
