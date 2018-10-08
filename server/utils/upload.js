const multer = require('koa-multer')//加载koa-multer模块
const path = require('path')

//文件上传

//加载配置
module.exports = (type) => {

  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  let destination_url = {
    user_avatar: `static/upload/web/user_avatar/${year}/${month}`,
    user: 'static/upload/web/user/',
    admin: 'static/upload/admin/',
    admin_swiper: `static/upload/admin/swiper/${year}/${month}`
  }

  return multer({
    storage: multer.diskStorage({
      //文件保存路径
      destination: destination_url[type],
      //修改文件名称
      filename: function (req, file, callback) {
        let fileFormat = (file.originalname).split('.')
        callback(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
      }
    })
  })
}