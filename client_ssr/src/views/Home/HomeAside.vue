<template>
    <div class="home-lay layout-aside">


        <div class="aside-component">
            <h3>写下你想说的</h3>
            <div class="issue-btn">
                <a href="/writer" class="btn-note" id="js-btn-note"><i class="iconfont icon-xiezuo"></i>写文章</a>
                <!--<span class="middle-line"></span>
                <a href="/daily_recommend" class="btn-dynamic js-publish-btn">发说说</a>-->
            </div>
        </div>


        <!--<div class="publish-article">
            <h3>写下你想说的</h3>
            <div class="issue-btn">
                <a href="/writer" class="btn-note" id="js-btn-note">写文章</a>
                <span class="middle-line"></span>
                <a href="/daily_recommend" class="btn-dynamic js-publish-btn">每日推荐</a>
            </div>
        </div>-->

        <a class="download clearfix">
            <img class="qrcode" src="/default/img/download.png" alt="Download index side qrcode">
            <div class="info">
                <div class="description">下载FATA手机App随时随地发现和创作内容</div>
            </div>
        </a>


        <div class="website-information">

            <ul class="more-list">
                <li class="item"><a href="/about" target="_blank">关于</a></li>
                <li class="item"><a href="/links" target="_blank">友情链接</a></li>
                <li class="item"><a href="/feedback" target="_blank">建议反馈</a></li>
                <li class="item"><a href="https://bd.juejin.im?utm_campaign=bd&amp;utm_source=web&amp;utm_medium=more"
                                    target="_blank">商务合作</a></li>
            </ul>
            <ul class="more-list">
                <li class="item"><a href="http://www.miibeian.gov.cn" target="_blank">津ICP备15003202号-2</a>
                </li>
            </ul>
            <ul class="more-list">
                <li class="item"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802026719"
                                    target="_blank">京公网安备11010802026719号</a></li>
            </ul>
            <ul class="more-list">
                <li class="item"><a>©2018 掘金</a></li>
            </ul>

        </div>

    </div>
</template>

<script>
  export default {
    name: 'HomeAside'
  }
</script>

<style scoped lang="scss">
    .layout-aside {
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
        .download {
            margin-bottom: 20px;
            display: block;
            padding: 10px 20px;
            font-size: 14px;
            width: 100%;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            background-color: #fff;
            .qrcode {
                width: 60px;
                height: 60px;
                display: block;
                float: left;
                opacity: 0.85;
            }
            .info {
                margin-left: 70px;
            }
        }
        .website-information {
            ul {
                display: block;
                li {
                    display: inline-block;
                    font-size: 12px;
                    &.item:not(:last-child):after {
                        content: '\B7';
                        margin: 0 5px;
                        color: #c6cfda;
                    }
                    a {
                        color: #999999;
                    }
                }
            }
        }
    }
</style>
