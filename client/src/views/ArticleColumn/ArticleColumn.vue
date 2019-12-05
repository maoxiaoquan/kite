<template>
  <div class="article-column"
       id="article-column">
    <div class="container  box-container client-card">

      <nav class="switch-list-nav">
        <div class="nav-list">
          <router-link class="nav-item"
                       :to="{name:'columnAll'}">专栏</router-link>
          <router-link class="nav-item"
                       :to="{name:'subscribe_tag',params:{type:'all'}}">全部标签</router-link>
        </div>
      </nav>

      <div class="content">

        <div class="column-view">
          <div class="column-item"
               v-for="(item_column,key) in articleColumn.column_list.list"
               :key="key">
            <div class="column-item-box">
              <h2 class="title">{{item_column.name}}</h2>
              <ul class="tag-body">
                <li class="tag-popup"
                    v-for="(item_tag,key) in item_column.tag"
                    :key="key">
                  <router-link class="tag"
                               :to="{name:'article_tag',params:{en_name:item_tag.en_name}}">
                    {{item_tag.name}}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <Page :total="Number(articleColumn.column_list.count)"
              :pageSize="Number(articleColumn.column_list.pageSize)"
              :page="Number($route.query.page)||1"
              @pageChange="pageChange"></Page>

      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Page } from '@components'
import { share, baidu, google } from '@utils'
import googleMixin from '@mixins/google'

export default {
  name: 'ArticleColumn',
  minixs: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: '专栏',
      titleTemplate: `%s - ${this.website.meta.website_name}`,
      meta: [{                 // set meta
        name: 'description',
        content: `专栏-${this.website.meta.website_name}`,
      }],
      htmlAttrs: {
        lang: 'zh'
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    }
  },
  async asyncData ({ store, route, accessToken = '' }) {
    return Promise.all([
      store.dispatch('articleColumn/GET_ARTICLE_COLUMN_LIST', {
        page: route.query.page || 1
      })
    ])
  },
  methods: {
    pageChange (val) {
      this.$router.push({
        name: 'column',
        query: {
          page: val
        }
      })
    },
  },
  computed: {
    ...mapState(['articleColumn', 'website']),
  },
  components: {
    Page
  }
}
</script>

<style scoped lang="scss">
#article-column {
  .client-card {
    padding: 20px;
  }
  .switch-list-nav {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
    margin-bottom: 25px;
    .nav-list {
      align-items: center;
      line-height: 1;
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      .current-active {
        color: #ea6f5a;
      }
    }
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
  .content {
    .column-view {
      margin-left: -7px;
      margin-right: -7px;
      display: flex;
      flex-wrap: wrap;
      .column-item {
        flex-basis: 25%;
        margin-bottom: 5px;
        .column-item-box {
          padding: 0 7px;
          .title {
            margin: 0;
            line-height: 32px;
            font-weight: bold;
            font-size: 14px;
            color: #333;
            border-bottom: 1px solid rgba(178, 186, 194, 0.15);
          }
          .tag-body {
            padding: 20px 0;
            margin-bottom: 0;
            .tag-popup {
              display: inline-block;
              margin-right: 5px;
              margin-bottom: 5px;
              .tag {
                display: inline-block;
                padding: 0 6px;
                color: #017e66;
                background-color: rgba(1, 126, 102, 0.08);
                height: 22px;
                line-height: 22px;
                border-radius: 15px;
                font-weight: normal;
                font-size: 13px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
