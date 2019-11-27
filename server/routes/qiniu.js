
// eslint-disable-next-line no-unused-vars
import { controller, get, post, put, del } from '../decorator/router'
import * as qiniu from '../libs/qiniu'
@controller('/qiniu')
export class QiniuController {
  @get('/token')
  async qiniuToken (ctx, next) {
    let key = ctx.query.key
    let token = qiniu.uptoken(key)
    console.log('token', token)
    ctx.body = {
      success: true,
      data: {
        key: key,
        token: token
      }
    }
  }
}
