<template>
  <div id="dynamic-content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-md-8 dynamic-content-main">
          <dynamic-item :dynamicItem="dynamic.dynamicView"
                        :dfIsCommnet="false" />
          <div class="dynamic-comment-part"
               v-if="website.config.on_comment==='yes'">
            <comment-form :dynamicId="$route.params.dynamicId"
                          @commentChange="commentChange" />
            <div class="comment-list">
              <scroll-loading @scroll-loading="infiniteHandler"
                              :isLoading="isLoading"
                              :isMore="isMore">
                <comment-item :comment-item="item"
                              :dynamicId="$route.params.dynamicId"
                              v-for="(item,key) in commentList"
                              :key="key" />
              </scroll-loading>
            </div>
          </div>
          <div v-else>
            <p class="no-comment">评论模块已关闭</p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="sidebar shadow">
            <div class="related-dynamic-block">
              <header class="title">相关推荐</header>
              <ul class="dynamic-list">
                <li class="item"
                    v-for="(item,key) in dynamic.recommendDynamicList"
                    :key="key">
                  <router-link class="dynamic"
                               :to='{name:"dynamicView",params:{dynamicId:item.id}}'>
                    <div class="content-box">
                      <div class="content">{{item.content}}</div>
                      <div class="stat item"><span>{{item.like_count}} 赞 · </span><span>{{item.comment_count}} 评论</span></div>
                    </div>

                  </router-link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dynamicItem from './component/dynamicItem'
import dynamicWrite from './component/dynamicWrite'
import dynamicAside from './component/dynamicAside'

import commentItem from "../Comment/DynamicComment/CommentItem";
import { Page, ScrollLoading } from "@components";
import commentForm from "../Comment/DynamicComment/CommentForm";

import { mapState } from 'vuex'
export default {
  name: 'dynamic-view',
  metaInfo () {
    return {
      title: this.dynamic.dynamicView.content || "动态不存在",
      meta: [
        {
          // set meta
          name: "description",
          content: `${this.dynamic.dynamicView.content || "文章不存在"}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("dynamic/GET_DYNAMIC_VIEW", {
        id: route.params.dynamicId
      })
    ]);
  },
  data () {
    return {
      commentList: [], // 用户评论的列表
      page: 1,
      pageSize: 6,
      isLoading: false,
      isMore: true
    };
  },
  created () {
    this.$store.dispatch("dynamic/GET_RECOMMEND_DYNAMIC_LIST")
  },
  watch: {
    $route (to, from) {
      this.commentList = []
      this.page = 1
      this.isLoading = false
      this.isMore = true
    }
  },
  computed: {
    ...mapState(['dynamic', "website", "personalInfo"])
  },
  methods: {
    infiniteHandler () {
      this.isLoading = true;
      this.$store
        .dispatch("dynamicComment/DYNAMIC_COMMENT_LIST", {
          dynamic_id: this.$route.params.dynamicId,
          page: this.page,
          childPageSize: 5,
          pageSize: this.pageSize
        })
        .then(result => {
          this.isLoading = false;
          this.commentList = [...this.commentList, ...result.data.list]
          if (result.data.list.length === 10) {
            this.page += 1;
          } else {
            this.isMore = false;
          }
        })
        .catch(err => {
          this.isMore = false;
        });
    },
    commentChange (result) {
      if (result.state === "success") {
        this.commentList.unshift(result.data)
        this.$message.success(result.message);
      } else {
        this.$message.warning(result.message);
      }
    }
  },
  components: {
    dynamicItem,
    dynamicWrite,
    dynamicAside,
    ScrollLoading,
    "comment-item": commentItem,
    'comment-form': commentForm,
  }
}
</script>

<style scoped lang="scss">
#dynamic-content {
  padding-top: 30px;
  .dynamic-content-main {
    box-shadow: 0 0 3px rgba(67, 38, 100, 0.15);
    margin-bottom: 8px;
  }
  .dynamic-comment-part {
    border-top: 1px solid #ebebeb;
    padding-top: 15px;
  }
}

.related-dynamic-block {
  .title {
    color: #2e3135;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    padding: 13px 16px;
    border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
  }
  .dynamic-list {
    padding: 0 16px;
    .item {
      padding: 12px 0;
    }
    .item:not(:last-child) {
      border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
    }
    .dynamic {
      display: flex;
      justify-content: space-between;
    }
    .content-box {
      display: flex;
      align-content: space-between;
      flex-direction: column;
      .content {
        color: #2e3135;
        font-size: 13px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
      }
    }
    .stat {
      color: #76797e;
      font-size: 12px;
      margin-top: auto;
    }
  }
}
</style>