const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const { cwd, isExist, log } = require('./util')

const init = function initProject(cmd) { 
  return new Promise(function (resolve,reject) {
    inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: `What's the name of your project?`,
      default() {
        return 'my-wxapp'
      },
      validate(val) {
        if (isExist(path.join(cwd(), `./${val}`))) {
           // 存在目录
          log.line()
          log.error(`"${val}" already exsited in this folder! try again! (ctrl+c for exit)`)
          return false
        }
        return true
      }
    },{
      type: 'list',
      name: 'type',
      message: `Select the type of project you want`,
      choices: [
        chalk.blue('simple'),
        chalk.blue('temp')
      ]
    }]).then(answers => {
      resolve(answers)
    }) 
  })

}

module.exports  = init