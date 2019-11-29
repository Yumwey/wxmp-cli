#!/usr/bin/env node

const cmder = require('commander')
const chalk = require('chalk')
const path = require('path')
const inquirer = require('inquirer')
const init = require('../lib/init')
const got = require('got')
const tar = require('tar')
const fs = require('fs')
const ora = require('ora')
const shell = require('shelljs')
const { isExist, cwd, log, getTemp } = require('../lib/util')


cmder.version('1.0.0', '-v, --version')
  .option('-i, --init', 'init a wx app')
  .action(cmd => {
    if (cmd.init) {
      init().then(async res => {
        // console.log(res.name)
        const spin = ora(`downloading ${res.type}`).start()
        let bar
        const stream = await got.stream('https://github.com/Yumwey/wxmp-cli/releases/download/0.0.1/simple.tgz')
          .on('downloadProgress', (progress) => {
             console.chalk(chalk.white(`${progress.percent / progress.total}`))
          })
          fs.mkdirSync(path.join(cwd(), res.name))
          stream.pipe(tar.x({
            strip: 1,
            C: path.join(cwd(), res.name)
          })).on('close', () => { 
            spin.succeed()
          }).on('error', () => {
            spin.fail()
          })
      })
    }
  })
  .option('-p, --page <page name>', 'create a page')
  .action(cmd => {
    if (cmd.page) {
        inquirer.prompt([{
          type: 'input',
          name: 'desc',
          message: `input page description. (default: empty):`,
          default() {
            return ''
          }
        },
        {
          type: 'input',
          name: 'addRoute',
          message: `do you need add route? only support main page (default: N) [Y/N]:`,
          default() {
            return 'N'
          },
          validate(val) {
            const parentPath = path.join(cwd(), '../')
            if (isExist(path.join(parentPath, 'app.json'))) {
              return ['y', 'n', 'yes', 'no'].includes(val.toLowerCase())
            } else {
              log.error(`There is no app.json file in the current folder`)
              return false
            }
          }
        }
      ]).then(answer => { 
        getTemp('page', cmd.page, answer, () => {
          shell.cd('../../')
          const lowerAnswer = answer.addRoute.toLowerCase()
          if (lowerAnswer === 'y' || lowerAnswer === 'yes') {
            if (isExist('app.json')) {
              const fileString = fs.readFileSync('app.json', 'utf-8')
              const newString = fileString.trim().replace(/"pages":\s*\[([^\]]*)],/g, (s,v) => {
                // 只支持主包输出路由
                return `"pages": [${v},\n   "pages/${cmd.page}/index"\n   ],`
              })
              fs.writeFileSync('app.json', newString)
            }
          }
        }) 
      })
    }
  })
  .option('-c, --comp <component name>', 'create a component')
  .action(cmd => {
    if (cmd.comp) {
      inquirer.prompt([{
        type: 'input',
        name: 'desc',
        message: `input component description. (default: empty):`,
        default() {
          return ''
        }
      }]).then(answer => {
        if (cwd().includes('components')) {
          getTemp('component', cmd.comp, answer)
        } else {
          log.warn(`this isn't a component folder!`)
        }
      })
    }
  })

cmder.on('-h', () => {
  console.log('')
  console.log('Examples:');
  console.log('wxm -i myapp -t simple');
})

cmder.parse(process.argv)