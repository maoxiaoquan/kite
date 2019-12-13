<template>
  <div class="scroll-loading">
    <div class="scroll-loading-mian">
      <slot></slot>
    </div>
    <div class="loading-data-view">
      <div class="spinner"
           v-if="isLoading&&isMore">
        <div class="skeleton">
          <div class="skeleton-body">
            <div class="skeleton-title"></div>
            <div class="skeleton-content"></div>
          </div>
          <div class="skeleton-avatar"></div>
        </div>
      </div>
      <div class="no-more"
           v-if="!isMore">
        <div class="no-more">没有更多...</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "ScrollLoading",
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isMore: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (!Vue.prototype.$isServer) {
      window.addEventListener("scroll", this.onScroll);
      this.onScroll();
    }
  },
  methods: {
    onScroll () {
      //可滚动容器的高度
      if (!this.isMore) {
        return false;
      }
      let innerHeight = document.querySelector(".scroll-loading").clientHeight; //屏幕尺寸高度
      let outerHeight = document.documentElement.clientHeight || document.body.clientHeight; //可滚动容器超出当前窗口显示范围的高度
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
      if (innerHeight < outerHeight + scrollTop && !this.isLoading) {
        //加载更多操作
        this.$emit("scroll-loading");
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style scoped lang="scss">
.loading-data-view {
  padding: 20px;
  .skeleton {
    display: flex;
    display: -webkit-flex;
    .skeleton-avatar,
    .skeleton-title,
    .skeleton-content {
      background: #f0f0f0;
    }
    .skeleton-body {
      flex: 1;
      -webkit-flex: 1;
      padding-right: 10px;
      .skeleton-title {
        width: 100%;
        height: 40px;
        transform-origin: left;
        animation: skeleton-stretch 0.5s linear infinite alternate;
      }
      .skeleton-content {
        width: 50%;
        height: 25px;
        margin-top: 10px;
        transform-origin: left;
        animation: skeleton-stretch 0.5s -0.3s linear infinite alternate;
      }
    }
    .skeleton-avatar {
      width: 75px;
      height: 75px;
    }
  }
  @keyframes skeleton-stretch {
    from {
      transform: scalex(0.8);
    }
    to {
      transform: scalex(0.4);
    }
  }
  .no-more,
  .no-results {
    font-size: 14px;
    padding: 15px 0;
    text-align: center;
    color: #999999;
  }
}
</style>
