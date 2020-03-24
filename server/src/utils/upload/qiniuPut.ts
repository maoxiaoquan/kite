import qiniu from 'qiniu'
import fs from 'fs'
const lowdb = require('../../../../db/lowdb/index')
const storage = lowdb
  .read()
  .get('storage')
  .value()
// 获取七牛云 token
const qiniuToken = () => {
  const accessKey = storage.accessKey;
  const secretKey = storage.secretKey;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const options = {
    scope: storage.bucket
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  return uploadToken;
};

// 七牛云文件上传
const qiniuPut = (key: any, localFile: any) => {
  const uploadToken = qiniuToken();
  const config: any = new qiniu.conf.Config();
  // 空间对应的机房
  if (storage.zone === 'Zone_z0') {
    config.zone = qiniu.zone.Zone_z0;
  } else if (storage.zone === 'Zone_z1') {
    config.zone = qiniu.zone.Zone_z1;
  } else if (storage.zone === 'Zone_z2') {
    config.zone = qiniu.zone.Zone_z2;
  } else if (storage.zone === 'Zone_na0') {
    config.zone = qiniu.zone.Zone_na0;
  }
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
      fs.unlinkSync(localFile);
      if (respErr) {
        reject(respErr);
      } else {
        resolve(respBody);
      }
    });
  });
}

export default qiniuPut