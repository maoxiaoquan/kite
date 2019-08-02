<template>
  <div id="dynamic">
    <div class="container dynamic-container">
      <div class="aside">
        <nav role="navigation"
             class="dock-nav">
          <ul class="nav-list">
            <li class="nav-item acitve">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'recommended'}}"
                           class="nav-link">推荐</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'hot'}}"
                           class="nav-link">热门</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'following'}}"
                           class="nav-link">关注</router-link>
            </li>
          </ul>
          <ul class="nav-list">
            <li class="nav-item"
                v-for="(item,key) in 5"
                :key="key">
              <router-link :to="{name:'dynamics',params:{dynamicTopicId:'5c09ea2b092dcb42c740fe73'+item}}"
                           class="nav-link">开源推荐</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name:'dynamicTopic'}">
                更多
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="row dynamic-main">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="stream-wrapper">
            <dynamic-wtite />
          </div>
          <ul>
            <li class="dy-item"
                v-for="item in 10"
                :key="item">
              <dynamic-item />
            </li>
          </ul>
        </div>
        <div class="col-xs-12 col-sm-4 col-md-4">
          <dynamic-aside />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dynamicItem from './component/dynamicItem'
import dynamicWtite from './component/dynamicWtite'
import dynamicAside from './component/dynamicAside'
export default {
  name: 'dynamic',
  components: {
    dynamicItem,
    dynamicWtite,
    dynamicAside
  }
}
</script>

<style scoped lang="scss">
#dynamic {
  .aside {
    position: fixed;
    top: 90px;
    width: 120px;
    transition: all 0.2s linear;
    padding: 12px 15px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 16px;
    .nav-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid rgba(92, 96, 102, 0.1);
      .nav-item {
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #2e3135;
          padding: 6px 10px;
          border-radius: 5px;
          transition: background-color 0.2s, color 0.2s;
        }
        .current-active {
          background: #007fff;
          color: #fff;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .dynamic-main {
    padding-left: 145px;
    margin-top: 30px;
    .stream-wrapper {
      margin-bottom: 8px;
    }
    .dy-item {
      position: relative;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 16px;
      margin-bottom: 8px;
    }
  }
}
</style>