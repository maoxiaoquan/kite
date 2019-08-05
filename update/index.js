#!/usr/bin/env node
require('shelljs/global')
const { lowdb } = require('../db/lowdb')
const kiteConfig = require('../kite.config')
const versionHistory = require('./versionHistory')
const inquirer = require('inquirer')
const colors = require('colors')
const config = lowdb
  .read()
  .get('config')
  .value()

const cli = lowdb
  .read()
  .get('cli')
  .value()

function isUpdateOption() {
  // 强制升级
  const promptList = [
    {
      type: 'confirm',
      message: '检测后可以升级，是否升级？',
      name: 'isUpdate',
      prefix: ''
    }
  ]

  inquirer.prompt(promptList).then(result => {
    if (result.isUpdate) {
      forcedUpgrade()
    } else {
      console.log(colors.red('取消升级'))
    }
    // gitPll()
  })
}

async function forcedUpgrade() {
  // 强制升级
  try {
    console.log('升级程序开始，请勿关闭当前程序')
    let currentVersionIndex = versionHistory.list.indexOf(config.version) // 当前版本索引
    let waitVersionIndex = versionHistory.list.indexOf(kiteConfig.version) // 待升级版本索引
    let versionIndex = waitVersionIndex - currentVersionIndex
    console.log(`当前程序版本和待升级版本差距${colors.red(versionIndex)}个版本`)
    console.log('升级进行中,请勿关闭当前程序...')
    for (let i = 1; i <= versionIndex; i++) {
      console.log(
        `解析升级文件:./version/${versionHistory.list[currentVersionIndex + i]}`
      )
      await require(`./version/${
        versionHistory.list[currentVersionIndex + i]
      }`).update()
      if (versionIndex === i) {
        console.log('恭喜您，版本升级完成，程序自动关闭')
        process.exit()
      }
    }
  } catch (err) {
    console.log('升级出现错误，程序自动中断...')
    console.log('请截图提供给程序提供者，解析当前错误所在')
    console.log('错误解释为：' + err)
    process.exit()
  }
}

function showAllVersion() {
  // 显示所有的版本历史
  versionHistory.list.map(item => {
    console.log(item)
  })
}

if (cli.is_success) {
  console.log('历史程序所有版本：')
  showAllVersion()
  console.log('>--当前可以升级的程序版本为：', colors.red(kiteConfig.version))
  console.log('>--当前正在使用的版本号为：', colors.red(config.version))
  if (
    !~versionHistory.list.indexOf(config.version) ||
    !~versionHistory.list.indexOf(kiteConfig.version)
  ) {
    console.log('当前版本不在版本库历史中，无法升级')
    return false
  }
  if (kiteConfig.version !== config.version) {
    // 判断当前使用的版本是否大于程序的版本
    if (
      versionHistory.list.indexOf(config.version) <
      versionHistory.list.indexOf(kiteConfig.version)
    ) {
      isUpdateOption()
    } else {
      console.log('不能向后更新，待更新版本不能小于当前版本')
    }
  } else {
    console.log('当前程序版本与正在使用的版本一致，无需更新')
  }
} else {
  console.log('当前项目还未进行初始化，无需更新项目，直接拉取最近版本安装即可')
  console.log('安装命令为 npm run init')
}
