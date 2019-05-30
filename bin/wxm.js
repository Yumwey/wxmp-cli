#!/usr/bin/env node

const cmder = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')

cmder.version('1.0.0')
  .option('-i, --init', 'init a wx app')
  .action(cmd => {
    if (cmd.init) {
      inquirer.prompt([{
        type: 'input',
        name: 'name:',
        message: `What's the name of your project?`,
        default() {
          return 'my-wxapp'
        }
      },{
        type: 'list',
        name: 'type',
        message: `What kind of project do you need?`,
        choices: [
          chalk.blue('simple -- (Common template)'),
          chalk.red('complex -- (Includes engineering flow tools, such as mobx,sass,mock etc...)')
        ]
      }]).then(answers => {
        console.log(answers)
        
      })
    }
    if (cmd.type) {
      inquirer.prompt([{
        type: 'expand',
        name: 'type',
        message: '选择你的项目类型',
        choices: [{
          key: 's',
          message: 's'
        }]
      }])
    }
  })

cmder.on('-h', () => {
  console.log('')
  console.log('Examples:');
  console.log('wxm -i myapp -t simple');
})

cmder.parse(process.argv)