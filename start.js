const { resolve } = require('path')
const r = path => resolve(__dirname, path)
require('@babel/register')({
  presets: ['latest-node'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    [
      'module-resolver',

      {
        root: ['./'],
        alias: {
          '~': './server',
          'database': './server/database'
        }
      }

    ]
  ]
})

require('@babel/polyfill')
require('./server')
