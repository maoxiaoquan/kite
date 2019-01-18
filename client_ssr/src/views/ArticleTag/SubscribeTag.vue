<template>
    <!--article-list-lay layout-content start-->
    <section class="subscribe-lay layout-content" id="subscribe-lay">
        <div class="container  box-container">

            <header class="list-header">
                <nav role="navigation" class="list-nav">
                    <ul class="nav-list">
                        <li class="nav-item <% if(Number(data.is_subscribe) === 1){ %>active <% } %>"><a
                                href="/subscribe/tag?is_subscribe=1">全部</a></li>
                        <!--class active-->
                        <%if(user_info.islogin){%>
                        <li class="nav-item <% if(Number(data.is_subscribe) === 2){ %>active <% } %>"><a
                                href="/subscribe/tag?is_subscribe=2">已关注</a></li>
                        <%}%>
                        <li class="nav-item search">
                            <form role="search" class="search-tag-from" method="get" action="/subscribe/tag">
                                <input maxlength="32" placeholder="搜索标签" required="true" name="tag_name"
                                       class="search-tag-input">
                                <button class="search-tag-btn"><i class="iconfont icon-search"></i></button>
                            </form>
                        </li>
                    </ul>
                </nav>
                <% if(data.tag_name){ %>
                <p>搜索文章标签:
                    <%= data.tag_name %> 结果有
                    <%= data.count %> 条</p>
                <% } %>
            </header>

            <ul class="row tag-list">
                <% data.article_tag_list.forEach(function (item, key) { %>
                <li class="item  col-xs-12 col-sm-3 col-md-3 ">
                    <div class="tag">
                        <div class="info-box">
                            <a href="/tag/<%= item.article_tag_id %>" rel="">
                                <%if(item.article_tag_icon_type==='1'){%>
                                <div class="lazy thumb thumb loaded"
                                     style="background-image: url('<%= item.article_tag_icon %>'); background-size: contain;"></div>
                                <%}else{%>
                                <div class="tag-icon"><i class="iconfont <%= item.article_tag_icon %>"></i></div>
                                <%}%>
                                <div class="title">
                                    <%= item.article_tag_name %>
                                </div>
                            </a>
                            <div class="meta-box">
                                <div class="meta article">
                                    <%=item.article_count%> 篇文章
                                </div>
                                <div class="meta subscribe">
                                    <%=item.subscribe_count%> 人关注
                                </div>
                            </div>
                        </div>
                        <% if(user_info.islogin){ %>
                        <div class="action-box">

                            <% if(data.subscribe_article_tag.indexOf(item.article_tag_id) === -1){ %>
                            <button data-tag-id="<%= item.article_tag_id %>" class="subscribe-btn not-subscribe">关注
                            </button>
                            <% }else { %>
                            <button data-tag-id="<%= item.article_tag_id %>" class="subscribe-btn already-subscribe">已关注
                            </button>
                            <% } %>

                        </div>
                        <% } %>
                    </div>
                </li>
                <% }) %>
            </ul>

            <!--PAGE.html start-->
            <% include pages/subscribe_page.html %>
            <!--PAGE.html end-->
        </div>
    </section>
    <!--article-list-lay layout-content end-->
</template>

<script>
  export default {
    name: 'SubscribeTag'
  }
</script>

<style scoped lang="scss">
    .subscribe-lay.layout-content {
        .list-header {
            padding: 0.5rem 0.4rem;
            .article-type {
                .article-topic {
                    display: inline-block;
                }
                .article-tag {
                    display: inline-block;
                }
            }
            .list-nav {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                .nav-list {
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    line-height: 1;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: end;
                    -ms-flex-pack: end;
                    justify-content: flex-end;
                    -ms-flex-wrap: wrap;
                    flex-wrap: wrap;
                    .nav-item {
                        position: relative;
                        cursor: pointer;
                        &.active a,
                        a:hover {
                            color: #007fff;
                        }
                        .search-tag-from {
                            position: relative;
                            .search-tag-input {
                                padding: 0.3rem;
                                font-size: 0.9rem;
                                border: 1px solid hsla(0, 0%, 59%, 0.2);
                                outline: none;
                            }
                            .search-tag-btn {
                                padding: 3px 10px;
                                background: #fff;
                                border: none;
                                border-radius: 3px;
                                position: absolute;
                                right: 1px;
                                top: 1px;
                                outline: 0;
                            }
                        }
                    }
                    .nav-item {
                        padding: 1rem 0.6rem;
                        margin-left: 0.8rem;
                        font-size: 1rem;
                        white-space: nowrap;
                    }
                }
            }
        }
        .tag-list {
            .item {
                margin-bottom: 1.3rem;
                padding: 0 0.7rem;
                box-sizing: border-box;
                .tag {
                    width: 100%;
                    background-color: #fff;
                    border: 1px solid #f1f1f1;
                    transition: border-color 0.3s;
                    text-align: center;
                    padding: 15px 0 30px;
                    .thumb {
                        width: 100%;
                        height: 32px;
                        margin: 10px auto 15px;
                        background-color: #fff;
                        background-position: 50%;
                        background-repeat: no-repeat;
                    }
                    .tag-icon {
                        width: 100%;
                        height: 32px;
                        margin: 10px auto 15px;
                        i {
                            font-size: 28px;
                        }
                    }
                    .title {
                        font-size: 1.2rem;
                        line-height: 1.5rem;
                        color: #333;
                    }
                    .meta-box {
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-pack: center;
                        -ms-flex-pack: center;
                        justify-content: center;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        align-items: center;
                        font-size: 0.8rem;
                        color: #909090;
                        .meta {
                            display: inline-block;
                            margin: 10px 5px 0;
                        }
                    }
                    .subscribe-btn {
                        margin: 1rem auto 0;
                        font-size: 0.8rem;
                        background-color: #fff;
                        border-radius: 2px;
                        padding: 0.4rem 1rem;
                        outline: none;
                        transition: background-color 0.3s, color 0.3s;
                        cursor: pointer;
                        &.not-subscribe {
                            border: 1px solid #37c700;
                            color: #37c700;
                        }
                        &.already-subscribe {
                            border: 1px solid #cccccc;
                            color: #999999;
                        }
                    }
                }
            }
        }
    }
</style>
