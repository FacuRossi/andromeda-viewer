'use strict'

var path = require('path')

var standardConfig = require('./webpack.config.js')

var cwd = process.cwd()

// config file for tests. Overwrites standardConfig
// Will compile files that have transformed dependencies

standardConfig.entry = path.join(cwd, 'network', 'networkMessages.js')
standardConfig.output = Object.assign(standardConfig.output, {
  filename: 'testBundle.js',
  libraryTarget: 'commonjs2'
})
standardConfig.target = 'node'

module.exports = standardConfig