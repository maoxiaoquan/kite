module.exports = async (ctx) => {
  const title = 'writer'
  await ctx.render('default/writer', {
    title
  })
}