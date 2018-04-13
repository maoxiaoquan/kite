module.exports = async (ctx) => {
  const title = 'article_list'
  await ctx.render('default/article_list', {
    title
  })
}