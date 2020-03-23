const multer = require('multer') // 加载nodemailer模块

// 文件上传

// 加载配置
const multerDefault = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  let fileFilter = (req: any, file: any, cb: any) => {
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
    destination: `static/upload/img-service/${year}/${month}`,
    // 修改文件名称
    filename: (req: any, file: any, callback: any) => {
      let fileFormat = file.mimetype.split('/')
      callback(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
  })

  // let storage = multer.memoryStorage()

  let limits = {
    fileSize: 1 * 1024 * 1024
  }

  return multer({
    storage,
    fileFilter,
    limits
  }).single('file')
}

export default multerDefault
