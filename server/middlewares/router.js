import Router from 'koa-router'
import reply from '../wechat/reply'
import config from '../config'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'

export const router = app => {
  const router = new Router()

  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

  router.get('/upload', async (ctx, next) => {
    let mp = require('../wechat')
    let client = mp.getWechat()

    const data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../../ice.jpg'), { type: 'image' })
    console.log('5', data)
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
