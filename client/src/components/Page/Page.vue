<template>
  <div class="page-bar">
    <template v-if="numPage>0">
      <ul>
        <li v-if="_page>1"><a href="javascript:;"
             @click="_page--;pageClick()"> <i class="el-icon-arrow-left"></i></a></li>
        <li v-if="_page==1"><a class="banclick"><i class="el-icon-arrow-left"></i></a></li>
        <li v-for="index in indexs"
            :key="index"
            v-bind:class="{ 'active': currentPage === Number(index)}">
          <a @click="btnClick(index)">{{ index }}</a>
        </li>
        <li v-if="_page!=numPage"><a href="javascript:;"
             @click="_page++;pageClick()"><i class="el-icon-arrow-right"></i></a></li>
        <li v-if="_page == numPage"><a class="banclick"><i class="el-icon-arrow-right"></i></a></li>
        <li><a>共<i>{{numPage}}</i>页</a></li>
      </ul>
    </template>

    <div class="page-null"
         v-else>
      <i class="icon-font el-icon-document"></i>
      <span class="info">暂无数据</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    },
  },
  name: 'Page',
  data () {
    return {
      _page: 1//当前页码
    }
  },
  created () {
    this._page = this.page
  },
  watch: {
    page: {
      immediate: true,
      handler (oldValue, newValue) {
        this._page = oldValue
      }
    }
  },
  methods: {
    btnClick (data) {//页码点击事件
      if (data != this._page) {
        this._page = data
      }
      this.$emit('pageChange', this._page || 1)
    },
    pageClick () {
      this.$emit('pageChange', this._page || 1)
    }
  },

  computed: {
    currentPage () {
      return this.page
    },
    numPage () {
      return Math.ceil(this.total / this.pageSize)
    },
    indexs () {
      var left = 1
      var right = this.numPage
      var ar = []
      if (this.numPage >= 5) {
        if (this._page > 3 && this._page < this.numPage - 2) {
          left = this._page - 2
          right = this._page + 2
        } else {
          if (this._page <= 3) {
            left = 1
            right = 5
          } else {
            right = this.numPage
            left = this.numPage - 4
          }
        }
      }
      while (left <= right) {
        ar.push(left)
        left++
      }
      return ar
    }

  }
}
</script>

<style scoped lang="scss">
.page-bar {
  margin: 40px 0;
  text-align: center;
}

ul,
li {
  margin: 0px;
  padding: 0px;
}

li {
  list-style: none;
  display: inline-block;
  margin: 0 3px;
}

.page-null {
  text-align: center;
  font-size: 14px;
  color: #666;
  .icon-font {
    display: block;
    font-size: 35px;
    color: #999;
  }
  .info {
    font-size: 12px;
    display: block;
    color: #999;
    padding: 10px 0;
  }
}

.page-bar li:first-child > a {
  margin-left: 0px;
}

.page-bar a {
  text-decoration: none;
  position: relative;
  /* float: left; */
  border: 1px solid #e0e0e0;
  padding: 6px 10px;
  font-size: 15px;
  border-radius: 20px;
  margin-left: -1px;
  color: #999;
  cursor: pointer;
}

.page-bar a:hover {
  color: #333;
}

.page-bar a.banclick {
  cursor: not-allowed;
}

.page-bar .active a {
  color: #00d0b2;
  cursor: default;
  border: 1px solid #00d0b2;
}

.page-bar i {
  font-style: normal;
  color: #666;
  margin: 0px 4px;
  font-size: 12px;
}
</style>
