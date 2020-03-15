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
const moment_1 = __importDefault(require("moment"));
// eslint-disable-next-line
exports.TimeDistance = function (time) {
    return __awaiter(this, void 0, void 0, function* () {
        let minuteDistance = moment_1.default().diff(time, 'minute');
        let hoursDistance = moment_1.default().diff(time, 'hours');
        let daysDistance = moment_1.default().diff(time, 'days');
        let _Time = yield moment_1.default(time).format('YYYY-MM-DD');
        if (minuteDistance === 0) {
            return '刚刚';
        }
        else if (minuteDistance <= 60) {
            return `${minuteDistance}分钟前`;
        }
        else if (hoursDistance <= 24) {
            return `${hoursDistance}小时前`;
        }
        else if (daysDistance <= 30) {
            return `${daysDistance}天前`;
        }
        else {
            return _Time;
        }
    });
};
exports.TimeNow = {
    time() {
        let date = new Date();
        return moment_1.default(date.setHours(date.getHours())).format();
    },
    timestamp() {
        let date = new Date();
        return moment_1.default(date.setHours(date.getHours())).format('X');
    },
    // 本周第一天
    showWeekFirstDay() {
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var M = Number(WeekFirstDay.getMonth()) + 1;
        return WeekFirstDay.getFullYear() + '-' + M + '-' + WeekFirstDay.getDate();
    },
    // 本周最后一天
    showWeekLastDay() {
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
        var M = Number(WeekLastDay.getMonth()) + 1;
        return WeekLastDay.getFullYear() + '-' + M + '-' + WeekLastDay.getDate();
    },
    //  本月第一天
    showMonthFirstDay() {
        var Nowdate = new Date();
        var MonthFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1);
        var M = Number(MonthFirstDay.getMonth()) + 1;
        return MonthFirstDay.getFullYear() + '-' + M + '-' + MonthFirstDay.getDate();
    },
    // 本月最后一天
    showMonthLastDay() {
        var Nowdate = new Date();
        var MonthNextFirstDay = new Date(Nowdate.getFullYear(), Nowdate.getMonth() + 1, 1);
        var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
        var M = Number(MonthLastDay.getMonth()) + 1;
        return MonthLastDay.getFullYear() + '-' + M + '-' + MonthLastDay.getDate();
    }
};
