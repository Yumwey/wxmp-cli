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
const { isExist, cwd, log } = require('../lib/util')
const day = require('dayjs')

cmder.version('1.0.0', '-v, --version')
  .option('-i, --init', 'init a wx app')
  .action(cmd => {
    if (cmd.init) {
      init().then(async res => {
        // console.log(res.name)
        const spin = ora(`downloading ${res.type}`).start()
        let bar
        const stream = await got.stream('https://github.com/Yumwey/wxmp-cli/releases/download/1/test.tgz')
          .on('downloadProgress', (progress) => {
             
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
  .option('-p, --page <pageName>', 'create a page')
  .action(cmd => {
    if (cmd.page) {
        inquirer.prompt([{
          type: 'input',
          name: 'desc',
          message: `input page description?`,
          default() {
            return ''
          }
        }
      ]).then(answer => {
        const createPageDirPath = path.join(cwd(), cmd.page)
        if (isExist(createPageDirPath)) {
          log.error(`Page "${cmd.page}" already exsited in this folder!`)
        } else {
          fs.mkdirSync(createPageDirPath)
          shell.cp('-R', path.join(__dirname, '../template/page/*'), createPageDirPath)
          shell.cd(createPageDirPath)
          shell.ls('*.js').forEach(file => {
            shell.sed('-i', 'TIME_STAMP', day().format('YYYY-MM-DD HH:mm:ss'), file)
            shell.sed('-i', 'DESC', answer.desc, file)
            const gitUserName = shell.exec('git config --get user.name', { silent:true }).stdout
            if (gitUserName) {
              shell.sed('-i', 'AUTHOR', gitUserName, file)
            }
          })
          shell.cd('..')
        }
      })
    }
  })
  .option('-t')
  .action(cmd => {
    shell.ls('*.json').forEach(file => {
      let routeString = null
      const fileString = fs.readFileSync(file, 'utf-8')
      fileString.trim().replace(/"pages":\s*\[([^\]]*)],/g, (s,v) => {
        routeString = v
      })
      console.log(routeString)
    })
  })

cmder.on('-h', () => {
  console.log('')
  console.log('Examples:');
  console.log('wxm -i myapp -t simple');
})

cmder.parse(process.argv)