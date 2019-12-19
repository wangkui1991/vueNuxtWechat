
require('@babel/register')({
  presets: ['latest-node'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    [
      'module-resolver',

      {
        root: ['./'],
        alias: {
          '~': './',
          'database': './server/database'
        }
      }

    ]
  ]
})

require('@babel/polyfill')
require('./server')
