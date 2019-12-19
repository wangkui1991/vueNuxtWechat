// eslint-disable-next-line no-unused-vars
import { controller, get, post, put, del, required } from '../decorator/router'
import api from '../api'

@controller('/user')
export class ProductController {
  @post('login')
  @required({body: ['email', 'password']})
  async login (ctx, next) {
    const {email, password} = ctx.request.body
    const data = await api.user.login(email, password)
    let {user, match} = data
    if (match) {
      ctx.session.user = {
        _id: user._id,
        role: user.role,
        email: user.email,
        nickname: user.nickname,
        avatarUrl: user.avatarUrl
      }
      return (ctx.body = {
        success: true,
        user: {
          email: user.email,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl
        },
        msg: 'ok'
      })
    }
    return (ctx.body = {
      success: false,
      errors: '密码错误'
    })
  }
  @post('logout')
  async logout (ctx, next) {
    ctx.session = null
    ctx.body = {
      success: true
    }
  }
  @get('user')
  async dbUsers (ctx, next) {
    const res = await api.user.dbUsers(ctx, next)

    ctx.body = {
      data: res[0],
      success: true
    }
  }
}
