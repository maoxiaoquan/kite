module.exports = async (ctx) => {
  const title = 'sign_up'
  await ctx.render('default/sign_up', {
    title
  })
}