module.exports = async (ctx) => {
  const title = 'article'
  await ctx.render('default/article', {
    title
  })
}