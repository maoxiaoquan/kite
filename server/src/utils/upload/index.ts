import upload from './defaultUpload'
const lowdb = require('../../../../db/lowdb/index')
const storage = lowdb
  .read()
  .get('storage')
  .value()
export default async (req: any, res: any, next: any) => {
  let file: String = ''
  const { type } = req.body
  console.log('storage.serviceProvider', storage.serviceProvider)
  if (!storage.serviceProvider || storage.serviceProvider === 'default') {
    await upload('avatarImg')(req, res, next)
  } else {
    req.file = '66666666'
    await next()
  }
}

