<template>
  <div id="dynamic">
    <div class="container dynamic-container">
      <div class="aside">
        <nav role="navigation"
             class="dock-nav">
          <ul class="nav-list">
            <li class="nav-item acitve"><a href="/pins/recommended">推荐 </a></li>
            <li class="nav-item"><a href="/pins/hot">热门 </a></li>
            <li class="nav-item"><a href="/pins/following">关注 </a></li>
          </ul>
          <ul class="nav-list">
            <li class="nav-item"><a href="/pins/topic/5c09ea2b092dcb42c740fe73">开源推荐 </a></li>
            <li class="nav-item"><a href="/pins/topic/5abb61e1092dcb4620ca3322">内推招聘</a></li>
            <li class="nav-item"><a href="/pins/topic/5abcaa67092dcb4620ca335c">掘金相亲</a></li>
            <li class="nav-item"><a href="/pins/topic/5c106be9092dcb2cc5de7257">上班摸鱼</a></li>
            <li class="nav-item"><a href="/pins/topic/5b514af1092dcb61bd72800d">应用安利</a></li>
            <li class="nav-item"><a href="/pins/topic/5abb67d2092dcb4620ca3324">开发工具</a></li>
            <li class="nav-item"><a href="/pins/topic/5c46a17f092dcb4737217152">New资讯</a></li>
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
            <li class="item shadow"
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
    border-radius: 5px;
    background-color: #fff;
    position: fixed;
    top: 90px;
    width: 120px;
    transition: all 0.2s linear;
    padding: 12px 15px;
    box-shadow: 1px 1px 15px rgba(67, 38, 100, 0.15);
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
        &.acitve {
          a {
            background: #007fff;
            color: #fff;
          }
        }
      }
    }
  }
  .dynamic-main {
    padding-left: 145px;
    margin-top: 30px;
    .stream-wrapper {
      margin-bottom: 8px;
    }
  }
}
</style>