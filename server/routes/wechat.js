import Router from 'koa-router'
import reply from '../wechat/reply'
import config from '../config'
import wechatMiddle from '../wechat-lib/middleware'
import { resolve } from 'path'

import { signature, redirect, oauth } from '../controllers/wechat'

export const router = app => {
  const router = new Router()

  router.all('/wechat-hear', wechatMiddle(config.wechat, reply))

  router.get('/upload', async (ctx, next) => {
    let mp = require('../wechat')
    let client = mp.getWechat()

    // const news = {
    //   articles: [
    //     {
    //       title: 'ssr',
    //       'thumb_media_id': '图文id',
    //       'author': 'kuiwang',
    //       'digest': '摘要',
    //       'show_cover_pic': 1,
    //       'content': '没有内容',
    //       'content_source_url': '跳转地址',
    //       'need_open_comment': 1,
    //       'only_fans_can_comment': 1
    //     }
    //   ]
    // }
    // const permanentVideo = {
    //   type: 'video',
    //   description: '{{"title":"haha","introduction":"heihei"}}'
    // }

    const data = await client.handle(
      'uploadMaterial',
      'image',
      resolve(__dirname, '../../ice.jpg'),
      { type: 'image' }
    )
    console.log('5', data)
  })
  router.get('/wechat-signature', signature)
  router.get('/wechat-redirect', redirect)
  router.get('/wechat-oauth', oauth)
  app.use(router.routes())
  app.use(router.allowedMethods())
}
