const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const isExist = function exit(path) {
  return fs.existsSync(path)
}

const cwd = () => process.cwd()

const log = {
  warn(msg) {
    console.log(chalk.yellow(`⚠️  ${msg}`))
  },
  success(msg) {
    console.log(chalk.green(`✅  ${msg}`))
  },
  error(msg) {
    console.log(chalk.red(`❌  ${msg}`))
  },
  line() {
    console.log('/n')
  }
}
module.exports = {
  isExist,
  cwd,
  log
}