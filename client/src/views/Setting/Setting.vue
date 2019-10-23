<template>
  <client-only>
    <!--article-list-lay layout-content start-->
    <section class="user-setting-lay layout-content"
             id="user-setting-profile">
      <div class="container box-container">
        <div class="row">

          <div class="col-xs-12 col-sm-4 col-md-4">
            <div class="user-setting-aside client-card">
              <h2 class="title"><i class="el-icon-setting"></i>设置</h2>
              <ul class="setting-tap-list">
                <li>
                  <router-link :to='{name:"settingProfile"}'
                               class="dropdown-item">
                    <i class="el-icon-user-solid"></i>个人资料
                  </router-link>
                </li>
                <li>
                  <router-link :to='{name:"settingResetPassword"}'
                               class="dropdown-item">
                    <i class="el-icon-lock"></i> 密码修改
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-xs-12 col-sm-8 col-md-8">
            <router-view />
          </div>
        </div>
      </div>

    </section>
  </client-only>
  <!--article-list-lay layout-content end-->
</template>

<script>
import ClientOnly from 'vue-client-only'
export default {
  name: 'Setting',
  metaInfo () {
    return {
      title: '个人设置',
      htmlAttrs: {
        lang: 'zh'
      }
    }
  },
  created () {
    if (!this.personalInfo.islogin) {
      this.$router.push({ name: 'home' })
    }
  },
  computed: {
    personalInfo () { // 登录后的个人信息
      return this.$store.state.personalInfo || {}
    }
  },
  components: {
    ClientOnly
  }
}
</script>

<style scoped lang="scss">
.user-setting-lay.layout-content {
  .user-setting-aside {
    // box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
    // background: #ffffff;
    // border-radius: 5px;
    padding: 10px 0;
    .title {
      padding: 10px 20px;
      font-weight: bold;
      i {
        margin-right: 15px;
        font-size: 18px;
      }
    }
    .setting-tap-list {
      display: block;
      li {
        a {
          display: block;
          padding: 10px 20px;
          font-size: 14px;
          i {
            margin-right: 15px;
            font-size: 18px;
          }
          &:hover {
            color: #f46e65;
          }
          &.current-active {
            color: #f46e65;
          }
        }
      }
    }
  }
}

@media (max-width: 575px) {
  body {
    .user-setting-aside {
      margin-bottom: 30px;
    }
  }
}
</style>
