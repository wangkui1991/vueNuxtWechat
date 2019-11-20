import api from '../api'

// eslint-disable-next-line no-unused-vars
import { controller, get, post } from '../decorator/router'

@controller('/wiki')
export class WikiController {
  @get('/houses')
  async getHouses (ctx, next) {
    const data = await api.wiki.getHouses()
    ctx.body = {
      success: true,
      data: data
    }
  }
  @get('/houses/:_id')
  async getHouse (ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    const house = await api.wiki.getHouse(_id)

    ctx.body = {
      data: house,
      success: true
    }
  }
  @get('/characters')
  async getCharacters (ctx, next) {
    let {limit = 20} = ctx.query
    const data = await api.wiki.getCharacters(limit)

    ctx.body = {
      data: data,
      success: true
    }
  }
  @get('/characters/:_id')
  async getCharacter (ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    const data = await api.wiki.getCharacter(_id)

    ctx.body = {
      data: data,
      success: true
    }
  }
}
