import * as api from '../api'

export async function signature (ctx, next) {
  let url = ctx.query.url

  if (!url)ctx.throw(404)

  url = decodeURIComponent(url)
  let params = await api.getSignatureAsync(url)
  ctx.body = {
    success: true,
    params: params
  }
}
