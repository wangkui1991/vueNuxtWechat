import reply from '../wechat/reply'
import config from '../config'
import wechatMiddle from '../wechat-lib/middleware'

// eslint-disable-next-line no-unused-vars
import { controller, get, post } from '../decorator/router'
import { signature, redirect, oauth } from '../controllers/wechat'

@controller('')
export class WechatController {
  @get('/wechat-hear')
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }
  @post('/wechat-hear')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    await middle(ctx, next)
  }
  @get('/wechat-signature')
  async wechatSignature (ctx, next) {
    console.log(12)
    await signature(ctx, next)
  }
  @get('/wechat-redirect')
  async wechatRedirect (ctx, next) {
    await redirect(ctx, next)
  }
  @get('/wechat-oauth')
  async wechatOauth (ctx, next) {
    await oauth(ctx, next)
  }
}
