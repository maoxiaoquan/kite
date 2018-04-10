module.exports = async (ctx) => {
  const title = 'sign_in'
  await ctx.render('default/sign_in', {
    title
  })
}