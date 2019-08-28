class Share {
  // 分享到新浪
  static shareToXl (title, url, picurl) {
    var sharesinastring =
      'http://v.t.sina.com.cn/share/share.php?title=' +
      title +
      '&url=' +
      url +
      '&content=utf-8&sourceUrl=' +
      url +
      '&pic=' +
      picurl
    window.open(
      sharesinastring,
      'newwindow',
      'height=400,width=400,top=100,left=100'
    )
  }

  // 分享到qq空间
  static shareToQq (title, url, picurl) {
    var shareqqzonestring =
      'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' +
      title +
      '&url=' +
      url +
      '&pics=' +
      picurl
    window.open(
      shareqqzonestring,
      'newwindow',
      'height=400,width=400,top=100,left=100'
    )
  }

  // 分享到qq
  static shareQQ (title, url, picurl) {
    var shareqqzonestring = `https://connect.qq.com/widget/shareqq/index.html?url=${url}?sharesource=qzone&title=${title}&pics=${picurl}&summary=${title}`
    window.open(
      shareqqzonestring,
      'newwindow',
      'height=400,width=400,top=100,left=100'
    )
  }
}

export default Share
