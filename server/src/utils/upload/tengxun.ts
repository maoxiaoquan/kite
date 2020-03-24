import fs from 'fs'
const COS = require('cos-nodejs-sdk-v5');
const lowdb = require('../../../../db/lowdb/index')
const storage = lowdb
  .read()
  .get('storage')
  .value()

const cos = new COS({
  SecretId: storage.accessKey,
  SecretKey: storage.secretKey
});

const cosOpts = {
  Bucket: storage.bucket, /* 必须 */
  Region: storage.region,    /* 必须 */
  StorageClass: 'STANDARD'
}

// 七牛云文件上传
const tengxunCos = (key: any, localFile: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      cos.putObject({
        ...cosOpts,
        Key: key,              /* 必须 */
        Body: fs.createReadStream(localFile), // 上传文件对象
      }, (err: any, data: any) => {
        if (err) {
          reject('error');
        }
        fs.unlinkSync(localFile);
        resolve(data);
      });
    } catch (err) {
      reject('error');
    }

  });
}

export default tengxunCos