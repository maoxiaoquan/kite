import moment from 'moment'
// eslint-disable-next-line

exports.TimeDistance = async function (time: any) {
  let minuteDistance = moment().diff(time, 'minute')
  let hoursDistance = moment().diff(time, 'hours')
  let daysDistance = moment().diff(time, 'days')
  let _Time = await moment(time).format('YYYY-MM-DD')

  if (minuteDistance === 0) {
    return '刚刚'
  } else if (minuteDistance <= 60) {
    return `${minuteDistance}分钟前`
  } else if (hoursDistance <= 24) {
    return `${hoursDistance}小时前`
  } else if (daysDistance <= 30) {
    return `${daysDistance}天前`
  } else {
    return _Time
  }
}

exports.TimeNow = {
  time() {
    let date = new Date()
    return moment(date.setHours(date.getHours())).format()
  },
  timestamp() {
    let date = new Date()
    return moment(date.setHours(date.getHours())).format('X')
  },
  // 本周第一天
  showWeekFirstDay() {
    var Nowdate: any = new Date()
    var WeekFirstDay: any = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000)
    var M = Number(WeekFirstDay.getMonth()) + 1
    return WeekFirstDay.getFullYear() + '-' + M + '-' + WeekFirstDay.getDate()
  },
  // 本周最后一天
  showWeekLastDay() {
    var Nowdate: any = new Date()
    var WeekFirstDay: any = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000)
    var WeekLastDay: any = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000)
    var M = Number(WeekLastDay.getMonth()) + 1
    return WeekLastDay.getFullYear() + '-' + M + '-' + WeekLastDay.getDate()
  },
  //  本月第一天
  showMonthFirstDay() {
    var Nowdate: any = new Date()
    var MonthFirstDay: any = new Date(Nowdate.getFullYear(), Nowdate.getMonth(), 1)
    var M = Number(MonthFirstDay.getMonth()) + 1
    return MonthFirstDay.getFullYear() + '-' + M + '-' + MonthFirstDay.getDate()
  },

  // 本月最后一天
  showMonthLastDay() {
    var Nowdate: any = new Date()
    var MonthNextFirstDay: any = new Date(
      Nowdate.getFullYear(),
      Nowdate.getMonth() + 1,
      1
    )
    var MonthLastDay = new Date(MonthNextFirstDay - 86400000)
    var M = Number(MonthLastDay.getMonth()) + 1
    return MonthLastDay.getFullYear() + '-' + M + '-' + MonthLastDay.getDate()
  }
}
