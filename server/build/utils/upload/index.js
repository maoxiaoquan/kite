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
const lowdb = require('../../../../db/lowdb/index');
const qiniuPut_1 = __importDefault(require("./qiniuPut"));
const aliyun_1 = __importDefault(require("./aliyun"));
const tengxun_1 = __importDefault(require("./tengxun"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = lowdb
        .read()
        .get('storage')
        .value();
    let fileFormat = req.file.mimetype.split('/');
    let destination = req.file.destination.split('static')[1];
    let filename = req.file.filename;
    let filePath = `./${req.file.destination}/${filename}`;
    if (!storage.serviceProvider || storage.serviceProvider === 'default') {
        let fileUrl = '';
        let origin = req.headers.origin;
        if (storage.domain) {
            fileUrl = `${storage.domain}${destination}/${filename}`;
        }
        else {
            fileUrl = `${origin}${destination}/${filename}`;
        }
        req.fileUrl = fileUrl;
    }
    else if (storage.serviceProvider === 'qiniu') { // 七牛上传
        try {
            const resFile = yield qiniuPut_1.default(filename, filePath);
            const url = storage.domain + '/' + resFile.key;
            req.fileUrl = url;
        }
        catch (e) {
            req.fileUrl = 'qiniu oss upload error';
        }
    }
    else if (storage.serviceProvider === 'aliyun') { // aliyun oss
        try {
            const resFile = yield aliyun_1.default(filename, filePath);
            req.fileUrl = storage.domain + '/' + resFile.name;
        }
        catch (e) {
            req.fileUrl = 'aliyun oss upload error';
        }
    }
    else if (storage.serviceProvider === 'tengxun') { // tengxun cos
        try {
            const resFile = yield tengxun_1.default(filename, filePath);
            req.fileUrl = resFile.Location;
        }
        catch (e) {
            req.fileUrl = 'tengxun cos upload error';
        }
    }
    next();
});
