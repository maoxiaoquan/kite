<template>
  <div class="tag">
    <div class="info-box">

      <router-link :to='{name:"article_tag",params:{article_tag_en_name:articleTagItem.article_tag_en_name}}'>
        <div class="thumb">
          <el-image :src="articleTagItem.article_tag_icon"
                    lazy></el-image>
        </div>
        <div class="title"
             v-text="articleTagItem.article_tag_name"></div>
      </router-link>
      <div class="meta-box">
        <div class="meta article">
          {{article_count}} 篇文章
        </div>
        <div class="meta subscribe">
          {{subscribe_count}} 人关注
        </div>
      </div>
    </div>

    <div class="action-box"
         v-if="islogin">

      <button @click="subscribe_tag"
              v-if="~user_article_tag.indexOf(articleTagItem.article_tag_id)"
              class="subscribe-btn already-subscribe">已关注
      </button>
      <button @click="subscribe_tag"
              v-else
              class="subscribe-btn not-subscribe">关注
      </button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleTagItem',
  created () {
    this.article_count = this.articleTagItem.article_count // 替换为组件内的 data
    this.subscribe_count = this.articleTagItem.subscribe_count
  },
  data () {
    return {
      article_count: 0,
      subscribe_count: 0,
    }
  },
  props: {
    articleTagItem: {
      type: Object
    },
  },
  methods: {
    async subscribe_tag () { // 订阅标签
      await this.$store.dispatch('articleTag/SUBSCRIBE_TAG', { article_tag_id: this.articleTagItem.article_tag_id })
        .then(res => {
          this.$store.dispatch('articleTag/MY_SUBSCRIBE_TAG_LIST')
          if (res.state === 'success') {
            if (res.data.type === 'attention') {
              this.subscribe_count += 1
            } else {
              this.subscribe_count -= 1
            }
            this.$message.success(res.message);
          }
        })
    }
  },
  computed: {
    user_article_tag () {
      return this.$store.getters['articleTag/user_article_tag'] || []
    },
    islogin () {
      return this.$store.state.personalInfo.islogin
    }
  }
}
</script>

<style scoped lang="scss">
.tag {
  width: 100%;
  transition: border-color 0.3s;
  text-align: center;
  padding: 15px 0 20px;
  border: 1px solid hsla(0, 0%, 59%, 0.2);
  border-radius: 10px;
  .thumb {
    width: 75px;
    height: 75px;
    margin: 10px auto 15px;
    border-radius: 20px;
    /deep/ .el-image {
      width: 75px;
      height: 75px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 20px;
      }
    }
  }
  .title {
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: #333;
  }
  .meta-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 0.8rem;
    color: #909090;
    .meta {
      display: inline-block;
      margin: 10px 5px 0;
    }
  }
  .subscribe-btn {
    margin: 1rem auto 0;
    border-radius: 20px;
    font-size: 0.8rem;
    background-color: #fff;
    padding: 0.4rem 1rem;
    outline: none;
    transition: background-color 0.3s, color 0.3s;
    cursor: pointer;
    &.not-subscribe {
      border: 1px solid #37c700;
      color: #37c700;
    }
    &.already-subscribe {
      border: 1px solid #cccccc;
      color: #999999;
    }
  }
}
</style>
