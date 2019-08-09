<template>
  <div id="dynamic-content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-md-8 dynamic-content-main">
          <dynamic-item :dynamicItem="dynamic.dynamicView"
                        :dfIsCommnet="true" />
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <div class="sidebar shadow">
            <div class="related-dynamic-block">
              <header class="title">相关推荐</header>
              <ul class="dynamic-list">
                <li class="item"
                    v-for="x in 3">
                  <a href="/dynamic/5d424d0e51882564daa2f264"
                     target="_blank"
                     rel=""
                     class="dynamic">
                    <div class="content-box">
                      <div class="content">微信防撤回、微信语音转发、微信秒抢红包、微信自定义骰子、微信自动回复、朋友圈伪集赞、
                        手机机型伪造、虚拟定位在家里也可以上班打卡，你是否也感受过xposed模块的威力？</div>
                      <div class="stat item"
                           style="margin-top: 0.83rem;"><span>1 赞 · </span><span>0 评论</span></div>
                    </div>
                    <!---->
                  </a></li>

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
import dynamicWtite from './component/dynamicWtite'
import dynamicAside from './component/dynamicAside'
import { mapState } from 'vuex'
export default {
  name: 'dynamic-view',
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.dispatch("dynamic/GET_DYNAMIC_VIEW", {
        topic_id: route.params.dynamicId
      })
    ]);
  },
  computed: {
    ...mapState(['dynamic'])
  },
  components: {
    dynamicItem,
    dynamicWtite,
    dynamicAside
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