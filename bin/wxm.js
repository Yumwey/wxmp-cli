#!/usr/bin/env node

const cmder = require('commander')
const chalk = require('chalk')
const path = require('path')
const inquirer = require('inquirer')
const init = require('../lib/init')
 
cmder.version('1.0.0', '-v,--version')
  .option('-i, --init', 'init a wx app')
  .action(cmd => {
    if (cmd.init) {
      init().then(res => {
        console.log(res['name'])
      })
    }
  })

cmder.on('-h', () => {
  console.log('')
  console.log('Examples:');
  console.log('wxm -i myapp -t simple');
})

cmder.parse(process.argv)