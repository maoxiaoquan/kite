<template>
    <div class="user-article-topic-item" :class="{'active':!is_edit}">
        <div class="input-view">
            <input type="text" v-model="topic_name">
        </div>
        <div class="input-view">
            <input type="text" v-model="topic_description">
        </div>
        <div class="operate">
            <button type="button" v-show="!is_edit" @click="is_edit=true" class="btn btn-primary btn-sm">修改</button>
            <button type="button" v-show="is_edit" @click="save_edit" class="btn btn-primary btn-sm">保存</button>
            <button type="button" v-show="is_edit" @click="cancel_save" class="btn btn-primary btn-sm">取消</button>
            <button type="button" @click="delete_topic" class="btn btn-danger btn-sm">删除</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'TopicList',
    props: ['item'],
    data () {
      return {
        topic_name: '',
        topic_description: '',
        is_edit: false
      }
    },
    created () {
      this.topic_name = this.item.topic_name
      this.topic_description = this.item.topic_description
    },
    methods: {
      cancel_save () {
        this.topic_name = this.item.topic_name
        this.topic_description = this.item.topic_description
        this.is_edit = false
      },
      save_edit () {
        var that = this
        this.$store.dispatch('user/UPDATE_ARTICLE_TOPIC', {
          topic_name: that.topic_name,
          topic_description: that.topic_description,
          topic_id: that.item.topic_id,
        })
          .then(res => {
            if (res.state === 'success') {
              that.is_edit = false
              this.$message.success(res.message);
              that.$emit('update-list')
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      delete_topic () {
        var that = this
        this.$store.dispatch('user/DELETE_ARTICLE_TOPIC', {
          topic_id: that.item.topic_id,
        })
          .then(res => {
            if (res.state === 'success') {
              this.$message.success(res.message);
              that.$emit('update-list')
            } else {
              this.$message.warning(res.message);
            }
          })
      },
      user_article_topic_all () { // 个人所有专栏
        return this.$store.state.user.user_article_topic || []
      },
    }
  }
</script>

<style scoped lang="scss">
    .user-article-topic-item {
        margin-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 8px;
        display: flex;
        input {
            border: 1px solid #e0e0e0;
            padding: 5px;
            display: block;
        }
        .input-view,
        .operate {
            flex: 1;
        }
        .input-view {
            margin-right: 5px;
            font-size: 14px;
        }
        .operate {
            padding: 3px 0 0 3px;
        }
        &.active {
            input {
                border-color: #fff;
                pointer-events: none;
            }
        }
    }
</style>
