<template>
  <div id="dynamic-topic-view">
    <div class="container dynamic-container">
      <div class="row dynamic-main">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="stream-wrapper">
            <dynamic-write />
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
          <aside class="topic-side topic-side sidebar">
            <div data-v-6e4c1285=""
                 data-v-49233e61=""
                 class="topic-box shadow">
              <div data-v-6e4c1285=""
                   class="wallpaper">
                <span data-v-6e4c1285=""
                      style="background-image: url(&quot;https://user-gold-cdn.xitu.io/2018/5/15/1635f8400e159843?imageView2/1/w/300/h/144/q/85/format/webp/interlace/1&quot;);"></span></div>
              <div data-v-6e4c1285=""
                   class="content">
                <el-image class="icon"
                          size="size"
                          src="circleUrl">
                </el-image>
                <div data-v-6e4c1285=""
                     class="title">一图胜千言</div><button data-v-6e4c1285=""
                        class="followed">已关注</button>
                <div data-v-6e4c1285=""
                     class="describe">
                  <div data-v-6e4c1285=""
                       class="desc-title">话题介绍:</div><span data-v-6e4c1285="">能用图，就不要用字。</span>
                  <div data-v-6e4c1285=""
                       class="limit-ctl-box">
                    <!---->
                    <!---->
                  </div>
                </div>
              </div>
              <div data-v-6e4c1285=""
                   class="stat-box">
                <li data-v-6e4c1285=""
                    class="item">
                  <div data-v-6e4c1285=""
                       class="count">3367</div>
                  <div data-v-6e4c1285=""
                       class="title">沸点</div>
                </li>
                <li data-v-6e4c1285=""
                    class="item">
                  <div data-v-6e4c1285=""
                       class="count">4582</div>
                  <div data-v-6e4c1285=""
                       class="title">关注</div>
                </li>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dynamicItem from './component/dynamicItem'
import dynamicWrite from './component/dynamicWrite'
import dynamicAside from './component/dynamicAside'
export default {
  name: 'dynamic',
  components: {
    dynamicItem,
    dynamicWrite,
    dynamicAside
  }
}
</script>

<style scoped lang="scss">
#dynamic-topic-view {
  padding-top: 30px;
  .dynamic-main {
  }
  .topic-side {
    .topic-box {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      margin-bottom: 8px;
      .wallpaper {
        position: relative;
        height: 109px;
        overflow: hidden;
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        .icon {
          filter: none;
          position: absolute;
          top: -32px;
          left: 50%;
          width: 64px;
          height: 64px;
          border-radius: 5px;
          margin-left: -32px;
          border: 2px solid hsla(0, 0%, 100%, 0.6);
          z-index: 1;
          box-sizing: content-box;
        }
        .title {
          font-size: 15px;
          margin-top: 41px;
          text-align: center;
          font-weight: 600;
          color: #17181a;
        }
        button {
          padding: 0;
          width: 6.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: center;
          background: #fff;
          border-radius: 3px;
          color: #37c701;
          border: 1px solid #37c701;
          font-size: 15px;
          margin: 10px 0 8px;
          background: #37c701;
          color: #fff;
        }
        .describe {
          font-size: 13px;
          color: #1a1b1d;
          width: 100%;
          margin-bottom: 12px;
          .desc-title {
            color: #17181a;
            font-weight: 600;
            font-size: 14px;
            padding: 0 16px;
          }
          span {
            padding: 0 16px;
            white-space: pre-line;
            display: inline-block;
          }
        }
      }
      .stat-box {
        flex: 1 1 auto;
        display: flex;
        margin: 0;
        list-style: none;
        text-align: center;
        padding: 12px 0;
        border-top: 1px solid rgba(92, 96, 102, 0.1);
        user-select: none;
        .item {
          flex: 1 1 auto;
          max-height: 40px;
        }
        .item:not(:last-child) {
          border-right: 1px solid rgba(92, 96, 102, 0.1);
        }
      }
    }
  }
}
</style>