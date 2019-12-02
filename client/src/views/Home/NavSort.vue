<template>
  <nav class="list-nav">
    <ul class="nav-list left">
      <li class="nav-item"
          v-for="(item,key) in navList"
          :key="key"
          @click="_navTap(item.name)"
          v-if="item.type==='left'"
          :class="{'active':current_nav===item.name}">
        <a href="javascript:;">{{item.text}}</a>
      </li>
    </ul>
    <ul class="nav-list right">
      <li class="nav-item"
          v-for="(item,key) in navList"
          @click="_navTap(item.name)"
          :key="key"
          v-if="item.type==='right'"
          :class="{'active':current_nav===item.name}">
        <a href="javascript:;">{{item.text}}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NavSort",
  data () {
    return {
      navList: [
        {
          type: "left",
          name: "newest",
          text: "最新"
        },
        {
          type: "left",
          name: "hottest",
          text: "全部热门"
        },
        {
          type: "left",
          name: "monthlyHottest",
          text: "本月最热"
        }
      ],
      current_nav: "newest"
    };
  },
  methods: {
    dafauleNav () {
      this.current_nav = "newest";
    },
    _navTap (val) {
      this.$emit("navTap", val);
      this.current_nav = val;
    }
  }
};
</script>

<style scoped lang="scss">
.list-nav {
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  .nav-list {
    align-items: center;
    line-height: 1;
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .active {
      a {
        color: #ea6f5a;
      }
    }
  }
  .left {
    .nav-item {
      padding: 0 15px;
      font-size: 14px;
      border-right: 1px solid hsla(0, 0%, 59.2%, 0.2);
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border-right: none;
      }
    }
  }
  .right {
    .nav-item {
      font-size: 14px;
      padding: 0 10px;
      position: relative;
    }
    .nav-item:not(:last-child):after {
      width: 2px;
      height: 2px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      content: "";
      position: absolute;
      left: 100%;
      top: 50%;
      background-color: #2b445d;
      transform: translateY(-50%);
      opacity: 0.5;
    }
  }
}
</style>
