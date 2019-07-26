async function update () {
  try {
    console.log('正在升级中，当前版本是0.2....')
    console.log('0.2版本升级完成')
    process.exit()
  } catch (err) {
    console.log('出现错误', err)
  }
}
update()
