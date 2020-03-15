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
Object.defineProperty(exports, "__esModule", { value: true });
const { resAdminJson } = require('../../utils/resData');
const upload = require('../../utils/upload'); // 上传工具类
class Picture {
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建标签
     * @param   {object} ctx 上下文对象
     */
    static uploadPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield upload('admin').single('file')(req, res, next);
                let destination = req.file.destination.split('static')[1];
                let filename = req.file.filename;
                let origin = req.header.origin;
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        filename: `${origin}${destination}/${filename}` // 返回文件名
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
}
exports.default = Picture;
