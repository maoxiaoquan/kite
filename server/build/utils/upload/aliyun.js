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
const ali_oss_1 = __importDefault(require("ali-oss"));
const fs_1 = __importDefault(require("fs"));
const lowdb = require('../../../../db/lowdb/index');
const storage = lowdb
    .read()
    .get('storage')
    .value();
const client = new ali_oss_1.default({
    accessKeyId: storage.accessKey || 'test',
    accessKeySecret: storage.secretKey || 'test',
    //  stsToken: '', // {String}：使用临时授权方式，详情请参见使用 STS 进行临时授权。
    bucket: storage.bucket || '',
    endpoint: storage.endPoint || '',
    region: storage.region || 'oss-cn-hangzhou',
});
// 阿里云文件上传
const aliyunPut = (key, localFile) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield client.put(key, localFile);
            fs_1.default.unlinkSync(localFile);
            console.log('result', result);
            //  console.log('result', result)
            resolve(result);
        }
        catch (err) {
            console.log('err', err);
            reject('error');
        }
    }));
};
exports.default = aliyunPut;
