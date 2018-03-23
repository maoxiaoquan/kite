
/**
 * 登录操作
 * @param  {obejct} ctx 上下文对象
 * @param  {number} status 状态码，必填
 * @param  {date} date 返回的数据
 */
module.exports = (ctx, date, status) => {
  let sts = status || 200
  ctx.response.status = sts
  ctx.body = {
    data: date
  }
}