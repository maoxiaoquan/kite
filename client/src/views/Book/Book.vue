<template>
  <div class="book-view">
    <div class="container  box-container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-md-8">
          <div class="client-card">
            <div class="book-info">
              <div class="poster">
                <img src="https://user-gold-cdn.xitu.io/2019/6/12/16b49d5cb7263893?w=1950&amp;h=2730&amp;f=png&amp;s=1316972">
              </div>
              <div class="info">
                <div class="title-line">
                  <a href=""
                     class="title">
                    <span>深入理解 TCP 协议：从原理到实战</span>
                  </a>
                </div>
                <div class="media">
                  <div class="desc">用实验和图解的方式带你深入理解 TCP 协议，让 TCP 协议不再是拦路虎</div>
                  <div class="author">
                    <div class="author-info">
                      <a href=""
                         target="_blank"
                         class="user">
                        <div class="lazy avatar hero loaded"
                             style="background-image: url(&quot;https://user-gold-cdn.xitu.io/2019/1/11/1683a78ae7d12c82?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1&quot;);">
                        </div>
                        <a href=""
                           target="_blank"
                           rel=""
                           class="username username">
                          挖坑的张师傅
                          <a href=""
                             target="_blank"
                             rel=""
                             class="rank">
                            <img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-2.f597b88.svg"
                                 alt="lv-2">
                          </a>
                        </a>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="other">
                  <div class="not-buy">
                    <button class="button--buy"> 购买 ￥29.9</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="client-card">
            <div class="book-menu-wrap">
              <div class="book-menu">
                <div class="item"
                     @click="currentType='BookList'"
                     :class="{'active':currentType==='BookList'}"><span class="text">目录</span></div>
                <div class="item"
                     @click="currentType='BookInfo'"
                     :class="{'active':currentType==='BookInfo'}"><span class="text">介绍</span></div>
                <div class="item"
                     @click="currentType='BookComment'"
                     :class="{'active':currentType==='BookComment'}"><span class="text">评论</span>
                </div>
              </div>
            </div>
            <div class="book-content">
              <BookList v-show="currentType==='BookList'" />
              <BookInfo v-show="currentType==='BookInfo'" />
              <BookComment v-show="currentType==='BookComment'" />
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4">
          <website-notice />
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import websiteNotice from '@views/Parts/websiteNotice'
import BookList from './component/BookList'
import BookInfo from './component/BookInfo'
import BookComment from './component/BookComment'
export default {
  name: "NavSort",
  data () {
    return {
      currentType: "BookList"
    };
  },
  methods: {

  },
  components: {
    websiteNotice,
    BookList,
    BookInfo,
    BookComment
  }
};
</script>

<style scoped lang="scss">
.book-view {
  .book-info {
    padding: 20px;
    .poster {
      width: 130px;
      height: 182px;
      border-radius: 2px;
      background-repeat: no-repeat;
      float: left;
      margin-right: 20px;
    }
    .info {
      margin-left: 150px;
      font-size: 14px;
      min-height: 182px;
      .title-line {
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }
      }
      .media {
        display: flex;
        flex-direction: column;
        .desc {
          margin-top: 10px;
          min-height: 40px;
          line-height: 20px;
          overflow: hidden;
          color: #71777c;
        }
        .author {
          position: relative;
          display: flex;
          align-items: center;
          margin-top: 12px;
          .author-info {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            color: #333;
            .user {
              display: flex;
              align-items: center;
              color: #000;
              .hero {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
    .other {
      margin-top: 25px;
      position: relative;
      .not-buy {
        position: relative;
        .button--buy {
          height: 40px;
          font-size: 16px;
          padding-left: 30px;
          padding-right: 30px;
          background-color: #007fff;
          color: #fff;
          border: none;
          text-align: center;
        }
      }
    }
  }
  .book-menu-wrap {
    .book-menu {
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      height: 50px;
      line-height: 50px;
      position: relative;
      border-bottom: 1px solid #ecf0f3;
      .item {
        padding-left: 20px;
        padding-right: 20px;
        font-size: 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        &.active {
          color: #007fff;
          border-bottom: 2px solid #007fff;
        }
      }
    }
  }
}
</style>
