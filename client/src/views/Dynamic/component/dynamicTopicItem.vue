<template>
  <div class="topic-item">
    <router-link class="icon"
                 :to='{name:"dynamicTopicView",params:{dynamicTopicId:dynamicTopicItem.topic_id}}'>
      <img v-lazy="dynamicTopicItem.icon"
           class="avatar"
           alt="">
    </router-link>
    <div class="content">
      <router-link class="icon"
                   :to='{name:"dynamicTopicView",params:{dynamicTopicId:dynamicTopicItem.topic_id}}'>
        {{dynamicTopicItem.name}}
      </router-link>
      <span>{{dynamicTopicItem.attention_count}} 关注 · {{dynamicTopicItem.dynamicCount}} 片刻</span>
      <span class="subscribe"
            :class="{'active':isRssDynamicTopic}"
            @click="subscribeDynamicTopic">{{isRssDynamicTopic?'已关注':'+ 关注'}}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  modelType
} from '@utils/constant'

export default {
  name: 'dynamicTopicItem',
  props: ['dynamicTopicItem'],
  methods: {
    subscribeDynamicTopic () { // 订阅动态话题
      this.$store.dispatch('common/SET_ATTENTION', { associate_id: this.dynamicTopicItem.id, type: modelType.dynamic_topic })
        .then(res => {
          // this.$store.dispatch('articleTag/MY_SUBSCRIBE_TAG_LIST')
          if (res.state === 'success') {
            if (res.data.type === 'enter') {
              this.dynamicTopicItem.attention_count = Number(this.dynamicTopicItem.attention_count) + 1
            } else {
              this.dynamicTopicItem.attention_count -= 1
            }
            this.$store.dispatch('user/GET_USER_INFO_ALL', { uid: this.personalInfo.user.uid })
            this.$message.success(res.message);
          }
        })
    }
  },
  computed: {
    ...mapState(["personalInfo", "user"]), // home:主页  article_column:文章的专栏
    isRssDynamicTopic () {
      return ~this.user.allRssDynamicTopicId.indexOf(this.dynamicTopicItem.id)
    },
  },
}
</script>

<style scoped lang="scss">
.topic-item {
  display: flex;
  flex-grow: 0;
  padding: 18px 14px;
  align-items: flex-start;
  .icon {
    .avatar {
      position: relative;
      width: 72px;
      height: 72px;
      border-radius: 150px;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  .content {
    color: #8a9aa9;
    width: 144px;
    max-width: 144px;
    letter-spacing: normal;
    text-align: left;
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    a {
      font-weight: 600;
      color: #2e3135;
      font-size: 13px;
      justify-content: center;
    }
    span {
      padding-top: 6px;
      font-size: 12px;
    }
    .subscribe {
      cursor: pointer;
      color: #37c701;
      &.active {
        color: #999;
      }
    }
  }
}
</style>