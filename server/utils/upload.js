const multer = require('koa-multer') // 加载koa-multer模块

// 文件上传

// 加载配置
module.exports = type => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  let destination_url = {
    avatarImg: `static/upload/avatar-img-service/${year}/${month}`,
    articleImg: `static/upload/article-img-service/${year}/${month}`,
    admin: `static/upload/admin-img-service/${year}/${month}`,
    dynamic: `static/upload/dynamic-img-service/${year}/${month}`
  }

  let fileFilter = (ctx, file, cb) => {
    // 过滤文件
    let ImgLimitType = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png']
    if (~ImgLimitType.indexOf(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }

  let storage = multer.diskStorage({
    // 文件保存路径
    destination: destination_url[type],
    // 修改文件名称
    filename: function (req, file, callback) {
      let fileFormat = file.mimetype.split('/')
      callback(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
  })

  let limits = {
    fileSize: 1 * 1024 * 1024
  }

  return multer({
    storage,
    fileFilter,
    limits
  })
}
