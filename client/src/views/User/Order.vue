<template>
  <client-only>
    <section class="layout-content detail-lay">
      <div class="container  box-container">
        <div class="row">
          <div class="col-xs-12 col-sm-8 col-md-8 main">
            <div class="client-card pd20">
              <h3 class="title">我的订单</h3>

              <ul class="nav-item-view">
                <li
                  class="nav-item"
                  :class="{ active: !currProductType }"
                  @click="switchType('', '')"
                >
                  <a href="javascript:;" class="collection-name">
                    全部
                  </a>
                </li>
                <li
                  class="nav-item"
                  :class="{ active: key == currProductType }"
                  v-for="(item, key, index) in productTypeInfo"
                  v-if="item.isUse"
                  @click="switchType(item, key)"
                  :key="index"
                >
                  <a href="javascript:;" class="collection-name">
                    {{ item.name }}
                  </a>
                </li>
              </ul>

              <div class="detail-view row">
                <div
                  class="col-xs-12 col-sm-6 col-md-6 detail-item"
                  v-for="(item, key) in detail.list"
                  :key="key"
                >
                  <div
                    v-if="item.product_type == productType.books"
                    class="books"
                  >
                    <div class="library-item__thumb">
                      <router-link
                        :to="{
                          name: 'book',
                          params: { books_id: item.productInfo.books_id }
                        }"
                      >
                        <img
                          v-lazy="item.productInfo.cover_img"
                          class="img-full"
                          lazy="loaded"
                        />
                      </router-link>
                    </div>
                    <div class="library-item__body">
                      <router-link
                        class="library-item__title"
                        :to="{
                          name: 'book',
                          params: { books_id: item.productInfo.books_id }
                        }"
                      >
                        {{ item.productInfo.title }}
                        <span class="tag-buy">已购买</span>
                      </router-link>
                      <div class="library-item__info">
                        <span
                          ><i class="el-icon-view"></i>
                          {{ item.productInfo.read_count || 0 }} </span
                        ><span style="margin-left: 8px;">
                          <i class="el-icon-notebook-2"></i>
                          {{ item.productInfo.bookCount || 0 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Page
                :total="Number(detail.count)"
                :pageSize="Number(detail.pageSize)"
                :page="Number(detail.page) || 1"
                @pageChange="pageChange"
              ></Page>
            </div>
          </div>

          <div class="col-xs-12 col-sm-4 col-md-4 box-aside">
            <UserAside />
          </div>
        </div>
      </div>
    </section>
  </client-only>
</template>

<script>
import UserAside from './view/UserAside'
import Collect from './PersonalView/Collect'
import { mapState } from 'vuex'
import ClientOnly from 'vue-client-only'
import { Page, faceQQ, Dropdown } from '@components'
import {
  userMessageAction,
  virtualPlusLess,
  virtualPlusLessText,
  virtualType,
  productType,
  statusList,
  productTypeInfo,
  modelType
} from '@utils/constant'

export default {
  name: 'order',
  metaInfo() {
    return {
      title: '个人中心',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  data() {
    return {
      virtualPlusLess,
      virtualPlusLessText,
      productTypeInfo,
      virtualType,
      statusList,
      productType,
      modelType,
      currProductType: '',
      detail: {
        list: [],
        product_type: '',
        count: 0,
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    pageChange(val) {
      this.detail.page = val
      this.getList()
    },
    switchType(item, key) {
      this.currProductType = key
      this.getList()
    },
    getList() {
      this.$store
        .dispatch('shop/GET_ORDER_LIST', {
          uid: this.personalInfo.user.uid,
          page: this.detail.page,
          product_type: this.currProductType || '',
          pageSize: this.detail.pageSize
        })
        .then(result => {
          this.detail = result.data
        })
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user']) // personalInfo:个人信息  user:登录后的个人信息当前用户
  },
  components: {
    UserAside,
    ClientOnly,
    Collect,
    Page
  }
}
</script>

<style scoped lang="scss">
.detail-lay {
  .title {
    margin-bottom: 20px;
  }
  .nav-item-view {
    position: relative;
    margin-bottom: 15px;
    .nav-item {
      display: inline-block;
      a,
      span {
        display: block;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.56);
        text-align: center;
        padding: 3px 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 14px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      &.active {
        a,
        span {
          background: #f46300;
          border-color: #f46300;
          color: #fff;
        }
      }
    }
  }
  .detail-view {
    .detail-item {
      .books {
        height: 100px;
        display: flex;
        padding: 10px;
        box-sizing: border-box;
        flex-direction: row;
        overflow: hidden;
        border: 1px solid rgba(178, 186, 194, 0.15);
        .img-full {
          width: 80px;
          height: 80px;
          overflow: hidden;
        }
        .library-item__thumb {
          width: 80px;
        }
        .library-item__body {
          flex: 1;
          padding-left: 10px;
          .library-item__title {
            font-size: 14px;
            padding-top: 10px;
            font-weight: bold;
            .tag-buy {
              font-size: 12px;
              background: #fd763a;
              border-radius: 3px;
              line-height: 18px;
              color: #fff;
              padding: 1px 3px;
              display: inline-block;
            }
          }
          .library-item__info {
            font-size: 12px;
            margin-top: 15px;
            line-height: 20px;
            color: rgba(0, 0, 0, 0.56);
          }
        }
      }
    }
  }
}
</style>
