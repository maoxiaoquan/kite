<template>
    <!--article-list-lay layout-content start-->
    <section class="tag-lay layout-content">
        <div class="container">
            <div class="row">

                <div class="col-xs-12 col-sm-12 col-md-12">
                    <div class="article-list">
                        <div class="main-top">

                            <%if(data.article_tag.article_tag_icon_type==='1'){%>
                            <div class="tag-img-icon"
                                 style="background-image: url('<%= data.article_tag.article_tag_icon %>'); background-size: contain;"></div>
                            <%}else{%>
                            <div class="tag-font-icon"><i class="iconfont <%= data.article_tag.article_tag_icon %>"></i>
                            </div>
                            <%}%>

                            <div class="title">
                                <a class="name" href="/c/e048f1a72e3d">
                                    <%=data.article_tag.article_tag_name%></a>
                            </div>
                            <div class="info">
                                收录了
                                <%=data.count%> 篇文章 ·
                                <%=data.subscribe_count%> 人关注
                            </div>
                        </div>
                        <ul class="trigger-menu">
                            <!-- <li class=""><a href="/"><i class="iconfont ic-latestcomments"></i> 最新评论</a></li>-->
                            <li class="active"><a href="/"><i class="iconfont ic-articles"></i> 最新收录</a></li>
                            <!-- <li class=""><a href="/"><i class="iconfont ic-hot"></i> 热门</a></li>-->
                        </ul>
                        <div class="list-container">
                            <ul>
                                <% data.article_list.forEach(function (item, key) { %>
                                <li>
                                    <article class="content-box article-list">
                                        <div class="info-box">
                                            <div class="info-row title-row">
                                                <a href="/article/<%= item.aid %>" class="title" target="_blank">
                                                    <%= item.title %></a>
                                            </div>
                                            <div class="content-text">
                                                <%- item.excerpt %>
                                            </div>
                                            <div class="info-row meta-row">
                                                <ul class="meta-list">
                                                    <li class="item username clickable">
                                                        <a href="/user/<%=item.uid%>/article/all">
                                                            <%= item.user.nickname %></a>
                                                    </li>
                                                    <li class="item">
                                                        <%= item.create_at %>
                                                    </li>
                                                    <li class="item">
                                                        <%= item.like_count %> 喜欢
                                                    </li>
                                                    <li class="item">
                                                        <%= item.comment_count %> 评论
                                                    </li>
                                                    <% if(item.tag_ids){ %>
                                                    <li class="item">
                                                        <% item.tag_ids.split(',').forEach(function (item, key) { %>
                                                        <%
                                                        data.tag_all.forEach(function (tag_all_item, tag_all_key) {
                                                        if (tag_all_item.article_tag_id == item) {
                                                        %>
                                                        <a class="tag-class frontend" href="">
                                                            <%= tag_all_item.article_tag_name %>
                                                        </a>
                                                        <%
                                                        }}) %>
                                                        <% }) %>
                                                    </li>
                                                    <% } %>
                                                </ul>
                                            </div>
                                        </div>
                                        <% if(item.cover_img){ %>
                                        <div class="lazy thumb thumb loaded"
                                             style="background-image: url('<%= item.cover_img %>'); background-size: cover;">
                                        </div>
                                        <% } %>
                                    </article>
                                </li>
                                <% }) %>
                            </ul>


                            <!--PAGE.html start-->
                            <% include pages/tag_page.html %>
                            <!--PAGE.html end-->
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!--article-list-lay layout-content end-->
</template>

<script>
  export default {
    name: 'ArticleTag'
  }
</script>

<style scoped lang="scss">
    .tag-lay.layout-content {
        padding-bottom: 50px;
        .main-top {
            margin-top: 30px;
            margin-bottom: 10px;
            text-align: center;

            .tag-img-icon {
                width: 80px;
                height: 80px;
                display: inline-block;
                background-color: #fff;
                background-position: 50%;
                background-repeat: no-repeat;
            }
            .tag-font-icon {
                display: inline-block;
                width: 80px;
                height: 80px;
                line-height: 80px;
                i {
                    font-size: 35px;
                }
            }

            .title {
                padding: 10px 0 0 0;
                .name {
                    display: inline;
                    font-size: 21px;
                    font-weight: 700;
                    vertical-align: middle;
                }
            }
            .info {
                margin-top: 10px;
                font-size: 14px;
                color: #969696;
            }
        }
        .trigger-menu {
            margin-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0;
            list-style: none;
            li {
                position: relative;
                display: inline-block;
                padding: 8px 0;
                margin-bottom: -1px;
                a {
                    padding: 13px 20px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #969696;
                    line-height: 25px;
                }
                &.active {
                    border-bottom: 2px solid #646464;
                }
            }
        }
        .list-container {
            > ul {
                > li {
                    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
    }

</style>
