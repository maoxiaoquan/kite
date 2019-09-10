<template>
  <div class="article-blog-menu">
    <nav class="column-menu">
      <ul class="nav-item-view">
        <li class="nav-item"
            :class="{'active':currColumnEnName===''}">
          <router-link :to="{name:'articleBlogs',params:{columnEnName:'all'}}">热门</router-link>
        </li>
        <li class="nav-item"
            v-for="column_item in navItem"
            :key="column_item.article_column_id">
          <router-link :to="{name:'articleBlogs',params:{columnEnName:column_item.article_column_en_name}}">
            {{column_item.article_column_name}}
          </router-link>
        </li>
        <li class="nav-item more">
          <router-link :to="{name:'columnAll'}"> 更多...</router-link>
        </li>
      </ul>
    </nav>
    <nav class="column-tag-menu"
         v-if="childNavItem.tag&&childNavItem.tag.length>0">
      <ul>
        <li v-for="(item,key) in childNavItem"
            @click="switchChildremTag(item)"
            :key="key">{{item.article_tag_name}}</li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
    navItem: Array
  },
  data () {
    return {
      childNavItem: []
    }
  },
  created () {
    this.initColumn()
  },
  methods: {
    initColumn () {
      if (this.$route.params.columnEnName) {
        this.switchColumn(this.$route.params.columnEnName)
      }
    },
    switchColumn (val) {
      this.childNavItem.map(item => {
        if (item.article_column_en_name === val) {
          this.childNavItem = item || []
          this.$emit('changColumn', item.article_tag_ids.split(','))
        }
      })
    },
    switchChildremTag (val) {
      this.$emit('changColumn', [val.article_tag_id])
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
.article-blog-menu {
  .column-menu {
    padding-bottom: 10px;
    li {
      display: inline-block;
      font-size: 14px;
      margin-right: 20px;
    }
  }
  .column-tag-menu {
    padding-top: 10px;
    border-top: 1px solid rgba(178, 186, 194, 0.15);
    li {
      display: inline-block;
      font-size: 13px;
      background: #fd763a;
    }
  }
}
</style>
