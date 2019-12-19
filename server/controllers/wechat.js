import api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import { getParamsAsync } from '../wechat-lib/pay'

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
  const {visit, id} = ctx.query
  const params = id ? `${visit}_${id}` : visit

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

  ctx.session.user = user
  console.log('useruser', user)

  ctx.body = {
    success: true,
    data: user
  }
}

export async function wechatPay (ctx, next) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  const {
    productId,
    name,
    phoneNumber,
    address
  } = ctx.request.body

  const product = await api.product.getProduct(productId)
  console.log(1, product)
  if (!product) {
    return (ctx.body = {
      success: false, err: '这个宝贝不在了'
    })
  }
  console.log(2, session)
  try {
    let user = await api.user.findUserByUnionId(session.user.unionid).exec()

    if (!user) {
      user = await api.user.saveFromSession(session)
    }
    console.log(3)
    const orderParams = {
      body: product.title,
      attach: '公众号周边手办支付',
      out_trade_no: 'Product' + (+new Date()),
      spbill_create_ip: ip,
      // total_fee: product.price * 100,
      total_fee: 0.01 * 100,
      openid: session.user.unionid,
      trade_type: 'JSAPI'
    }
    console.log(4)
    const order = await getParamsAsync(orderParams)
    const payment = await api.payment.create(user, product, order, '公众号', {
      name,
      address,
      phoneNumber
    })
    console.log(5)
    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (err) {
    ctx.body = {
      success: false,
      err: err
    }
  }
}
