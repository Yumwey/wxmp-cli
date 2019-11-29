const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const shell = require('shelljs')
const day = require('dayjs')

const isExist = path => {
  return fs.existsSync(path)
}

const cwd = () => process.cwd()

const log = {
  warn(msg) {
    console.log(chalk.yellow(`\n\r⚠️  ${msg}\n\r`))
  },
  success(msg) {
    console.log(chalk.green(`\n\r✅  ${msg}\n\r`))
  },
  error(msg) {
    console.log(chalk.red(`\n\r❌  ${msg}\n\r`))
  },
  line() {
    console.log('/n')
  }
}

const getTemp = (type, name, answer, cb) => {
  const createPageDirPath = path.join(cwd(), name)
  if (isExist(createPageDirPath)) {
    log.error(`${type === 'page' ? 'Page' : 'Component'} "${name}" already exsited in this folder!`)
  } else {
    fs.mkdirSync(createPageDirPath)
    shell.cp('-R', path.join(__dirname, `../template/${type}/*`), createPageDirPath)
    shell.cd(createPageDirPath)
    shell.ls('*.js').forEach(file => {
      shell.sed('-i', 'TIME_STAMP', day().format('YYYY-MM-DD HH:mm:ss'), file)
      shell.sed('-i', 'DESC', answer.desc, file)
      let gitUserName = shell.exec('git config --get user.name', {silent:true}).stdout
      gitUserName = gitUserName && gitUserName.replace('\n', '')
      if (gitUserName) {
        shell.sed('-i', 'AUTHOR', gitUserName, file)
      }
    })
    log.success('good job!')
    typeof cb === 'function' && cb.call(this)
  }
}

module.exports = {
  isExist,
  cwd,
  log,
  getTemp
}