<template>
    <article class="content-box content-box-index">
        <div class="info-box">

            <div class="info-row title-row">
                <a class="title" target="_blank" v-text="articleItem.title"></a>
            </div>

            <div class="info-row meta-row">
                <ul class="meta-list">
                    <li class="item username clickable">
                        <a href="" v-text="articleItem.user.nickname"></a>
                    </li>
                    <li class="item item-icon like-article">
                        <i class="iconfont icon-love"></i>
                        <strong v-text="articleItem.like_count"></strong>
                    </li>
                    <li class="item item-icon comment-count">
                        <i class="iconfont icon-pinglun"></i>
                        <strong v-text="articleItem.comment_count"></strong>
                    </li>
                    <li class="item" v-text="articleItem.create_at"></li>
                    <li class="item" v-if="articleItem.tag_ids">
                        <a v-for="item_article_tag in article_tag_filter(articleItem.tag_ids)"
                           class="tag-class frontend"
                           v-text="item_article_tag.article_tag_name">
                        </a>
                    </li>
                </ul>
            </div>

        </div>
        <div class="lazy thumb thumb loaded" v-if="articleItem.cover_img"
             style="background-size: cover;"
             :style="{'background-image':'url('+articleItem.cover_img+')'}">
        </div>
    </article>
</template>

<script>
  export default {
    name: 'ArticleItem',
    props: {
      articleItem: {
        type: Object
      },
    },
    methods: {
      article_tag_filter: function (val) {
        var _arr = []
        this.article_tag.map(function (item, key) {
          if (val.split(',')
            .indexOf(String(item.article_tag_id)) !== -1) {
            _arr.push(item)
          }
        })
        return _arr
      },
    },
    computed: {
      article_tag () {
        return this.$store.state.article_tag
      },
    }
  }
</script>

<style scoped lang="scss">

    .content-box {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0.8rem 0;
        min-height: 5.75rem;
        .info-box {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-flex: 1;
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            min-width: 0;
            .title-row {
                margin: 0.5rem 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .title {
                    font-size: 17px;
                    letter-spacing: 1px;
                    font-weight: 600;
                    line-height: 1.2;
                    color: #333;
                }
            }
            .content-text {
                font-size: 13px;
                line-height: 24px;
                color: #999;
                margin-bottom: 10px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .meta-row {
                font-size: 0.5rem;
                .meta-list {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: baseline;
                    -ms-flex-align: baseline;
                    align-items: baseline;
                    white-space: nowrap;
                    .item {
                        display: inline-block;
                        color: #b3bac1;
                        &:after {
                            display: inline-block;
                            content: '\B7';
                            margin: 0 6px;
                            color: #b2bac2;
                        }
                        &:last-of-type {
                            &:after {
                                content: '';
                            }
                        }
                        a {
                            color: #b3bac1;
                        }
                        .tag-class {
                            padding: 0.38rem 0;
                            font-size: 12px;
                            text-align: center;
                            line-height: 1;
                            border-radius: 2px;
                            min-width: 0;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            color: #b3bac1;
                            &:after {
                                content: '/';
                                color: #b3bac1;
                                margin: 0 3px;
                            }
                            &:last-of-type {
                                &:after {
                                    content: '';
                                }
                            }
                        }
                    }
                    .item-icon {
                        display: inline-block;
                        font-size: 12px;
                        color: #b4b4b4;
                        &:hover {
                            color: #333;
                        }
                        i {
                            vertical-align: middle;
                        }
                        strong {
                            margin-left: 2px;
                            vertical-align: middle;
                            font-weight: normal;
                        }
                        &.like-article {
                            cursor: pointer;
                        }
                        &.like-article-off {
                            color: #00bb29;
                        }
                    }
                }
            }
        }
        .thumb {
            position: relative;
            -webkit-box-flex: 0;
            -ms-flex: 0 0 auto;
            flex: 0 0 auto;
            width: 7.5rem;
            height: 4.5rem;
            margin-left: 2rem;
            background-color: #fff;
            border-radius: 2px;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
        }
        &.article-list {
            padding-left: 0;
            padding-right: 0;
        }
        &.content-box-index {
            .thumb {
                width: 4.5rem;
                height: 4.5rem;
                border-radius: 10px;
            }
        }
    }
</style>
