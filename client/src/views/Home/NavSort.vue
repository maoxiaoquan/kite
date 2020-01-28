<template>
  <nav class="list-nav">
    <ul class="nav-list left">
      <li class="nav-item"
          v-for="(item,key) in navList"
          :key="key"
          @click="_navTap(item.name)"
          :class="{'active':current_nav===item.name}">
        <a href="javascript:;">{{item.text}}</a>
      </li>
    </ul>

    <!-- <div class="right">
      <router-link class="menu"
                   :to="{name:'home'}">
        <i class="el-icon-s-home"></i>
      </router-link>
      <span class="menu">
        <Popover :visible.sync="faceVisible">
          <div class="nav-items">
            <span v-for="columnItem in articleColumn.homeColumn"
                  :key="columnItem.column_id"
                  :class="{'active':articleColumn.currColumnEnName===columnItem.en_name}"
                  @click="switchNav({name:'column',params:{en_name:columnItem.en_name}})">
              {{columnItem.name}}
            </span>
            <router-link :to="{name:'columnAll'}">
              更多...
            </router-link>
          </div>

          <i slot="button"
             class="el-icon-menu"></i>
        </Popover>
      </span>
    </div> -->

  </nav>
</template>

<script>

import { Popover } from "@components";
import { mapState } from 'vuex'
export default {
  name: "NavSort",
  data () {
    return {
      faceVisible: false,
      navList: [
        {
          name: "newest",
          text: "最新"
        },
        {
          name: "hottest",
          text: "全部热门"
        },
        {
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
    switchNav (val) {
      this.faceVisible = false
      if (this.articleColumn.currColumnEnName !== val.params.en_name) {
        this.$router.push(val)
      }
    },
    _navTap (val) {
      this.$emit("navTap", val);
      this.current_nav = val;
    }
  },
  computed: {
    ...mapState(['articleColumn'])
  },
  components: {
    Popover
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
    padding: 25px 0;
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
    display: flex;
    align-items: center;
    .menu {
      width: 50px;
      display: inline-block;
      text-align: center;
      line-height: 50px;
      height: 50px;
      cursor: pointer;
      i {
        font-size: 18px;
        color: #666;
      }
      /deep/.pop-view {
        right: 0;
        width: 500px;
      }
    }
  }
}

.nav-items {
  a,
  span {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 3px;
    background: #f1f1f1;
    margin-bottom: 10px;
    &.active {
      font-weight: 500;
      color: #f46e65;
      background-color: #f46e653b;
    }
  }
}
</style>
