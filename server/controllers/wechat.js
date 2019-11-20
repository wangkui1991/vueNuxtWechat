import * as api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

export async function signature (ctx, next) {
  let url = ctx.query.url

  if (!url)ctx.throw(404)

  url = decodeURIComponent(url)
  let params = await api.wechat.getSignatureAsync(url)
  ctx.body = {
    success: true,
    params: params
  }
}

export async function redirect (ctx, next) {
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const {a, b} = ctx.query
  const params = `${a}_${b}`
  const url = api.wechat.getAuthorizeURL(scope, target, params)

  console.log('url', url)
  ctx.redirect(url)
}

export async function oauth (ctx, next) {
  let url = ctx.query.url
  console.log('33', url)
  url = decodeURIComponent(url)
  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  console.log('code', code)
  const user = await api.wechat.getUserByCode(code)

  console.log(user)

  ctx.body = {
    success: true,
    data: user
  }
}
