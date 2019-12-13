<template>
  <div class="tag client-card">
    <div class="info-box">

      <router-link :to='{name:"article_tag",params:{en_name:articleTagItem.en_name}}'>
        <div class="thumb">
          <img v-lazy="articleTagItem.icon"
               class="box-image"
               alt="">
        </div>
        <div class="title"
             v-text="articleTagItem.name"></div>
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
      <button @click="subscribeTag"
              v-if="~userArticleTag.indexOf(articleTagItem.id)"
              class="subscribe-btn already-subscribe">已关注
      </button>
      <button @click="subscribeTag"
              v-else
              class="subscribe-btn not-subscribe">关注
      </button>

    </div>
  </div>
</template>

<script>
import {
  modelType
} from '@utils/constant'

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
    async subscribeTag () { // 订阅标签
      await this.$store.dispatch('common/SET_ATTENTION', { associate_id: this.articleTagItem.id, type: modelType.article_tag })
        .then(res => {
          this.$store.dispatch('articleTag/MY_SUBSCRIBE_TAG_LIST')
          if (res.state === 'success') {
            if (res.data.type === 'enter') {
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
    userArticleTag () {
      return this.$store.getters['articleTag/userArticleTag'] || []
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
  border: 1px solid #f2f2f2;
  .thumb {
    width: 75px;
    height: 75px;
    margin: 10px auto 15px;
    border-radius: 20px;
    .box-image {
      width: 75px;
      height: 75px;
      border-radius: 4px;
      overflow: hidden;
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
