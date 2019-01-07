<template>
  <div class="sign-view card">
    <div class="title">
      <a href="/sign_in">登录</a>
      <b>·</b>
      <a class="active" href="/sign_up">注册</a>
    </div>
    <div class="js-sign-in-container">
      <form id="sign-up" accept-charset="UTF-8" method="post">
        <!-- 正常登录登录名输入框 -->
        <div class="input-prepend restyle js-normal">
          <input placeholder="你的昵称" type="text" class="nickname" name="nickname">
          <i class="iconfont icon-account"></i>
        </div>

        <div class="input-prepend email-view">
          <input placeholder="邮箱(暂时只支持邮箱，后续开放手机)" type="text" class="send-email-input account" name="account">
          <i class="iconfont icon-phone"></i>
          <button class="btn-send-email-code btn" type="button">发送验证码</button>
        </div>

        <div class="input-prepend email-view-code">
          <input placeholder="请输入验证码" type="text" class="send-email-code code" name="account">
          <i class="iconfont icon-yanzhengma"></i>
        </div>

        <div class="input-prepend">
          <input placeholder="密码" type="password" class="password" name="password">
          <i class="iconfont icon-mima"></i>
        </div>

        <div class="input-prepend">
          <input placeholder="重复密码" type="double_password" class="double_password" name="double_password">
          <i class="iconfont icon-mima"></i>
        </div>

        <button class="sign-up-button" type="button">
          注册
        </button>
      </form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li><a class="weibo" href="javascript:alert(暂未开放，请等待后续开放);"><i
            class="iconfont icon-xinlang"></i></a></li>
          <li><a class="weixin" target="_blank" href="javascript:alert(暂未开放，请等待后续开放);"><i
            class="iconfont icon-iconfontweixin"></i></a></li>
          <li><a class="qq" target="_blank" href="javascript:alert(暂未开放，请等待后续开放);"><i
            class="iconfont icon-qq"></i></a></li>
        </ul>

        <div class="weibo-geetest-captcha"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SignIn',
    asyncData({ store, route }) {
      // 触发 action 后，会返回 Promise
      store.registerModule('sign', import('./module'))
      return store.dispatch('getUserInfo', 100000)
    },
    destroyed() {
      this.$store.unregisterModule('sign')
    },
  }
</script>

