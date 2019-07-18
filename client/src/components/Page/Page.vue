<template>
    <div class="page-bar">
        <template v-if="count>0">
            <ul>
                <li v-if="cur>1"><a href="javascript:;" @click="cur--;pageClick()"> <i
                        class="iconfont icon-back"></i></a></li>
                <li v-if="cur==1"><a class="banclick"><i class="iconfont icon-back"></i></a></li>
                <li v-for="index in indexs" v-bind:class="{ 'active': cur == index}">
                    <a @click="btnClick(index)">{{ index }}</a>
                </li>
                <li v-if="cur!=count"><a href="javascript:;" @click="cur++;pageClick()"><i
                        class="iconfont icon-more"></i></a></li>
                <li v-if="cur == count"><a class="banclick"><i class="iconfont icon-more"></i></a></li>
                <li><a>共<i>{{count}}</i>页</a></li>
            </ul>
        </template>
        <div class="page-null" v-else>
            暂无数据
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      count: {
        type: Number,
        default: 0
      },
      page: {
        type: Number,
        default: 1
      },
    },
    name: 'Page',
    data () {
      return {
        cur: 1//当前页码
      }
    },
    created () {
      this.cur = this.page
    },
    watch: {
      cur (oldValue, newValue) {
        console.log(arguments)
      }
    },
    methods: {
      btnClick (data) {//页码点击事件
        if (data != this.cur) {
          this.cur = data
        }
        this.$emit('pageChange', this.cur || 1)
      },
      pageClick () {
        this.$emit('pageChange', this.cur || 1)
      }
    },

    computed: {
      indexs () {
        var left = 1
        var right = this.count
        var ar = []
        if (this.count >= 5) {
          if (this.cur > 3 && this.cur < this.count - 2) {
            left = this.cur - 2
            right = this.cur + 2
          } else {
            if (this.cur <= 3) {
              left = 1
              right = 5
            } else {
              right = this.count
              left = this.count - 4
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

    ul, li {
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
    }

    .page-bar li:first-child > a {
        margin-left: 0px
    }

    .page-bar a {
        text-decoration: none;
        position: relative;
        float: left;
        padding: 3px 10px;
        margin-left: -1px;
        color: #666;
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
    }

    .page-bar i {
        font-style: normal;
        color: #666;
        margin: 0px 4px;
        font-size: 12px;
    }
</style>
