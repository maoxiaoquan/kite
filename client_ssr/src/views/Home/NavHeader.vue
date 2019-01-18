<template>
    <nav class="nav-header recommend-collection">
        <ul class="nav-item-view index-container">
            <li class="nav-item">
                <router-link :to='{name:"home"}'>
                    <span class="collection-name">推荐</span>
                </router-link>
            </li>
            <li class="nav-item" v-for="column_item in navItem" :key="column_item.article_column_id">
                <router-link :to='{name:"column",params:{column_us_name:column_item.article_column_us_name}}'>
                    <span class="collection-name">{{column_item.article_column_name}}</span>
                </router-link>
            </li>
            <li class="nav-item">
                <a class="collection" href="/subscribe/tag">
                    <span class="collection-name">
                      更多...
                    </span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
  export default {
    name: 'NavHeader',
    props: {
      navItem: Array,
    },
  }
</script>

<style scoped lang="scss">
    .nav-header {
        position: fixed;
        top: 62px;
        left: 0;
        width: 100%;
        z-index: 100;
        -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        transition: all .2s;
        transform: translateZ(0);
        height: 45px;
        background-color: #fff;
        &.top {
            transform: translate3d(0, -62px, 0);
        }
        &.recommend-collection {
            .nav-item-view {
                display: flex;
                align-items: center;
                line-height: 1;
                height: 100%;
                .nav-item {
                    height: 100%;
                    align-items: center;
                    display: flex;
                    padding: 0 15px;
                    flex-shrink: 0;
                    font-size: 14px;
                    &:first-child {
                        padding-left: 0;
                    }
                    a.active {
                        color: #00bb29;
                    }
                }
            }
        }
    }
</style>
