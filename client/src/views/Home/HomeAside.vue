<template>
  <div class="home-lay layout-aside">

    <div class="notice"
         v-if="website.notice.length>0">
      <a class="notice-item"
         v-for="(item,key) in website.notice"
         v-if="item.enable"
         :href="item.link"
         :key="key">{{item.title}}</a>
    </div>

    <div class="aside-component">
      <h3>写下你想说的</h3>
      <div class="issue-btn">
        <a href="javascript:;"
           @click="switchRouter"
           class="btn-note"
           id="js-btn-note">
          <i class="iconfont icon-xiezuo"></i>写文章
        </a>
        <!--<span class="middle-line"></span>
                <a href="/daily_recommend" class="btn-dynamic js-publish-btn">发说说</a>-->
      </div>
    </div>

    <div class="advertise"
         v-if="website.advertise.length>0">
      <div class="advertise-item"
           v-for="(advertiseItem,key) in website.advertise"
           v-if="advertiseItem.enable"
           :key="key">
        <a class="advertise-img"
           :href="advertiseItem.link||'javascript:;'"
           v-if="advertiseItem.img_url">
          <img :src="advertiseItem.img_url"
               alt="">
        </a>
        <a class="advertise-text"
           :href="advertiseItem.link||'javascript:;'"
           v-else>
          {{advertiseItem.title}}
        </a>
      </div>
    </div>

    <div class="hot-tags-for-sidebar ">
      <header class="heading u-clearfix heading--borderedBottom heading--allCaps heading--normal heading--simple xzl-margin-bottom15">
        <div class="u-clearfix">
          <div class="heading-content hot-tags-header u-floatLeft">
            <span class="hot-tags-header-title">
              热门标签
            </span>
            <span class="hot-tags-more">
              <router-link :to="{name:'subscribe_tag',params:{type:'all'}}">查看更多 &gt;</router-link>
            </span>
          </div>
        </div>
      </header>
      <ul class="tags xzl-tags-list hot-sidebar-items hot-tags-sidebar tags--light">
        <li v-for="(item,key) in home.popular_article_tag"
            :key="key">
          <router-link class="link xzl-link-color"
                       :to="{name:'article_tag',params:{article_tag_en_name:item.article_tag_en_name}}">
            {{item.article_tag_name}}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="website-information">

      <ul class="more-list">
        <li class="item"
            v-if="website.meta.about"><a :href="website.meta.about"
             target="_blank">关于</a></li>
        <li class="item"
            v-if="website.meta.feedback"><a :href="website.meta.feedback"
             target="_blank">建议反馈</a></li>
      </ul>
      <ul class="more-list"
          v-if="website.meta.miibeian">
        <li class="item"><a href="http://www.miibeian.gov.cn"
             target="_blank">{{website.meta.miibeian}}</a></li>
      </ul>
      <ul class="more-list">
        <li class="item"><a>©{{currYear}} {{website.meta.website_name}}</a></li>
      </ul>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeAside',
  methods: {
    switchRouter () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$store.commit('SET_IS_LOGIN', true)
      } else {
        this.$router.push({
          name: 'editor',
          params: { editor_type: 'create' }
        })
      }
    }
  },
  computed: {
    ...mapState(['home', 'website']),
    currYear () {
      let date = new Date
      let year = date.getFullYear()
      return year
    }
  }
}
</script>

<style scoped lang="scss">
.layout-aside {
  .notice {
    padding: 15px 12px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 12px;
    background-color: #fcf8e3;
    border-color: #faebcc;
    color: #8a6d3b;
    .notice-item {
      display: block;
      line-height: 20px;
      color: #8a6d3b;
      font-size: 14px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .advertise {
    .advertise-item {
      overflow: hidden;
      margin-bottom: 10px;
      .advertise-img {
        border-radius: 12px;
        overflow: hidden;
        display: block;
      }
      .advertise-text {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .aside-component {
    height: 114px;
    background: rgba(43, 51, 59, 0.06);
    border-radius: 12px;
    box-sizing: border-box;
    margin-bottom: 20px;
    h3 {
      font-size: 16px;
      color: #1c1f21;
      line-height: 24px;
      text-align: center;
      font-weight: 700;
      padding-top: 24px;
      margin-bottom: 8px;
    }
    .issue-btn {
      width: 80%;
      height: 38px;
      line-height: 38px;
      margin: 0 auto;
      background: #f53d3d;
      border-radius: 24px;
      a {
        font-size: 15px;
        width: 100%;
        /*width: 45%;*/
        text-align: center;
        display: inline-block;
        cursor: pointer;
        color: #ffffff;
        i {
          margin-right: 10px;
        }
      }
      .btn-dynamic,
      .btn-note {
        border-radius: 24px;
        transition: all 0.3s;
        -moz-transition: all 0.3s;
        -webkit-transition: all 0.3s;
        -o-transition: all 0.3s;
      }
      .middle-line {
        width: 2px;
        height: 16px;
        background-color: rgba(255, 255, 255, 0.4);
        display: inline-block;
        margin-top: 10px;
      }
    }
  }

  .hot-tags-for-sidebar {
    margin-top: 60px;
    .hot-tags-header {
      position: relative;
      padding-bottom: 13px;
      border-bottom: 1px solid #ededed;
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      line-height: 1;
      margin-bottom: 15px;
      span.hot-tags-header-title {
        font-weight: bold;
        font-size: 16px;
        color: #2d2d2f;
        &:after {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          width: 64px;
          background: #2d2d2f;
          content: "";
        }
      }
      .hot-tags-more {
        margin-left: auto;
        font-size: 14px;
        color: #c7c7c7;
      }
    }
    ul.hot-sidebar-items li {
      border: 1px solid #f5f5f5;
      border-radius: 2px;
      height: 32px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 5px 10px;
      line-height: 22px;
      display: inline-block;
      a {
        padding: 0px;
        font-size: 14px;
      }
    }
  }

  .website-information {
    margin-top: 50px;
    border-top: 1px solid #ededed;
    padding-top: 10px;
    ul {
      display: block;
      li {
        display: inline-block;
        font-size: 14px;
        margin-right: 30px;
        margin-top: 10px;
        a {
          color: rgba(0, 0, 0, 0.44) !important;
          fill: rgba(0, 0, 0, 0.44) !important;
          line-height: 20px;
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
