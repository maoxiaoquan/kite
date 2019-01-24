<template>
    <div class="tag">
        <div class="info-box">

            <router-link :to='{name:"article_tag",params:{article_tag_id:articleTagItem.article_tag_id}}'>
                <div class="lazy thumb loaded"
                     v-if="articleTagItem.article_tag_icon_type==='1'"
                     :style="{'background-image':`url(${articleTagItem.article_tag_icon})`}">
                </div>
                <div class="tag-icon" v-else>
                    <i class="iconfont" :class="articleTagItem.article_tag_icon"></i>
                </div>
                <div class="title" v-text="articleTagItem.article_tag_name"></div>
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

        <div class="action-box" v-if="islogin">

            <button @click="subscribe_tag" v-if="~user_article_tag.indexOf(articleTagItem.article_tag_id)"
                    class="subscribe-btn already-subscribe">已关注
            </button>
            <button @click="subscribe_tag" v-else
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
        await this.$store.dispatch('article_tag/SUBSCRIBE_TAG', { article_tag_id: this.articleTagItem.article_tag_id })
          .then(res => {
            console.log('res', res)
            this.$store.dispatch('article_tag/MY_SUBSCRIBE_TAG_LIST')
            if (res.state === 'success') {
              if (res.data.type === 'attention') {
                this.subscribe_count += 1
              } else {
                this.subscribe_count -= 1
              }
              alert(res.message)
            }
          })
      }
    },
    computed: {
      user_article_tag () {
        return this.$store.getters['article_tag/user_article_tag'] || []
      },
      islogin () {
        return this.$store.state.personal_info.islogin
      }
    }
  }
</script>

<style scoped lang="scss">
    .tag {
        width: 100%;
        background-color: #fff;
        border: 1px solid #f1f1f1;
        transition: border-color 0.3s;
        text-align: center;
        padding: 15px 0 30px;
        .thumb {
            width: 100%;
            height: 32px;
            margin: 10px auto 15px;
            background-color: #fff;
            background-position: 50%;
            background-repeat: no-repeat;
            background-size: contain;
        }
        .tag-icon {
            width: 100%;
            height: 32px;
            margin: 10px auto 15px;
            i {
                font-size: 28px;
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
            font-size: 0.8rem;
            background-color: #fff;
            border-radius: 2px;
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
