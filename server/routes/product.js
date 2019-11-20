import api from '../api'
import xss from 'xss'
import R from 'ramda'
// eslint-disable-next-line no-unused-vars
import { controller, get, post, put, del } from '../decorator/router'

@controller('/product')
export class WikiController {
  @get('/products')
  async getProducts (ctx, next) {
    let {limit = 50} = ctx.query
    const data = await api.product.getProducts(limit)
    ctx.body = {
      success: true,
      data: data
    }
  }
  @get('/products/:_id')
  async getProduct (ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    const data = await api.product.getProduct(_id)

    ctx.body = {
      data: data,
      success: true
    }
  }
  @post('/products')
  async postProducts (ctx, next) {
    let product = ctx.request.body

    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      images: R.map(xss)(product.images),
      parameters: R.map(
          item => ({
            key: xss(item.key),
            value: xss(item.value)
          })
      )(product.parameters)

    }
    try {
      product = await api.product.save(product)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (e) {
      ctx.body = {
        success: false,
        data: e

      }
    }
  }
  @put('/products')
  async putProducts (ctx, next) {
    let body = ctx.query.body
    const {_id} = body

    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    let product = api.product.getProduct(_id)

    if (!product) {
      return (ctx.body = {
        success: false,
        err: 'product not exist'
      })
    }
    product.title = xss(body.title)
    product.price = xss(body.price)
    product.intro = xss(body.intro)
    product.images = R.map(xss)(body.images)
    product.parameters = R.map(
        item => ({
          key: xss(item.key),
          value: xss(item.value)
        })
    )(body.parameters)
    try {
      product = await api.product.update(product)
      ctx.body = product
    } catch (e) {
      ctx.body = {
        success: false,
        data: e

      }
    }
  }
  @del('/products')
  async delProducts (ctx, next) {
    let body = ctx.query.body
    const {_id} = body

    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    try {
      let product = await api.product.del(_id)
      ctx.body = {
        success: true,
        data: product
      }
    } catch (err) {
      ctx.body = {
        success: false,
        data: err

      }
    }
  }
}
