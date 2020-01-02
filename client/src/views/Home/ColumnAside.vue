<template>
  <div class="home-lay layout-aside">

    <div class="column-view client-card-shadow">
      <h3 class="title">关于专栏</h3>
      <div class="column-content">
        <div class="AnswerAuthor-user">
          <div class="AnswerAuthor-user-avatar">
            <span class="UserLink">
              <img class="Avatar Avatar--large UserLink-avatar"
                   width="60"
                   height="60"
                   :src="articleColumn.column.icon"
                   alt="">
            </span>
          </div>
          <div class="AnswerAuthor-user-content">
            <div class="AnswerAuthor-user-name">
              <span class="UserLink">
                {{articleColumn.column.name}}</span>
            </div>
          </div>
        </div>

        <p class="column-description">
          {{articleColumn.column.description}}
        </p>

        <div class="column-tag"
             v-if="articleColumn.column.tag_ids&&articleColumn.column.en_name!=='all'">
          <router-link v-for="(itemTag,key) in articleColumn.column.tag"
                       class="tag-class frontend"
                       :key="key"
                       :to="{name:'article_tag',params:{en_name:itemTag.en_name}}">{{itemTag.name}}</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeAside',
  methods: {

  },
  computed: {
    ...mapState(['home', 'website', "articleColumn",])
  }
}
</script>

<style scoped lang="scss">
.layout-aside {
  .column-view {
    padding: 24px;
    .title {
      font-size: 16px;
      line-height: 28px;
      color: rgba(0, 0, 0, 0.88);
      font-weight: normal;
      position: relative;
      padding-left: 12px;
      &::before {
        content: "";
        width: 4px;
        height: 20px;
        position: absolute;
        top: 4px;
        left: 0;
        border-radius: 2px;
        background: #ec7259;
      }
    }
    .column-content {
      .AnswerAuthor-user {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 16px 0;
        position: relative;
        .AnswerAuthor-user-avatar {
          margin-right: 12px;
          .UserLink {
            display: block;
            .Avatar--large {
              border-radius: 4px;
            }
          }
        }
        .AnswerAuthor-user-content {
          -webkit-box-flex: 1;
          -ms-flex: 1 1;
          flex: 1 1;
          overflow: hidden;
          .AnswerAuthor-user-name {
            font-size: 20px;
            font-weight: 600;
            font-synthesis: style;
            line-height: 30px;
            color: #1a1a1a;
          }
        }
      }
      .column-description {
        border-top: 1px solid #f6f6f6;
        padding: 16px 0;
        font-size: 15px;
      }
      .column-tag {
        border-top: 1px solid #f6f6f6;
        padding: 16px 0;
        a {
          display: inline-block;
          margin-right: 10px;
          font-size: 14px;
          padding: 5px 10px;
          border-radius: 3px;
          margin-bottom: 10px;
          background: #f1f1f1;
        }
      }
    }
  }
}

@media (max-width: 575px) {
  body {
    .layout-aside {
      display: none;
    }
  }
}
</style>
