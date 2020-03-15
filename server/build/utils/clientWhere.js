"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Op = require('sequelize').Op;
const constant_1 = require("./constant");
module.exports = {
    article: {
        otherList: {
            [Op.or]: [
                { status: constant_1.statusList.reviewSuccess },
                { status: constant_1.statusList.freeReview } // 免审核
            ]
        },
        otherView: {
            [Op.or]: [
                { status: constant_1.statusList.pendingReview },
                { status: constant_1.statusList.reviewSuccess },
                { status: constant_1.statusList.freeReview } // 免审核
            ]
        },
        me: {
            [Op.or]: [
                { status: constant_1.statusList.pendingReview },
                { status: constant_1.statusList.reviewSuccess },
                { status: constant_1.statusList.freeReview },
                { status: constant_1.statusList.reviewFail } // 审核失败
            ]
        },
        isPublic: true
    },
    comment: {
        [Op.or]: [
            { status: constant_1.statusList.pendingReview },
            { status: constant_1.statusList.reviewSuccess },
            { status: constant_1.statusList.freeReview },
            { status: constant_1.statusList.reviewFail } // 审核失败
        ]
    },
    dynamic: {
        myQuery: {
            status: {
                [Op.or]: [
                    constant_1.statusList.reviewSuccess,
                    constant_1.statusList.freeReview,
                    constant_1.statusList.pendingReview,
                    constant_1.statusList.reviewFail
                ]
            }
        }
    }
};
