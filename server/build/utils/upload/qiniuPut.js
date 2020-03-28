"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu_1 = __importDefault(require("qiniu"));
const fs_1 = __importDefault(require("fs"));
const lowdb = require('../../../../db/lowdb/index');
const storage = lowdb
    .read()
    .get('storage')
    .value();
// 获取七牛云 token
const qiniuToken = () => {
    const accessKey = storage.accessKey;
    const secretKey = storage.secretKey;
    const mac = new qiniu_1.default.auth.digest.Mac(accessKey, secretKey);
    const options = {
        scope: storage.bucket
    };
    const putPolicy = new qiniu_1.default.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
};
// 七牛云文件上传
const qiniuPut = (key, localFile) => {
    const uploadToken = qiniuToken();
    const config = new qiniu_1.default.conf.Config();
    // 空间对应的机房
    if (storage.zone === 'Zone_z0') {
        config.zone = qiniu_1.default.zone.Zone_z0;
    }
    else if (storage.zone === 'Zone_z1') {
        config.zone = qiniu_1.default.zone.Zone_z1;
    }
    else if (storage.zone === 'Zone_z2') {
        config.zone = qiniu_1.default.zone.Zone_z2;
    }
    else if (storage.zone === 'Zone_na0') {
        config.zone = qiniu_1.default.zone.Zone_na0;
    }
    const formUploader = new qiniu_1.default.form_up.FormUploader(config);
    const putExtra = new qiniu_1.default.form_up.PutExtra();
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
            fs_1.default.unlinkSync(localFile);
            if (respErr) {
                reject(respErr);
            }
            else {
                resolve(respBody);
            }
        });
    });
};
exports.default = qiniuPut;
