#!/usr/bin/env node
const shell = require('shelljs')

class Shell {
  static esc () {
    shell.echo('初始化程序完成，退出cli成功')
    process.exit()
  }
}

module.exports = Shell
