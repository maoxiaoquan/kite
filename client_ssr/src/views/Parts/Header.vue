<template>
  <!--header start-->
  <div class="main-header" id="main-header">
    <header class="navbar  navbar-visible" id="header-view">
      <div class="container navbar-view">
        <!--<a class="navbar-brand" href="#"><img class="logo" src="/default/img/logo22.svg" alt=""></a>-->
        <a class="navbar-brand logo-text" href="/">Kite</a>

        <div class="collapse navbar-collapse">
          <ul class="navbar-item-content mr-auto">
            <li class="navbar-menu-content active">
              <div class="navbar-toggler">
                <i class="iconfont icon-viewgallery"></i>
              </div>
              <ul class="navbar-menu">
                <li class="nav-item">
                  <a class="nav-link" href="/">
                    <i class="iconfont icon-zhuye" style="color: #00D0B2;"></i>主页
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/user/<%= user_info.uid %>/message">
                    <i style="color: #FE385F;" class="iconfont icon-icon-test"></i>
                    消息
                    <span></span>
                  </a>
                </li>
              </ul>
            </li>
            <!--  <li class="nav-item"><a class="nav-link" href="/">说说</a></li>-->
            <li class="nav-item search">
              <form class="form-inline mr-lg-5" method="get" action="/search">
                <div class="form-search">
                  <input class="form-control form-search-view" type="text" required="true" name="search"
                         placeholder="搜索文章" aria-label="Search">
                  <button class="search-btn"><i class="iconfont icon-search"></i></button>
                </div>
              </form>
            </li>
            <li class="nav-item"><a class="btn btn-sm btn-outline-warning xiezuo" href="/writer"><i
              class="iconfont icon-xiezuo"></i></a></li>
            <li class="nav-item dropdown">
              <a class="dropdown-toggle" href="javascript:;">
                <div class="avatar-img" style="background-image:url('/default/img/default_avatar.jpg') "></div>
              </a>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="/user/<%= user_info.uid %>/article/all">我的主页</a>
                <a class="dropdown-item" href="/user/settings/profile">设置</a>
                <a class="dropdown-item" href="/esc_sign_in">退出</a>
              </div>
            </li>
            <li class="nav-item" @click="show_login"><a class="btn btn-info btn-sm sign-btn btn-block"
                                                        href="javascript:;">登录</a></li>
            <li class="nav-item" @click="show_register"><a class="btn btn-danger btn-sm sign-btn btn-outline-warning"
                                                           href="javascript:;">注册语雀</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </div>
  <!--header end-->
</template>

<script>
  export default {
    name: 'Header',
    methods: {
      show_login() {
        this.$store.commit('SET_IS_LOGIN', true)
      },
      show_register() {
        this.$store.commit('SET_IS_REGISTER', true)
      }
    }
  }
</script>

<style scoped lang="scss">
  .main-header {
    position: relative;
    height: 63px;
    .navbar-bootom-border {
      /* border: 1px solid transparent;
       border-color: #f0f0f0;*/
      z-index: 999;
      background: #fff;
      border-bottom: 1px solid #f1f1f1;
      /*  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);*/
      /*  -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); */
    }
    .header-visible {
      transform: translateZ(0);
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      transition: all .2s;
      transform: translate3d(0, -100%, 0);
      background: #fff;
      border-bottom: 1px solid #f1f1f1;
      color: #909090;
      height: 66px;
      z-index: 250;
      &.navbar-visible {
        transform: translateZ(0);
      }
      .navbar-view {
        display: flex;
        align-items: center;
        height: 100%;

        .navbar-brand {
          width: 100px;
          &.logo-text {
            font-size: 30px;
            color: #00bb29;
          }
        }
        .navbar-collapse {
          height: 100%;
          flex: 1 0 auto;
          .navbar-item-content {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: relative;
            height: 100%;
            margin: 0;
            .navbar-menu-content {
              display: flex;
              flex: 1;
              .navbar-menu {
                display: flex;
                justify-content: flex-start;
              }
            }
            .navbar-toggler {
              display: none;
            }
            .nav-item {
              position: relative;
              padding: 0 15px;
              font-size: 16px;
              margin: 0;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              i {
                display: inline-block;
                margin-right: 5px;
                font-weight: bold;
              }
              &.search {
                .form-search {
                  border: 1px solid hsla(0, 0%, 59.2%, .2);
                  background-color: rgba(227, 231, 236, .2);
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  border-radius: 2px;
                  .form-search-view {
                    border: none;
                    padding: 6px 10px;
                    box-shadow: none;
                    outline: none;
                    font-size: 12px;
                    color: #666;
                    background-color: transparent;
                  }
                  .search-btn {
                    border: none;
                    padding: 0 8px;
                    background-color: transparent;
                  }
                }
              }
              &.dropdown {
                position: relative;
                .avatar-img {
                  display: inline-block;
                  position: relative;
                  background-position: 50%;
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-color: #eee;
                  width: 36px;
                  height: 36px;
                }
                .dropdown-toggle {
                  height: 36px;
                  border-radius: 72px;
                  overflow: hidden;
                }
                .dropdown-menu {
                  position: absolute;
                  top: 100%;
                  right: 0;
                  z-index: 1000;
                  display: none;
                  padding: 5px 0;
                  margin: 2px 0 0;
                  list-style: none;
                  font-size: 14px;
                  text-align: left;
                  background-color: #fff;
                  border: 1px solid transparent;
                  border-radius: 4px;
                  background-clip: padding-box;
                  margin-top: 0;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
                  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .1));
                  -webkit-filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .1));
                  > a {
                    display: block;
                    padding: 10px 20px;
                    clear: both;
                    font-weight: 400;
                    line-height: 1.42857;
                    color: #333;
                    white-space: nowrap;
                    &:hover {
                      background-color: #f5f5f5;
                    }
                  }

                  &.show {
                    display: block;
                  }
                }
              }
            }
          }
        }
      }
    }

  }
</style>
