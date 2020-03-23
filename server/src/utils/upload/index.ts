import upload from './defaultUpload'
const lowdb = require('../../../../db/lowdb/index')
export default async (req: any, res: any, next: any) => {
  const storage = lowdb
    .read()
    .get('storage')
    .value()
  let file: String = ''
  if (!storage.serviceProvider || storage.serviceProvider === 'default') {
    await upload()(req, res, next)
  } else if (storage.serviceProvider === 'qiniu') {
    req.file = '66666666'
    await next()
  }
}
