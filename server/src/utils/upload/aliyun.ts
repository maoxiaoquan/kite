import OSS from 'ali-oss'
import fs from 'fs'
const lowdb = require('../../../../db/lowdb/index')
const storage = lowdb
  .read()
  .get('storage')
  .value()

const client = new OSS({
  accessKeyId: storage.accessKey || 'test', // {String}：通过阿里云控制台创建的AccessKey。
  accessKeySecret: storage.secretKey || 'test', // {String}：通过阿里云控制台创建的AccessSecret。
  //  stsToken: '', // {String}：使用临时授权方式，详情请参见使用 STS 进行临时授权。
  bucket: storage.bucket || '', // {String}：通过控制台或PutBucket创建的bucket。
  endpoint: storage.domain || '', // {String}：OSS域名。
  region: storage.region || 'oss-cn-hangzhou' // {String}：bucket所在的区域， 默认oss-cn-hangzhou。
  //internal: false,  // {Boolean}：是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用。
  //cname: false, // {Boolean}：是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定。
  //secure: false, // {Boolean}：(secure: true)则使用HTTPS，(secure: false)则使用HTTP，详情请查看常见问题。
  //timeout: 60// {String|Number}：超时时间，默认60s。
})

// 阿里云文件上传
const aliyunPut = (key: any, localFile: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.put(key, localFile)
      fs.unlinkSync(localFile)
      console.log('result', result)
      //  console.log('result', result)
      resolve(result)
    } catch (err) {
      console.log('err', err)
      reject('error')
    }
  })
}

export default aliyunPut
