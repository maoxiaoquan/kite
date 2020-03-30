const lowdb = require('../../../../db/lowdb/index')
import qiniuPut from './qiniuPut'
import aliyun from './aliyun'
import tengxun from './tengxun'
export default async (req: any, res: any, next: any) => {
  const storage = lowdb
    .read()
    .get('storage')
    .value()
  let fileFormat = req.file.mimetype.split('/')
  let destination = req.file.destination.split('static')[1]
  let filename = req.file.filename
  let filePath = `./${req.file.destination}/${filename}`
  if (!storage.serviceProvider || storage.serviceProvider === 'default') {
    let fileUrl: String = ''
    let origin = req.headers.origin
    if (storage.domain) {
      fileUrl = `${storage.domain}${destination}/${filename}`
    } else {
      fileUrl = `${origin}${destination}/${filename}`
    }
    req.fileUrl = fileUrl
  } else if (storage.serviceProvider === 'qiniu') { // 七牛上传
    try {
      const resFile: any = await qiniuPut(filename, filePath);
      const url = storage.domain + '/' + resFile.key;
      req.fileUrl = url
    } catch (e) {
      req.fileUrl = 'qiniu oss upload error'
    }
  } else if (storage.serviceProvider === 'aliyun') { // aliyun oss
    try {
      const resFile: any = await aliyun(filename, filePath);
      req.fileUrl = storage.domain + '/' + resFile.name;
    } catch (e) {
      req.fileUrl = 'aliyun oss upload error'
    }
  } else if (storage.serviceProvider === 'tengxun') { // tengxun cos
    try {
      const resFile: any = await tengxun(filename, filePath);
      req.fileUrl = resFile.Location
    } catch (e) {
      req.fileUrl = 'tengxun cos upload error'
    }
  }
  next()
}
