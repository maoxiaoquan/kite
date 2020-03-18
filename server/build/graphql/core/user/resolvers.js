"use strict";
// example data
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
const models = require('../../models');
exports.Query = {
    userInfo(_, { uid }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield models.user.userInfo(uid);
            return userInfo;
        });
    },
    userUnreadCount(_, { uid }, { islogin, user }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (islogin) {
                const Count = yield models.user.userUnreadCount(user.uid);
                return Count;
            }
            else {
                return {
                    messageCount: 0,
                    attentionCount: 0,
                    privateChatCount: 0
                };
            }
        });
    },
    userUnreadList(_, { page, pageSize }, { islogin, user }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (islogin) {
                const AttentionMsg = yield models.user.unreadAttentionMsg({
                    page,
                    pageSize,
                    uid: user.uid
                });
                return AttentionMsg;
            }
            else {
                return {
                    count: 0,
                    list: [],
                    page: 0,
                    pageSize: 0
                };
            }
        });
    },
    thumbUserList(_, { type, associate_id }, { islogin }) {
        return __awaiter(this, void 0, void 0, function* () {
            const thumbUserList = yield models.user.getThumbUserList({
                type,
                associate_id
            });
            return thumbUserList || [];
        });
    }
};
exports.Mutation = {};
exports.Schema = {};
