module.exports = async (ctx) => {
  const title = 'home'
  await ctx.render('default/index', {
    title
  })
}