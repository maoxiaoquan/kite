"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const COS = require('cos-nodejs-sdk-v5');
const lowdb = require('../../../../db/lowdb/index');
const storage = lowdb
    .read()
    .get('storage')
    .value();
const cos = new COS({
    SecretId: storage.accessKey,
    SecretKey: storage.secretKey
});
const cosOpts = {
    Bucket: storage.bucket,
    Region: storage.region,
    StorageClass: 'STANDARD'
};
// 七牛云文件上传
const tengxunCos = (key, localFile) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            cos.putObject(Object.assign(Object.assign({}, cosOpts), { Key: key, Body: fs_1.default.createReadStream(localFile) }), (err, data) => {
                if (err) {
                    reject('error');
                }
                fs_1.default.unlinkSync(localFile);
                resolve(data);
            });
        }
        catch (err) {
            reject('error');
        }
    }));
};
exports.default = tengxunCos;
